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

        [HttpPost]
        public bool CheckEmailConfiguration(EmailConfigurationModel emailModel)
        {
            try
            {
                //EmailConfigurationModel emailModel = repository.EmailConfiguration_View(Institution_Id);
                String Email = emailModel.Sender_Email_Id;
                String Password = emailModel.Password;
                String SMTPServer = emailModel.ServerName;
                int ClientPort = emailModel.PortNo;
                String DisplayName = emailModel.DisplayName;
                String UserName = emailModel.UserName;
                Boolean SSL = true;
                if (emailModel.EConfigSSL_Enable == 2)
                {
                    SSL = false;
                }
                NetworkCredential nw = new NetworkCredential(Email, Password);

                SmtpClient client = new SmtpClient(SMTPServer);

                client.Host = SMTPServer;

                if (SSL == true)
                {
                    client.EnableSsl = true;
                    //The below line is added to handle TLS - Transport Layer Security
                    ServicePointManager.ServerCertificateValidationCallback = delegate (object s, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
                    { return true; };
                }
                else
                {
                    client.EnableSsl = false;
                }

                client.UseDefaultCredentials = false;
                client.Timeout = 600000;
                client.Credentials = nw;
                client.Port = ClientPort;
                MailMessage msg = new MailMessage();
                msg.From = new MailAddress(nw.UserName, DisplayName);
                msg.To.Add(emailModel.Sender_Email_Id);
                msg.Subject = "Testing";
                msg.Body = "Hi Team";
                msg.IsBodyHtml = true;
                msg.Priority = MailPriority.High;
                msg.DeliveryNotificationOptions = DeliveryNotificationOptions.OnSuccess | DeliveryNotificationOptions.OnFailure;
                client.Send(msg);
                client.Dispose();
                msg.Dispose();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}