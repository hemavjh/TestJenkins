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
  
using Newtonsoft.Json;
using MyCortex.Repositories.Template;
using MyCortex.Template.Models;
using MyCortex.Provider;

namespace MyCortex.Template.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class SMSTemplateController : ApiController
    {
        static readonly ISMSTemplateRepository repository = new SMSTemplateRepository();
 

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        /// <summary>
        /// SMS Template --> SMS Template  Details --> Add/Edit Page
        /// to Insert/Update the entered SMS Template  Information
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">details of SMS Template </param>      
        /// <returns>template details of the Inserted/Updated record</returns>

        public HttpResponseMessage SMSTemplateTag_AddEdit([FromBody] SMSTemplateDesignModel obj)
        {
            IList<SMSTemplateDesignModel> ModelData = new List<SMSTemplateDesignModel>();
            SMSTemplateReturnListModels model = new SMSTemplateReturnListModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.SMSTempData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.SMSTemplateTag_AddEdit(obj);

                if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Template created successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "Template updated successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Template updated successfully";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.SMSTempData = ModelData;
                model.Message = messagestr;// "User created successfully";

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                model.Status = "False";
                model.Message = ex.Message;
                model.SMSTempData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


        /// <summary>
        /// to deactivate a SMS Template
        /// </summary>
        /// <param name="Id">SMS Template Id</param>
        /// <returns>success response of deactivate</returns>
        [HttpGet]
        public HttpResponseMessage SMSTemplate_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.SMSTemplate_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to activate a SMS Template
        /// </summary>
        /// <param name="Id">SMS Template Id</param>
        /// <returns>success response of activate</returns>
        [HttpGet]
        public HttpResponseMessage SMSTemplate_Active(int Id)
        {
            if (Id > 0)
            {
                repository.SMSTemplate_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// get the Template tag list
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Template tag list</returns>
        [HttpGet]
        public IList<TagListModels> TemplateTag_List(long Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<TagListModels> model;
            try
            {
                model = repository.TemplateTag_List(Id);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>
        /// to get SMS Template and Tag mapping list for the institution
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>SMS Template and Tag mapping list for the institution</returns>
        [HttpGet]
        public IList<TagListMappingModels> SMSTemplateTagMapping_List(long Id, long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<TagListMappingModels> model;
            try
            {
                model = repository.SMSTemplateTagMapping_List(Id, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

    }
}