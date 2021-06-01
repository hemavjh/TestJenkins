﻿using MyCortex.Admin.Models;
using MyCortex.Repositories;
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
using MyCortex.Repositories.Masters;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{
    // [Authorize]
    [CheckSessionOutFilter]
    public class MyHomeController : ApiController
    {
        static readonly IMyHomeRepository repository = new MyHomeRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber)
        {
            IList<TabListModel> model;
            try
            {
                model = repository.Tab_List(IsActive, Institution_Id, Login_Session_Id,StartRowNumber,EndRowNumber);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet]
        public TabListModel Tab_ListView(int Id)
        {
            TabListModel model = new TabListModel();
            model = repository.Tab_ListView(Id);
            return model;
        }
        [HttpGet]
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
        [HttpPost]
        public HttpResponseMessage Tab_InsertUpdate([FromBody] TabListModel obj)
        {

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
                model.TabUserDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating MyHome";
                model.TabUserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public HttpResponseMessage TabDevice_List(long InstitutionId, long Tab_ID)
        {
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
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Listing Devices";
                model.TabDeviceList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public HttpResponseMessage TabUser_List(long InstitutionId, long Tab_ID)
        {
            IList<TabUserModel> ModelData = new List<TabUserModel>();
            TabUserListReturnModels model = new TabUserListReturnModels();
            try
            {
                ModelData = repository.Get_TabUsers(InstitutionId, Tab_ID);

                model.TabUserList = ModelData;
                model.Message = "";// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Listing Users";
                model.TabUserList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        [HttpGet]
        public HttpResponseMessage TabLoginUserDetails_List(long Tab_ID,long UserId,string Pin)
        {
            IList<TabUserDetails> ModelData = new List<TabUserDetails>();
            TabUserReturnModels model = new TabUserReturnModels();
            string messagestr = "";
            try
            {
                ModelData = repository.Get_TabLoginUserDetails(Tab_ID, UserId, Pin);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Get from Tab User Information";
                    model.ReturnFlag = 1;
                }else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "TabID are not matching, please verify";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "UserId and/or Pin are not matching, please verify";
                    model.ReturnFlag = 0;
                }
                model.GetTabUserDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model); 
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Tab Users";
                model.GetTabUserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public HttpResponseMessage TabLoginDashBoardList(long InstitutionId,long UserId,long TabId)
        {
            return null;
        }
    }
}
    