using log4net;
using MyCortex.Admin.Models;
using MyCortex.Provider;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MyCortex.Admin.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class EmailConfigurationController : ApiController
    {
        static readonly IEmailConfigurationRepository repository = new EmailConfigurationRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// to Insert/Update the entered Email Configuration Information into database of a institution
        /// </summary>
        /// <param name="model">Email Configuration details</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]
        public HttpResponseMessage EmailConfiguration_AddEdit(EmailConfigurationModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    long Id = repository.EmailConfiguration_AddEdit(model);
                    return Request.CreateResponse(HttpStatusCode.OK, Id);
                }
                catch (Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// <summary>
        /// to get Email configuration details of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Email configuration details of a institution</returns>
        [HttpGet]
        public EmailConfigurationModel EmailConfiguration_View(long Institution_Id)
        {
            EmailConfigurationModel model = new EmailConfigurationModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.EmailConfiguration_View(Institution_Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }

            return model;
        }


    }
}