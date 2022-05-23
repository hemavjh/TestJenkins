using MyCortex.Admin.Models;
using MyCortex.Repositories;
  
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
using MyCortex.Repositories.Masters;
using MyCortex.Provider;
using MyCortex.Utilities;

namespace MyCortex.User.Controllers
{
    public class MyHomeController : ApiController
    {
        static readonly IMyHomeRepository repository = new MyHomeRepository(); 
 
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber, long HiveType = 1)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabListModel> model;
            try
            {
                model = repository.Tab_List(IsActive, Institution_Id, Login_Session_Id,StartRowNumber,EndRowNumber, HiveType);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public TabListModel Tab_ListView(int Id)
        {
            TabListModel model = new TabListModel();
            model = repository.Tab_ListView(Id);
            return model;
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage Tab_List_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.Tab_List_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [Authorize]
        [HttpPost]
        [CheckSessionOutFilter]
        public HttpResponseMessage Tab_InsertUpdate([FromBody] TabListModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabListModel> ModelData = new List<TabListModel>();
            TabUserReturnModels model = new TabUserReturnModels();
            

            string messagestr = "";
            try
            {
                ModelData = repository.Tab_InsertUpdate(obj);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "MyHome Id already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "MyHome created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "MyHome updated Successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 7) == true)
                {
                    messagestr = "Maximum Number of Hive License reached already, new Hive user cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if (ModelData.Any(item => item.Flag == 8) == true)
                {
                    messagestr = "Maximum Number of HiveChart License reached already, new HiveChart user cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.TabUserDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating MyHome";
                model.TabUserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
       
        [AllowAnonymous]
        [HttpPost]
        [CheckSessionOutFilter]
        public HttpResponseMessage Tab_User_Pin_Update([FromBody] TabUserPinModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabUserPinModel> ModelData = new List<TabUserPinModel>();
            TabUserPinReturnModels model = new TabUserPinReturnModels();


            string messagestr = "";
            try
            {
                ModelData = repository.Tab_User_Pin_Update(obj);
                if (ModelData.Any(item => item.Flag == 0) == true)
                {
                    messagestr = "UserID or TabId Mismatched";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "User Pin updated Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                model.Message = messagestr;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating MyHome";
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage Get_Tab_ID(long InstitutionId, string Ref_ID)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            TabIdReturnModels model = new TabIdReturnModels();
            try
            {
                model = repository.Get_Tab_ID(InstitutionId, Ref_ID);
                if (model.data == 1)
                {
                    model.Status = "True";
                } else
                {
                    model.Status = "False";
                }
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in get TabID";
                model.Message = "Error in get TabID";
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage TabDevice_List(long InstitutionId, long Tab_ID)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabDevicesModel> ModelData = new List<TabDevicesModel>();
            TabDeviceListReturnModels model = new TabDeviceListReturnModels();
            try
            {
                ModelData = repository.Get_TabDevices(InstitutionId, Tab_ID);

                model.TabDeviceList = ModelData;
                model.Message = "";// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch(Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Listing Devices";
                model.TabDeviceList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage TabUser_List(long InstitutionId, long Tab_ID)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabUserModel> ModelData = new List<TabUserModel>();
            TabUserListReturnModels model = new TabUserListReturnModels();
            try
            {
                ModelData = repository.Get_TabUsers(InstitutionId, Tab_ID);

                model.TabUserList = ModelData;
                model.Message = "";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Listing Users";
                model.TabUserList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage Parameter_List_GroupID(long ParamGroup_ID, long TabId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ParameterModels> ModelData = new List<ParameterModels>();
            ParameterReturnModels model = new ParameterReturnModels();
            try
            {
                ModelData = repository.Parameter_Lists(ParamGroup_ID, TabId);

                model.ParameterList = ModelData;
                model.Message = "";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Listing Users";
                model.ParameterList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public HttpResponseMessage TabPin_CheckValidity([FromBody] TabUserDetails TabLoginObj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            TabUserDetails ModelData = new TabUserDetails();
            TabUserReturnModels model = new TabUserReturnModels();
            string messagestr = "";
            try
            {
                ModelData = repository.Tab_User_Validation(TabLoginObj);
                if (ModelData.Flag == 1)
                {
                    messagestr = "Tab User Login Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if (ModelData.Flag == 2)
                {
                    messagestr = "TabID are not matching, please verify";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if (ModelData.Flag == 3)
                {
                    messagestr = "UserId and/or Pin are not matching, please verify";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.TabUserDetail = ModelData;
                model.Message = messagestr;
                
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model); 
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Tab User Validation";
                model.TabUserDetail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpPost]
        public HttpResponseMessage Tab_Logout_Validation([FromBody] TabAdminDetails TabAdminObj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            TabAdminDetails ModelData = new TabAdminDetails();
            TabAdminDetailsReturnModels model = new TabAdminDetailsReturnModels();

            var username = TabAdminObj.UserName.ToLower();
            TabAdminObj.Password = TabAdminObj.Password;
            TabAdminObj.UserName = username;
            string messagestr = "";
            try
            {
                ModelData = repository.Tab_Logout_Validation(TabAdminObj);
                if (ModelData.Flag == 1)
                {
                    messagestr = "Tab Admin User Validation Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if (ModelData.Flag == 0)
                {
                    messagestr = "Tab Admin credentials not matching, please verify";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.Message = messagestr;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Tab Admin User Validation";
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage TabDashboardDetails(long InstitutionId, long UserId, long TabId, Guid Login_Session_Id, long PatientId = 0)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            TabUserDashBordDetails ModelData = new TabUserDashBordDetails();
            TabUserListReturnModels model = new TabUserListReturnModels();
            string messagestr = "";
            try
            {
                ModelData = repository.GetDashBoardListDetails(InstitutionId, UserId, TabId, Login_Session_Id, PatientId);
                if (ModelData.Flag == 1)
                {

                    messagestr = "Get From DashBoardList Information";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Flag == 2)
                {
                    messagestr = "DashBoardList Information are empty";
                    model.ReturnFlag = 0;
                }

                model.TabDashBoardList = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in DashBoard Tab Users";
                model.TabDashBoardList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

        }

        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage TabDashboardAlertsDetails(long PatientId, long UserTypeId, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabDashBoardAlertDetails> ModelData = new List<TabDashBoardAlertDetails>();
            TabAlertsReturnModels model = new TabAlertsReturnModels();
            string messagestr = "";
            try
            {
                ModelData = repository.Get_ParameterValue(PatientId, UserTypeId, Login_Session_Id);
                model.TabDashBoardAlertDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in DashBoard Alerts";
                model.TabDashBoardAlertDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage Device_List(int? IsActive, long InstitutionId, long HiveType = 1)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabDevicesModel> ModelData = new List<TabDevicesModel>();
            TabDeviceListReturnModels model = new TabDeviceListReturnModels();
            try
            {
                ModelData = repository.Get_DeviceList(IsActive, InstitutionId, HiveType);

                model.TabDeviceList = ModelData;
                model.Message = "";// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Listing Devices";
                model.TabDeviceList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage DeviceName_List(int? IsActive)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabDevicesModel> ModelData = new List<TabDevicesModel>();
            TabDeviceListReturnModels model = new TabDeviceListReturnModels();
            try
            {
                ModelData = repository.Get_DeviceNameList(IsActive);

                model.TabDeviceList = ModelData;
                model.Message = "";// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Listing DeviceName";
                model.TabDeviceList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


        [AllowAnonymous]
        [HttpPost]
        public HttpResponseMessage AddDeviceInsertUpdate([FromBody] TabDevicesModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabDevicesModel> ModelData = new List<TabDevicesModel>();
            TabDeviceListReturnModels model = new TabDeviceListReturnModels();

            string messagestr = "";
            try
            {
                ModelData = repository.Device_InsertUpdate(obj);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Device already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "Device Added successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "Device Updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.TabDeviceList = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Add Device";
                model.TabDeviceList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public IList<MonitoringProtocolModel> ParameterList(long UserId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<MonitoringProtocolModel> model;
            try
            {
                model = repository.ParameterList(UserId);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        
        public HttpResponseMessage Dashboard_UserParametersettings_InsertUpdate([FromBody] DashboardUserParameterSettingsModel model)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DashboardUserParameterSettingsModel> ModelData = new List<DashboardUserParameterSettingsModel>();
            try
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        ModelData = repository.Dashboard_UserParameterSettings_InsertUpdate(model);

                        return Request.CreateResponse(HttpStatusCode.OK, ModelData);
                    }
                    catch (Exception ex)
                    {
                       _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                    }
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
        public HttpResponseMessage Dashboard_UserParameterSettings_InActive(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            if (Id > 0)
            {
                string messagestr = "";
                DashboardUserParameterSettingsModel ModelData = new DashboardUserParameterSettingsModel();
                DashboardUserParameterSettingsReturnModel model = new DashboardUserParameterSettingsReturnModel();
                try
                {
                    model = repository.Dashboard_UserParameterSettings_InActive(Id);
                    if ((model.ReturnFlag == 2) == true)
                    {
                        messagestr = "Dashboard User Parameter Setting Details Can't Be Deactivate!";
                        model.ReturnFlag = 0;
                        model.Status = "False";
                    }
                    else if ((model.ReturnFlag == 1) == true)
                    {
                        messagestr = "Dashboard User Parameter Setting Details has been Deactivated Successfully";
                        model.ReturnFlag = 1;
                        model.Status = "True";
                    }

                    model.Error_Code = "";
                    model.UserParamDetails = ModelData;
                    model.Message = messagestr;
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Error_Code = ex.Message;
                    model.ReturnFlag = 0;
                    model.UserParamDetails = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }               
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        public HttpResponseMessage Dashboard_UserParameterSettings_Active(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DashboardUserParameterSettingsModel ModelData = new DashboardUserParameterSettingsModel();
            DashboardUserParameterSettingsReturnModel model = new DashboardUserParameterSettingsReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                model.UserParamDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            try
            {
                model = repository.Dashboard_UserParameterSettings_Active(Id);

                if ((model.ReturnFlag == 1) == true)
                {
                    messagestr = "Dashboard User Parameter Settings Details has been activated Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }

                model.Error_Code = "";
                model.UserParamDetails = ModelData;
                model.Message = messagestr;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.UserParamDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /* [Authorize]
         [HttpGet]
         [CheckSessionOutFilter]
         public TabDevicesModel Get_Device_id(long DeviceId)
         {
             TabDevicesModel model = new TabDevicesModel();
             model = repository.Get_Device_Id(DeviceId);
             return model;
         }
        */
        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public TabDevicesModel ViewDevice_List(long Id)
        {
            TabDevicesModel model = new TabDevicesModel();
            model = repository.Device_ListView(Id);
            return model;
        }

        [Authorize]
        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage Device_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.Device_List_Delete(Id);
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
    