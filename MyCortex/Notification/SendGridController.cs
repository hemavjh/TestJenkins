﻿using System;
using System.Collections.Generic;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Script.Serialization;
  
using MyCortex.Email.SendGrid;
using MyCortex.Repositories.Template;
using MyCortex.Repositories;

namespace MyCortex.SendGrid.Controllers
{
    public class SendGridController : ApiController
    {

        static readonly ISendEmailRepository repository = new SendEmailRepository();
        private MyCortexLogger _MyLogger = new MyCortexLogger();
       string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        /// <summary>
        /// Post Sendgrid action 
        /// </summary>
        /// <returns></returns>
        [System.Web.Http.HttpPost]
        [ValidateInput(false)]
        public ActionResult SendGrid()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                _MyLogger.Exceptions("INFO", _AppLogger, "Post SendGrid", null, _AppMethod);
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                System.IO.StreamReader reader = new System.IO.StreamReader(HttpContext.Current.Request.InputStream);
                string rawSendGridJson = reader.ReadToEnd();

                _MyLogger.Exceptions("INFO", _AppLogger, rawSendGridJson, null, _AppMethod);

                List<SendGridEvents> events = serializer.Deserialize<List<SendGridEvents>>(rawSendGridJson);
                

                foreach (SendGridEvents sendGridEvent in events)
                {
                    repository.SendEmail_DeliveryStatus(sendGridEvent.@event.ToLower(), sendGridEvent.smtp_id, sendGridEvent.reason);                   
                }
            }
            catch (Exception exception)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, exception.Message, exception, _AppMethod);
            }
            return new HttpStatusCodeResult(200);
        }
    }
}
