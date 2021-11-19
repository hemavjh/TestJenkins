using MyCortex.Repositories;
using MyCortex.Repositories.EmailAlert;
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
using Newtonsoft.Json;
using MyCortex.EmailAlert.Models;
using MyCortex.Provider;

namespace MyCortex.EmailAlert.Controllers
{
     [Authorize]
    [CheckSessionOutFilter]
    public class EmailAlertConfigController : ApiController
    {
        static readonly IEmailAlertConfigRepository repository = new EmailAlertConfigRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);


        /* THIS IS FOR ADD EDIT FUNCTION */
        /// <summary>
        /// Email Template --> Email Alert  Details --> Add/Edit Page
        /// to Insert/Update the entered Email Alert details
        /// </summary>
        /// <param name="obj">Email Alert detail model</param>      
        /// <returns>Email Alert details of the Inserted/Updated record</returns>
        public HttpResponseMessage EmailAlertDetails_AddEdit([FromBody] EmailAlertmodel obj)
        {

            IList<EmailAlertmodel> ModelData = new List<EmailAlertmodel>();
            EmailAlertmodelReturnModels model = new EmailAlertmodelReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.EmailAlert = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.EmailAlertDetails_AddEdit(obj);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Alert already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "Alert Details created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "Alert Details updated successfully";
                    model.ReturnFlag = 1;
                }
                model.EmailAlert = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Alert";
                model.EmailAlert = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to get Email Alert of a selected record
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>Email Alert detail of a selected record</returns>
        [HttpGet]
        public EmailAlertmodel EmailAlert_View(long Id)
        {
            EmailAlertmodel model = new EmailAlertmodel();
            model = repository.EmailAlert_View(Id);
            return model;
        }


        /// <summary>
        /// to get Email Alert  list of selected filter
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>Email Alert list of a selected record</returns>
        [HttpGet]
        public IList<EmailAlertmodel> EmailAlert_List(long Id, int IsActive)
        {
            IList<EmailAlertmodel> model;
            try
            {
                model = repository.EmailAlert_List(Id, IsActive);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to deactivate a Email alert detail
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>success response of email alert deactivated</returns>
        [HttpGet]
        public HttpResponseMessage EmailAlert_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.EmailAlert_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to activate a Email alert detail
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>success response of email alert activated</returns>
        [HttpGet]
        public HttpResponseMessage EmailAlert_Active(int Id)
        {
            if (Id > 0)
            {
                repository.EmailAlert_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to get list of Email alert detail of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>list of Email alert detail of a institution</returns>
        [HttpGet]
        public IList<EventModel> AlertEvent_List(int Institution_Id, int Id,int status)
        {
            IList<EventModel> model;
            try
            {
                model = repository.AlertEvent_List(Institution_Id ,Id,status);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Email Template name list for the given filter
        /// </summary>
        /// <param name="TemplateType_Id">TemplateType Id</param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Email Template name list</returns>
        [HttpGet]
        public IList<EmailAlertmodel> Template_List(int TemplateType_Id, int Institution_Id)
        {
            IList<EmailAlertmodel> model;
            try
            {
                model = repository.Template_List(TemplateType_Id, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// get the "To" and "CC" users types of a event 
        /// </summary>
        /// <param name="EventId">Event Id</param>
        /// <returns>get the "To" and "CC" users types of a event </returns>
        [HttpGet]
        public IList<EmailAlertmodel> EventTo_List(long EventId)
        {
            IList<EmailAlertmodel> model;
            try
            {
                model = repository.EventTo_List(EventId);
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