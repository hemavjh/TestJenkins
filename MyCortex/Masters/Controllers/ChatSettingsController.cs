using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using log4net;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;

namespace MyCortex.Masters.Controllers
{

    [Authorize]
    public class ChatSettingsController : ApiController
    {

        static readonly IChatSettingsRepository repository = new ChatSettingsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>      
        /// Admin -->  Chat Settings --> View page
        /// to get the details of Chat Settings
        /// </summary>        
        /// <param name="Id">Id of Chat Settings</param>    
        /// <returns>Populated a AV chat admin settings </returns>
        [HttpGet]
        public IList<ChatSettingsModel> ViewEditChatSettings(int Id)
        {
             IList<ChatSettingsModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ViewEditChatSettings(Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
           
        }

        /// <summary>
        /// to Insert/Update the entered AV/Chat Settings Information 
        /// </summary>
        /// <param name="obj">AV/Chat Settings detail</param>      
        /// <returns>Inserted/Updated settings detail with status</returns>
        [HttpPost]
        public HttpResponseMessage ChatSettings_AddEdit([FromBody] ChatSettingsModel insobj)
        {
            IList<ChatSettingsModel> ModelData = new List<ChatSettingsModel>();
            ChatReturnModels model = new ChatReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.chat = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model); 
            }
            string messagestr = "";
                try
                {
                    ModelData = repository.ChatSettings_AddEdit(insobj);
                   
                    if (ModelData.Any(item => item.FlagType == 1) == true)
                    {
                        messagestr = "Chat Settings created successfully";
                        model.ReturnFlag = 1;
                    }
                    else if (ModelData.Any(item => item.FlagType == 2) == true)
                    {
                        messagestr = "Chat Settings updated Successfully";
                        model.ReturnFlag = 1;
                    }
                    model.chat = ModelData;
                    model.Message = messagestr;// "User created successfully";
                    model.Status = "True";
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                  catch(Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                    model.Status = "False";
                    model.Message = "Error in creating Chat Settings";
                    model.chat = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
           

        }
        
        /// <summary>      
        /// Char Settings  --> Chat Settings
        /// to get the list of Usertypes to give access in matrix format
        /// </summary> 
        /// <returns>List of Usertypes Details</returns>
        [HttpGet]
        public IList<UserTypeModel> ChatSettingsUserType_List()
        {
            try
            {
                IList<UserTypeModel> model;
                model = repository.ChatSettingsUserType_List();
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