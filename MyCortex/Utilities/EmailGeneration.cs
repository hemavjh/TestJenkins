using log4net;
using MyCortex.Admin.Models;
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
using System.Web.Mvc;


namespace MyCortex.Utilities
{
    public class EmailGeneration
    {
        
        static readonly IEmailConfigurationRepository repository = new EmailConfigurationRepository();

        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);


        /// <summary>
        /// Email Template -->Email Template Details --> Add/Edit Page
        /// to Insert/Update the entered Email Template Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of Email Template Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public Boolean EmailHistory_AddEdit(EmailGenerateModel model)
        {
            EmailTemplateModel ModelData = new EmailTemplateModel();
            EmailTemplateReturnModels modellist = new EmailTemplateReturnModels();

            try
            {
                long id = repository.EmailHistory_AddEdit(model);                
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }


        /// <summary>      
        /// Email Configurtion  --> Email Configuration Details --> View Page
        /// to get the details in the view page of a selected Email Configuration
        /// </summary>        
        /// <param name="Id">Id of a Email Configuration</param>    
        /// <returns>Populated a Email Configuration Details DataTable </returns>
     
        public EmailConfigurationModel SendEmail(EmailGenerateModel Message)
        {
            //int Institution_Id,int MessageToId, string MessageSubject,string MessageBody
            EmailConfigurationModel model = new EmailConfigurationModel();
            model = repository.EmailConfiguration_View(Message.Institution_Id);            
            SendComposedEmail(model,Message);           
            return model;
        }
        
        public Boolean SendComposedEmail(EmailConfigurationModel model, EmailGenerateModel Message)
        {
            try
            {
                EmailTemplateModel TempModel = new EmailTemplateModel();
                //EmailRecoverModel Message = new EmailRecoverModel();
                EmailMessage obj = new EmailMessage();
                String Email = model.Sender_Email_Id;
                String Password = model.Password;
                String SMTPServer = model.ServerName;
                int ClientPort = model.PortNo;
                String DisplayName = model.DisplayName;

                String UserName = model.UserName;
                Boolean SSL = model.SSL_Enable;
                NetworkCredential nw = new NetworkCredential(Email, Password);
                obj.MessageTo = Message.MessageToId;
                
                obj.MessageSubject = Message.MessageSubject;
                obj.MessageBody = Message.MessageBody;

                Boolean mailStatus = false;
                mailStatus = SendComposedEmail(obj, nw, SMTPServer, ClientPort, DisplayName, SSL);
                Message.Sender_Details = model.Sender_Email_Id;
                EmailHistory_AddEdit(Message);

                return mailStatus;
            }
            catch
            {
                return false;
            }
        }

        private Boolean SendComposedEmail(EmailMessage obj, NetworkCredential nw, string SMTPServer, int Clientport, string DisplayName, Boolean SSL)
        {
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
            msg.To.Add(obj.MessageTo);
            msg.Subject = obj.MessageSubject;
            msg.Body = obj.MessageBody;
            msg.IsBodyHtml = true;
            msg.Priority = MailPriority.High;

            //attachments
            //msg.Attachments.Add(new Attachment(obj.AttachmentFile));
            // System.Threading.Thread.Sleep(3000);
            client.Send(msg);
            client.Dispose();
            msg.Dispose();

            return true;
        }

        /// <summary>      
        /// </summary>        
        public string GeneratePassword_ByPasswordPolicy(long Institution_Id)
        {
            PasswordPolicyModel model = new PasswordPolicyModel();
            model.Institution_Id = Institution_Id;
            model = pwdrepository.PasswordPolicy_View(Institution_Id);
            if (model != null)
            {
                var Lowercase = 1;
                var Uppercase = 1;
                var NumericRequired = 0;
                var SpecialChar = 0;
                //if (model.LowerCase_Required == true)
                //{
                //    Lowercase = 1;
                //}
                //else
                //{
                //    Lowercase = 0;
                //}
                //if (model.UpperCase_Required == true)
                //{
                //    Uppercase = 1;
                //}
                //else
                //{
                //    Uppercase = 0;
                //}
                if (model.Numeric_Required == true)
                {
                    NumericRequired = 1;
                }
                else
                {
                    NumericRequired = 0;
                }
                if (model.SpecialChar_Required == true)
                {
                    SpecialChar = 1;
                }
                else
                {
                    SpecialChar = 0;
                }
                //PasswordGenerator password = new PasswordGenerator(model.Minimum_Length, model.Maximum_Length, model.LowerCase_Required, model.UpperCase_Required, model.Numeric_Required, model.SpecialChar_Required,model.Without_Char);
                PasswordGenerator password = new PasswordGenerator(model.Minimum_Length, model.Maximum_Length, Lowercase, Uppercase, NumericRequired, SpecialChar, model.Without_Char);
                string generatedPwd = password.Generate();
                if (generatedPwd == null) generatedPwd = "";
                return generatedPwd;
            }
            else
            {
                return "";
            }
        }


    }

    public class EmailMessage
    {
        public string MessageTo { get; set; }
        public string MessageSubject { get; set; }
        public string MessageBody { get; set; }
        public string AttachmentFile { get; set; }
        public int InstitutionId { get; set; }
    }

}