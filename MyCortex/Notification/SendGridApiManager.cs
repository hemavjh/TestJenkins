using System;
using System.Configuration;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Net.Http;
using System.Net.Mail;
using MyCortex.Repositories;
using MyCortex.Repositories.Template;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using MyCortex.Masters.Models;
using MyCortex.Repositories.Masters;
using MyCortex.Notification.Models;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using MyCortex.Admin.Models;

namespace MyCortex.Email.SendGrid
{
    public class SendGridApiManager
    {

        static readonly ISendEmailRepository repository = new SendEmailRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();

        public static Task<Response> SendEmail(SendGridMessage message)
        {
            IList<AppConfigurationModel> model;
            model = commonrepository.AppConfigurationDetails("SENDGRID_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));
            var client = new SendGridClient(model[0].ConfigValue);
            var res= client.SendEmailAsync(message);
            return res;
        }

        public async Task<Response> SendEmailAsync(SendGridMessage message, long templateId)
        {
            IList<AppConfigurationModel> model;
            model = commonrepository.AppConfigurationDetails("SENDGRID_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));
            
            var client = new SendGridClient(model[0].ConfigValue);
            var response = await client.SendEmailAsync(message).ConfigureAwait(false);
            //var response = await client.SendEmailAsync(message);
            if (templateId>0)
            {
                string MessageId = "";
                HttpHeaders headers = response.Headers;
                IEnumerable<string> values;
                if (headers.TryGetValues("X-Message-Id", out values))
                {
                    MessageId = values.First();
                }

                int deliveryStatus = 2;
                /*if (response.StatusCode.ToString().ToLower() == "ok" || response.StatusCode.ToString().ToLower() == "accepted")
                    deliveryStatus = 1;*/
                repository.SendEmail_Update(templateId, response.Body.ReadAsStringAsync().Result.ToString(), deliveryStatus, MessageId);
            }
            return response;
        }

        public static SendGridMessage ComposeSendGridMessage(string from, string fromMail , string subject, string bodyContent, string to, string toMail)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(fromMail, from),
                Subject = subject,
                //PlainTextContent = bodyContent,
                //HtmlContent = "<strong>and easy to do anywhere, even with C#</strong>"
                HtmlContent = bodyContent
            };
            msg.AddTo(new EmailAddress(toMail, to));
            return msg;
        }

        public static SendGridMessage ComposeMailMessage(string from, string fromMail, string subject, string bodyContent, IList<EmailListModel> EmailList)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(fromMail, from),
                Subject = subject,
                //PlainTextContent = bodyContent,
                //HtmlContent = "<strong>and easy to do anywhere, even with C#</strong>"
                HtmlContent = bodyContent
            };
            foreach (EmailListModel email in EmailList)
            {
                if(email.EmailType_Flag==1)
                    msg.AddTo(new EmailAddress(email.EmailId, email.UserName));

                if (email.EmailType_Flag == 2)
                    msg.AddCc(new EmailAddress(email.EmailId, email.UserName));
            }
                
            return msg;
        }


        public Boolean SendComposedSMTPEmail(EmailConfigurationModel emailModel, AlertEventModel alert, IList<EmailListModel> EmailList, long mailId)
        {
            try
            {
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

                Boolean mailStatus = false;
                mailStatus = SendComposedSMTPEmail(alert, nw, SMTPServer, ClientPort, DisplayName, SSL, EmailList, mailId);
                return mailStatus;
            }
            catch
            {
                return false;
            }
        }
        private Boolean SendComposedSMTPEmail(AlertEventModel alert, NetworkCredential nw, string SMTPServer, int Clientport, string DisplayName, Boolean SSL, IList<EmailListModel> EmailList, long mailId)
        {
            try {
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
                client.Port = Clientport;


                MailMessage msg = new MailMessage();
                msg.From = new MailAddress(nw.UserName, DisplayName);

                foreach (EmailListModel email in EmailList)
                {
                    if (email.EmailType_Flag == 1)
                        msg.To.Add(email.EmailId);

                    if (email.EmailType_Flag == 2)
                        msg.CC.Add(email.EmailId);
                }


                msg.Subject = alert.TempSubject;
                msg.Body = alert.TempBody;
                msg.IsBodyHtml = true;
                msg.Priority = MailPriority.High;
                msg.DeliveryNotificationOptions = DeliveryNotificationOptions.OnSuccess | DeliveryNotificationOptions.OnFailure;
                //attachments
                //msg.Attachments.Add(new Attachment(obj.AttachmentFile));
                // System.Threading.Thread.Sleep(3000);
                client.Send(msg);
                client.Dispose();


                msg.Dispose();
                repository.SendEmail_Update(mailId, "", 1, "");
                return true;
            }
            catch (Exception ex)
            {

                repository.SendEmail_Update(mailId, ex.Message, 2, "");
                return false;
            }
        }

        public Boolean SendComposedSMTPEmail_For_ChangePwd(EmailConfigurationModel emailModel, AlertEventModel alert, IList<EmailListModel> EmailList)
        {
            try
            {
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

                foreach (EmailListModel email in EmailList)
                {
                    if (email.EmailType_Flag == 1)
                        msg.To.Add(email.EmailId);

                    if (email.EmailType_Flag == 2)
                        msg.CC.Add(email.EmailId);
                }


                msg.Subject = alert.TempSubject;
                msg.Body = alert.TempBody;
                msg.IsBodyHtml = true;
                msg.Priority = MailPriority.High;
                msg.DeliveryNotificationOptions = DeliveryNotificationOptions.OnSuccess | DeliveryNotificationOptions.OnFailure;
                //attachments
                //msg.Attachments.Add(new Attachment(obj.AttachmentFile));
                // System.Threading.Thread.Sleep(3000);
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
