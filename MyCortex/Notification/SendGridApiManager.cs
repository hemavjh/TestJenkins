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
using System.IO;
using System.Text;
using MyCortex.Repositories.Uesr;
using MyCortex.User.Model;

namespace MyCortex.Email.SendGrid
{
    public class SendGridApiManager
    {

        static readonly ISendEmailRepository repository = new SendEmailRepository();
        static readonly IPatientAppointmentsRepository patentrep = new PatientAppointmentRepository();
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


        public Boolean SendComposedSMTPEmail(EmailConfigurationModel emailModel, AlertEventModel alert, IList<EmailListModel> EmailList, long mailId, string EventCode, long? EntityId)
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
                mailStatus = SendComposedSMTPEmail(alert, nw, SMTPServer, ClientPort, DisplayName, SSL, EmailList, mailId, EventCode, EntityId);
                return mailStatus;
            }
            catch
            {
                return false;
            }
        }
        private Boolean SendComposedSMTPEmail(AlertEventModel alert, NetworkCredential nw, string SMTPServer, int Clientport, string DisplayName, Boolean SSL, IList<EmailListModel> EmailList, long mailId, string EventCode, long? EntityId)
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

                //foreach (EmailListModel email in EmailList)
                for(int i = 0; i < 1; i++)
                {
                    if (EmailList[i].EmailType_Flag == 1 || EmailList[i].EmailType_Flag == 2)
                        msg.To.Add(EmailList[i].EmailId);

                    //if (email.EmailType_Flag == 2)
                    //    msg.CC.Add(email.EmailId);
                }

                if (EventCode == "PAT_APPOINTMENT_CREATION" || EventCode == "APPOINTMENT_APPROVAL" || EventCode == "APPOINTMENT_APPROVED")
                {
                    if (EntityId != 0)
                    {
                        IList<AppointmentsData_For_ICSFile> lis = patentrep.GetAppointmentDetails_For_ICSFile(EntityId);
                        if (lis != null)
                        {
                            if (lis.Count > 0)
                            {
                                string UtcOffSet = lis[0].TimeZoneOffset.Replace(":", "");
                                string TimeZoneName = "Etc/UTC";  //lis[0].TimeZoneName;
                                //some variables for demo purposes
                                DateTime DateStart = lis[0].AppointmentFromDateTime;
                                DateTime DateEnd = lis[0].AppointmentToDateTime;
                                string Summary = "Appointment with Doctor (" + lis[0].DoctorName + ")";
                                string Location = "Event location";
                                string Description = "Appointment Details";

                                //create a new stringbuilder instance
                                StringBuilder sb = new StringBuilder();

                                //start the calendar item
                                sb.AppendLine("BEGIN:VCALENDAR");
                                sb.AppendLine("VERSION:2.0");
                                sb.AppendLine("METHOD:REQUEST");
                                sb.AppendLine("PRODID:mycortexdev1.vjhsoftware.in");
                                sb.AppendLine("CALSCALE:GREGORIAN");
                                //create a time zone if needed, TZID to be used in the event itself
                                sb.AppendLine("BEGIN:VTIMEZONE");
                                sb.AppendLine("TZID:" + TimeZoneName);
                                sb.AppendLine("BEGIN:STANDARD");
                                sb.AppendLine("TZOFFSETTO:" + UtcOffSet);
                                sb.AppendLine("TZOFFSETFROM:" + UtcOffSet);
                                sb.AppendLine("END:STANDARD");
                                sb.AppendLine("END:VTIMEZONE");

                                //add the event
                                sb.AppendLine("BEGIN:VEVENT");
                                sb.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
                                sb.AppendLine(string.Format("DESCRIPTION:{0}", "Please Attend the Appointment with this schedule"));
                                sb.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", "Please Attend the Appointment with this schedule"));
                                //with time zone specified
                                sb.AppendLine("DTSTART;TZID=" + TimeZoneName + ":" + DateStart.ToString("yyyyMMddTHHmm00"));
                                sb.AppendLine("DTEND;TZID=" + TimeZoneName + ":" + DateEnd.ToString("yyyyMMddTHHmm00"));
                                //or without
                                sb.AppendLine("DTSTART:" + DateStart.ToString("yyyyMMddTHHmm00"));
                                sb.AppendLine("DTEND:" + DateEnd.ToString("yyyyMMddTHHmm00"));
                                sb.AppendLine("SUMMARY:" + Summary + "");
                                sb.AppendLine("LOCATION:" + Location + "");
                                sb.AppendLine("DESCRIPTION:" + Description + "");
                                sb.AppendLine("PRIORITY:3");
                                sb.AppendLine("BEGIN:VALARM");
                                sb.AppendLine("TRIGGER:-PT15M");
                                sb.AppendLine("ACTION:DISPLAY");
                                sb.AppendLine("DESCRIPTION:Reminder");
                                sb.AppendLine("END:VALARM");
                                sb.AppendLine("END:VEVENT");

                                //end calendar item
                                sb.AppendLine("END:VCALENDAR");

                                //create a string from the stringbuilder
                                string CalendarItem = sb.ToString();

                                //System.Net.Mime.ContentType contype = new System.Net.Mime.ContentType("text/calendar");
                                //contype.Parameters.Add("method", "REQUEST");
                                //AlternateView avCal = AlternateView.CreateAlternateViewFromString(contents.ToString(), contype);
                                //msg.AlternateViews.Add(avCal);

                                var bytesCalendar = Encoding.UTF8.GetBytes(CalendarItem);
                                MemoryStream ms = new MemoryStream(bytesCalendar);
                                System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(ms, "appointment.ics", "text/calendar");
                                msg.Attachments.Add(attachment);
                            }
                        }
                    }
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
