using System;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MyCortex.User.Model;
  
using System.Security.Cryptography;
using MyCortex.Repositories.Admin;
using MyCortex.Repositories;
using MyCortex.Repositories.User;
using MyCortex.Notification;
using MyCortex.Notification.Models;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class CareCoordinnatorController : ApiController
    {
        static readonly ICarecoordinatorRepository repository = new CareCoordinatorRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>
        /// to get the diagnostic and compliance patient list for the selected filter
        /// </summary>
        /// <param name="Coordinator_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="TypeId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        [CheckSessionOutFilter]
        [HttpPost]
        public IList<CareCoordinatorModel> CareCoordinator_PatientList(long Coordinator_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int TypeId, long UserTypeId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<CareCoordinatorModel> model;
                model = repository.CareCoordinator_PatientList(Coordinator_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, TypeId, UserTypeId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        [CheckSessionOutFilter]
        [HttpPost]
        public IList<CareCoordinatorModel> CareCoordinator_FilterPatientList(long Coordinator_Id, string PATIENTNO, string INSURANCEID, string NATIONALITY_ID, string MOBILE_NO, string EMAILID, long UserTypeId, string FIRSTNAME, string LASTNAME, string MRN, int TypeId, Guid Login_Session_Id, int? AdvanceFilter = 0)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<CareCoordinatorModel> model;
                model = repository.CareCoordinator_FilterPatientList(Coordinator_Id, PATIENTNO, INSURANCEID, NATIONALITY_ID, MOBILE_NO, EMAILID, UserTypeId, FIRSTNAME, LASTNAME, MRN, TypeId, Login_Session_Id, AdvanceFilter);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>     
        /// Get the Care Giver name List based on users group        
        /// </summary>
        /// <returns> Care Giver List based on users groups</returns>
         [HttpPost]
        public IList<CareGiverListModel> CareGiver_List(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<CareGiverListModel> model;
                model = repository.CareGiver_List(Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>     
        /// to insert Assign the Care Giver to a Patient.        
        /// </summary>  
        /// <returns>Inserted Care Giver Records with Status</returns>
        [HttpPost]
        public HttpResponseMessage Assign_CareGiver([FromBody] AssignCareGiverModel Obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<AssignCareGiverModel> ModelData = new List<AssignCareGiverModel>();
            ReturnModel model = new ReturnModel();
            string messagestr = "";
            try
            {
                ModelData = repository.Assign_CareGiver(Obj);
                //if ((ModelData.flag == 1) == true)
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Care Giver Already Assigned by CareCoordinator, cannot be assigned";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                //else if ((ModelData.flag == 2) == true)
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Care Giver Assigned Successfully";
                    model.ReturnFlag = 0;
                    model.Status = "True";
                }
                else
                {
                    messagestr = "Error in Assigning the Care Giver";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.Error_Code = "";
                model.CareGiverDetails = ModelData;
                model.Message = messagestr;

                if (ModelData.Any(item => item.flag == 2) == true)
                {
                    string Event_Code = "";
                    Event_Code = "CC_ASSIGN_CG";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    foreach(AssignCareGiverModel modobj in ModelData)
                    {
                        EmailList = AlertEventReturn.CG_Assign_AlertEvent(modobj.Id);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.Id, (long)Obj.Institution_Id, EmailList);
                    }

                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Assign the Care Giver";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.CareGiverDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        /// <summary>
        /// get user parameter values of a selected patient
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<GetParameterValueModel> Get_ParameterValue(long PatientId, long UserTypeId, Guid Login_Session_Id, int StartRowNumber = 0, int EndRowNumber = 0, int AlertType = 0, long Language_ID = 1)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<GetParameterValueModel> model;
                model = repository.Get_ParameterValue(PatientId, UserTypeId, Login_Session_Id, StartRowNumber, EndRowNumber, AlertType, Language_ID);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        [CheckSessionOutFilter]
        [HttpGet]
        public IList<GetParameterValueCountModel> Get_ParameterValueCount(long PatientId, long UserTypeId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<GetParameterValueCountModel> model;
                model = repository.Get_ParameterValueCount(PatientId, UserTypeId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>     
        /// Get the assign caregiver history
        /// </summary>
        /// <returns> assign caregiver history list</returns>
        [CheckSessionOutFilter]
        [HttpGet]
        public IList<AssignCareGiverModel> Care_Coordinatorhistory(long CareGiverId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<AssignCareGiverModel> model;
                model = repository.Care_Coordinatorhistory(CareGiverId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// diagnostic alert count for the selected filter 
        /// </summary>
        /// <param name="Coordinator_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="TypeId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<CareCoordinatorModel> Diagnostic_GetPatientList_Count(long Coordinator_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int TypeId, long UserTypeId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<CareCoordinatorModel> model;
                model = repository.Diagnostic_GetPatientList_Count(Coordinator_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, TypeId, UserTypeId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
    }
}