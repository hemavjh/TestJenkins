using MyCortex.Repositories;
using MyCortex.Repositories.User;
using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using log4net;
using MyCortex.Notification;
using MyCortex.Notification.Models;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class PatientApprovalController : ApiController
    {
        static readonly IPatientApprovalRepository repository = new PatientApprovalRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// to get list of patients pending for approval based on given filter
        /// </summary>
        /// <param name="InstitutionId"></param>
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
        /// <returns>list of patients pending for approval based on given filter</returns>
        [HttpGet]
        public IList<PatientApprovalModel> PatientApproval_List(long? InstitutionId, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id)
        {
            try
            {
                IList<PatientApprovalModel> model;
                model = repository.PatientApproval_List(InstitutionId, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;

            }
        }

        /// <summary>
        /// Approve selected multiple patients
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>status of approval of multiple patients</returns>
        [HttpPost]
        public HttpResponseMessage Multiple_PatientApproval_Active(List<PatientApprovalModel> obj)
        {
            string messagestr = "";
            PatientApprovalReturnModel model = new PatientApprovalReturnModel();
            try
            {
                model = repository.Multiple_PatientApproval_Active(obj);
                if ((model.ReturnFlag == 2) == true)
                {
                    messagestr = "Maximum Number of Patient License reached already, cannot be approved";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((model.ReturnFlag == 1) && (model.Message == "") == true)
                {
                    messagestr = "Patient Approved Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((model.ReturnFlag == 3) || (model.Message != "") == true)
                {
                    messagestr = model.Message;
                    model.ReturnFlag = 0;
                    model.Status = "True";
                }

                if (model.ReturnFlag == 1)
                { 
                    string Event_Code = "";
                    Event_Code = "PAT_SIGNUP_APPROVE";
                    foreach (PatientApprovalModel item in obj)
                    { 
                        AlertEvents AlertEventReturn = new AlertEvents();
                        IList<EmailListModel> EmailList;
                        EmailList = AlertEventReturn.UserCreateEvent((long)item.Patient_Id, long.Parse(HttpContext.Current.Session["InstitutionId"].ToString()));
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, item.Patient_Id, long.Parse(HttpContext.Current.Session["InstitutionId"].ToString()), EmailList);
                    }
                }
                model.Error_Code = "";
                model.Message = messagestr;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }
        }

        /// <summary>
        /// patient approval getting additional info
        /// </summary>
        /// <param name="model"></param>
        /// <returns>to insert patient approval required additional info/</returns>
        public HttpResponseMessage PatientApproval_History_Insert(PatientApprovalModel model)
        {
            try
            {
                long id = repository.PatientApproval_History_Insert(model);

                AlertEvents AlertEventReturn = new AlertEvents();
                AlertEvents AlertEventReturn_HA = new AlertEvents();
                IList<EmailListModel> EmailList_HA;
                string Event_Code = "";
                Event_Code = "PAT_MOREINFO";
                EmailList_HA = AlertEventReturn.Patient_MoreInfo_AlertEvent((long)id, long.Parse(HttpContext.Current.Session["InstitutionId"].ToString()));

                AlertEventReturn_HA.Generate_SMTPEmail_Notification(Event_Code, id, long.Parse(HttpContext.Current.Session["InstitutionId"].ToString()), EmailList_HA);

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, id);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// patient approval pending count of a institution
        /// </summary>
        /// <param name="InstitutionId"></param>
        /// <returns>patient approval pending count of a institution</returns>
        [HttpGet]
        public IList<PatientApprovalModel> Get_PatientCount(long InstitutionId)
        {
            try
            {
                IList<PatientApprovalModel> model;
                model = repository.Get_PatientCount(InstitutionId);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;

            }
        }

    }
}