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
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Http;

namespace MyCortex.Admin.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class SMSConfigurationController : ApiController
    {
        static readonly ISMSConfigurationRepository repository = new SMSConfigurationRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// to Insert/Update the entered SMS Configuration Information into database of a institution
        /// </summary>
        /// <param name="model">SMS Configuration details</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]
        public HttpResponseMessage SMSConfiguration_AddEdit(SMSConfigurationModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    long Id = repository.SMSConfiguration_AddEdit(model);
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

        /// to get SMS configuration details of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>SMS configuration details of a institution</returns>
        [HttpGet]
        public SMSConfigurationModel SMSConfiguration_View(long Institution_Id)
        {
            SMSConfigurationModel model = new SMSConfigurationModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.SMSConfiguration_View(Institution_Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }

            return model;
        }
    }
}
