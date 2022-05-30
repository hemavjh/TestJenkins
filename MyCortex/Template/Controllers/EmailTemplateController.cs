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
    public class EmailTemplateController : ApiController
    {
        static readonly IEmailTemplateRepository repository = new EmailTemplateRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>
        /// Email Template --> Email Template  Details --> Add/Edit Page
        /// to Insert/Update the entered Email Template  Information
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">details of Email Template </param>      
        /// <returns>template details of the Inserted/Updated record</returns>
        public HttpResponseMessage EmailTemplateTag_AddEdit([FromBody] EmailTemplateDesignModel obj)
        {

            IList<EmailTemplateDesignModel> ModelData = new List<EmailTemplateDesignModel>();
            EmailTemplateReturnListModels model = new EmailTemplateReturnListModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.EmailTempData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.EmailTemplateTag_AddEdit(obj);

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
                model.EmailTempData = ModelData;
                model.Message = messagestr;// "User created successfully";
                
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch(Exception ex)
            {
                model.Status = "False";
                model.Message = ex.Message;
                model.EmailTempData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to get template tag details of a template
        /// </summary>
        /// <param name="Id">Template Id</param>
        /// <returns>template tag details of a template</returns>
        [HttpGet]
        public IList<EmailTemplateTagModel> EmailTemplateTag_View(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EmailTemplateTagModel> model;
            try
            {
                model = repository.EmailTemplateTag_View(Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get Template details of a Id
        /// </summary>
        /// <param name="Id">Template details Id</param>
        /// <returns>Template details of a Id</returns>
        [HttpGet]
        public EmailTemplateDesignModel EmailTemplateDetails_View(long Id)
        {
            EmailTemplateDesignModel model = new EmailTemplateDesignModel();
            model = repository.EmailTemplateDetails_View(Id);
            return model;
        }

        /// <summary>
        /// to get list Template tag details for the given filter
        /// </summary>
        /// <param name="TemplateType_Id">Template type Id</param>
        /// <returns>Template details tag details</returns>
        [HttpGet]
        public IList<EmailTemplateDesignModel> EmailTemplateTag_List(long Id, int IsActive, long TemplateType_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EmailTemplateDesignModel> model;
            try
            {
                model = repository.EmailTemplateTag_List(Id, IsActive, TemplateType_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to deactivate a Email Template
        /// </summary>
        /// <param name="Id">Email Template Id</param>
        /// <returns>success response of deactivate</returns>
        [HttpGet]
        public HttpResponseMessage EmailTemplate_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.EmailTemplate_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to activate a Email Template
        /// </summary>
        /// <param name="Id">Email Template Id</param>
        /// <returns>success response of activate</returns>
        [HttpGet]
        public HttpResponseMessage EmailTemplate_Active(int Id)
        {
            if (Id > 0)
            {
                repository.EmailTemplate_Active(Id);
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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TagListModels> model;
            try
            {
                model = repository.TemplateTag_List(Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get Section Based Email Template and Tag mapping list for the institution
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <param name="SectionName">Section Name</param>
        /// <returns>Section Based Email Template and Tag mapping list for the institution</returns>
        [HttpGet]
        public IList<TagListMappingModels> SectionEmailTemplateTagMapping_List(long Id, long Institution_Id, string SectionName)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TagListMappingModels> model;
            try
            {
                model = repository.SectionEmailTemplateTagMapping_List(Id, Institution_Id, SectionName);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get Email Template and Tag mapping list for the institution
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Email Template and Tag mapping list for the institution</returns>
        [HttpGet]
        public IList<TagListMappingModels> EmailTemplateTagMapping_List(long Id, long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TagListMappingModels> model;
            try
            {
                model = repository.EmailTemplateTagMapping_List(Id, Institution_Id);
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