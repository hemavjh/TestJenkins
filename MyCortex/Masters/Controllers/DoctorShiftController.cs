using MyCortex.Masters.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Masters;
using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Web.Http;
using Newtonsoft.Json;
using MyCortex.Masters.Models;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class DoctorShiftController : ApiController
    {
        static readonly IDoctorShiftRepository repository = new DoctorShiftRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /* THIS IS FOR ADD EDIT FUNCTION */
        /// <summary>
        /// Settings  --> Doctor Shift Details --> Add/Edit Page
        /// to Insert/Update the entered Doctor Shift Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of Doctor Shift Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]       
        public HttpResponseMessage DoctorShift_AddEdit([FromBody]  List<DoctorShiftModel> insobj)
        {

            IList<DoctorShiftModel> ModelData = new List<DoctorShiftModel>();
            DoctorShiftReturnModels model = new DoctorShiftReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.DoctorShift = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            long retflag = 0;
            try
            {
                retflag = repository.DoctorShift_AddEdit(insobj);
                if ((retflag == 1) == true)
                {
                    messagestr = "Doctor Shift Name already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if ((retflag == 2) == true)
                {
                    messagestr = "Doctor Shift created successfully";
                    model.ReturnFlag = 1;
                }
                else if ((retflag == 3) == true)
                {
                    messagestr = "Doctor Shift updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.DoctorShift = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Protocol";
                model.DoctorShift = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>      
        /// Settings--> Doctor Shift (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a company</param>        
        /// <returns>Populated List of Doctor Shift Details DataTable</returns>

        [HttpGet]
        public IList<New_DoctorShiftModel> DoctorShift_List(int IsActive, long InstitutionId, Guid Login_Session_Id)
        {
            IList<New_DoctorShiftModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DoctorShift_List(IsActive, InstitutionId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Settings --> Doctor Shift --> View Page
        /// to get the details in the view page of a selected Doctor Shift
        /// </summary>        
        /// <param name="Id">Id of a Doctor Shift</param>    
        /// <returns>Populated a Doctor Shift Details DataTable </returns>
        [HttpGet]
        public IList<SelectedDaysList> DoctorShiftDayDetails_View(long Id, Guid Login_Session_Id)
        {
            IList<SelectedDaysList> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DoctorShiftDayDetails_View(Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        ///Settings  --> Doctor Shift (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param>        
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>

        [HttpGet]
        public New_DoctorShiftModel DoctorShift_View(long DoctorId, long Id, Guid Login_Session_Id, long institution_id)
        {
            New_DoctorShiftModel model = new New_DoctorShiftModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DoctorShift_View(DoctorId, Id, Login_Session_Id, institution_id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return model;
        }

        /// <summary>
        /// Settings - Doctor Shift Details List - Action - Active
        /// Selected institution details to be activated again by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Doctor Shift details to activate again from Doctor Shift database</returns>
        [HttpPost]
        public HttpResponseMessage DoctorShift_Active([FromBody] DoctorShiftModel noteobj)
        {
            IList<DoctorShiftModel> ModelData = new List<DoctorShiftModel>();
            DoctorShiftReturnModels model = new DoctorShiftReturnModels();
           if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.DoctorShift = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
           }
                string messagestr = "";
               try
                {
                    ModelData = repository.DoctorShift_Active(noteobj);
                  if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "doctor Shift activated successfully";
                    model.ReturnFlag = 2;
                }
                model.DoctorShift = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
               }
               catch (Exception ex)
               {
                   _logger.Error(ex.Message, ex);
                   model.Status = "False";
                   model.Message = "Error in creating doctor Shift";
                   model.ReturnFlag = 0;
                   model.DoctorShift = ModelData;
                   return Request.CreateResponse(HttpStatusCode.BadRequest, model);
               }
            }

        /// <summary>
        /// Settings - Doctor Shift Details List - Action - Inactive
        /// Selected institution details to be Inactivated again by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Doctor Shift details to Inactivated again from Doctor Shift database</returns>
        [HttpPost]
        public HttpResponseMessage DoctorShift_Delete([FromBody] DoctorShiftModel noteobj)
        {

            IList<DoctorShiftModel> ModelData = new List<DoctorShiftModel>();
            DoctorShiftReturnModels model = new DoctorShiftReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.DoctorShift = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.DoctorShift_Delete(noteobj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "doctor Shift deactivated successfully";
                    model.ReturnFlag = 2;
                }
                if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "doctor Shift cannot be deactivated";
                    model.ReturnFlag = 0;
                }
                model.DoctorShift = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating doctor Shift";
                model.ReturnFlag = 0;
                model.DoctorShift = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>      
        /// Settings  --> Doctor Shift details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param>        
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        [HttpGet]
        public IList<ShiftTimingsModel> Shift_List(long Institution_Id)
        {
            IList<ShiftTimingsModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Shift_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Doctor Shift details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param>        
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        [HttpGet]
        public IList<WeekDayModel> Days_List(long Institution_Id)
        {
            IList<WeekDayModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Days_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }            
        }


        /// <summary>      
        /// Settings  --> Active Doctor Shift List details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param> 
        /// <param name="Id">Id of a Institution Id</param> 
        /// <param name="Id">Id of a Doctor Id</param> 
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        [HttpGet]
        public DoctorShiftModel ActivateDoctorShift_List(long Id, long Institution_Id, long Doctor_Id)
        {
            DoctorShiftModel model = new DoctorShiftModel();
            try
            {
                model = repository.ActivateDoctorShift_List(Id, Institution_Id, Doctor_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        //[Authorize]
        [HttpGet]
        public IList<AppointmentTimeZone> TimeZoneList()
        {
            IList<AppointmentTimeZone> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GetTimeZoneList();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        //[Authorize]
        [HttpGet]
        public IList<AppointmentModule> AppointmentModuleList()
        {
            IList<AppointmentModule> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GetAppointmentModuleList();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [HttpPost]
        public HttpResponseMessage Org_AppointmentSettings_InsertUpdate(Guid Login_Session_Id, [FromBody] OrgAppointmentSettings obj)
        {
            IList<OrgAppointmentSettings> ModelData = new List<OrgAppointmentSettings>();
            OrgAppointmentSettingsReturnModels model = new OrgAppointmentSettingsReturnModels();
            string messagestr = "";
            try
            {
                ModelData = repository.GetOrgAppointmentSettings(Login_Session_Id, obj);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "OrganizationAppointmentSettings  already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "AppointmentSettings created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "AppointmentSettings updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.OrgAppointmentSettingDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating OrgAppointmentSettings";
                model.OrgAppointmentSettingDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public OrgAppointmentSettings AppointmentSettingView(long InstitutionId, Guid Login_Session_Id)
        {
            OrgAppointmentSettings model = new OrgAppointmentSettings();
            model = repository.APPOINTMENTLISTDETAILS(InstitutionId, Login_Session_Id);
            return model;
        }

        [HttpGet]
        public OrgAppointmentModuleSettings AppointmentModuleSettingView(long InstitutionId)
        {
            OrgAppointmentModuleSettings model = new OrgAppointmentModuleSettings();
            model = repository.ORG_APPOINTMENT_MODULE_SETTINGS(InstitutionId);
            return model;
        }

        [HttpGet]
        public HttpResponseMessage AppointmentSettingDelete(long InstitutionId)
        {
            if (InstitutionId > 0)
            {
                repository.APPOINTMENTRESETDETAILS(InstitutionId);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
    }
}