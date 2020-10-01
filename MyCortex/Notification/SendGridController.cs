using System;
using System.Collections.Generic;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using log4net;
using MyCortex.Email.SendGrid;
using MyCortex.Repositories.Template;
using MyCortex.Repositories;

namespace MyCortex.SendGrid.Controllers
{
    public class SendGridController : ApiController
    {

        static readonly ISendEmailRepository repository = new SendEmailRepository();
        private readonly ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Post Sendgrid action 
        /// </summary>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        [ValidateInput(false)]
        public ActionResult SendGrid()
        {
            try
            {
                _logger.Info("Post SendGrid");

                JavaScriptSerializer serializer = new JavaScriptSerializer();
                System.IO.StreamReader reader = new System.IO.StreamReader(HttpContext.Current.Request.InputStream);
                string rawSendGridJson = reader.ReadToEnd();

                _logger.Info(rawSendGridJson);

                List<SendGridEvents> events = serializer.Deserialize<List<SendGridEvents>>(rawSendGridJson);
                

                foreach (SendGridEvents sendGridEvent in events)
                {
                    repository.SendEmail_DeliveryStatus(sendGridEvent.@event.ToLower(), sendGridEvent.smtp_id, sendGridEvent.reason);                   
                }
            }
            catch (Exception exception)
            {
                if (_logger.IsErrorEnabled)
                    _logger.Error(exception.Message, exception);
            }
            return new HttpStatusCodeResult(200);
        }
    }
}
