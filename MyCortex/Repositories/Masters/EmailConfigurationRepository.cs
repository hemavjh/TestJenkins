using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using log4net;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Utilities;

namespace MyCortex.Repositories.Admin
{
    public class EmailConfigurationRepository: IEmailConfigurationRepository
    {
         ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public EmailConfigurationRepository()
        {
            db = new ClsDataBase();

        }


        /* THIS IS FOR ADD EDIT FUNCTION */
        /// <summary>
        /// Email Template  --> Email Template Details --> Add/Edit Page
        /// to Insert/Update the entered Institution Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of Email Template Details Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public long EmailHistory_AddEdit(EmailGenerateModel obj)
        {
            long retid;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@Institution_Id", obj.Institution_Id));
            param.Add(new DataParameter("@USERID", obj.UserId));
            param.Add(new DataParameter("@TEMPLATEID", obj.TemplateId));
            param.Add(new DataParameter("@USER_EMAILID_ADDRESS", obj.MessageToId));
            param.Add(new DataParameter("@SUBJECT", obj.MessageSubject));
            param.Add(new DataParameter("@MAILBODAY", obj.MessageBody));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            param.Add(new DataParameter("@SENDER_DETAILS", obj.Sender_Details));
            param.Add(new DataParameter("@MODIFIED_USERID", obj.Modified_UserId));
            retid = ClsDataBase.Insert("[MYCORTEX].[EMAILHISTORY_SP_INSERT]", param, true);
            return retid;
        }
        /// <summary>
        /// to Insert/Update the entered Email Configuration Information into database of a institution
        /// </summary>
        /// <param name="model">Email Configuration details</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public long EmailConfiguration_AddEdit(EmailConfigurationModel obj)
        {
            DataEncryption EncryptPassword = new DataEncryption();
            long retid;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@SENDER_EMAIL_ID", obj.Sender_Email_Id));
            param.Add(new DataParameter("@USERNAME", EncryptPassword.Encrypt(obj.UserName)));
            param.Add(new DataParameter("@PASSWORD", EncryptPassword.Encrypt(obj.Password)));
            param.Add(new DataParameter("@SERVERNAME", obj.ServerName));
            param.Add(new DataParameter("@PORTNO", obj.PortNo));
            param.Add(new DataParameter("@DISPLAYNAME", obj.DisplayName));
            param.Add(new DataParameter("@SSL_ENABLE", obj.EConfigSSL_Enable));
            param.Add(new DataParameter("@REMARKS", obj.Remarks));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                retid = ClsDataBase.Insert("[MYCORTEX].EMAILCONFIGURAION_INSERTUPDATE", param, true);
                return retid;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        /// <summary>
        /// to get Email configuration details of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Email configuration details of a institution</returns>
        public EmailConfigurationModel EmailConfiguration_View(long Institution_Id)
        {
            DataEncryption EncryptPassword = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.EMAILCONFIGURATION_SP_VIEWEDIT", param);
                EmailConfigurationModel obj = (from p in dt.AsEnumerable()
                                               select new EmailConfigurationModel()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                   Insitution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                   Sender_Email_Id = p.Field<string>("SENDER_EMAIL_ID"),
                                                   UserName = EncryptPassword.Decrypt(p.Field<string>("USERNAME")),
                                                   Password = EncryptPassword.Decrypt(p.Field<string>("EPASSWORD")),
                                                   ServerName = p.Field<string>("SERVERNAME"),
                                                   PortNo = p.Field<int>("PORTNO"),
                                                   DisplayName = p.Field<string>("DISPLAYNAME"),
                                                   EConfigSSL_Enable = p.Field<int>("SSL_ENABLE"),
                                                   Remarks = p.Field<string>("REMARKS"),

                                               }).FirstOrDefault();
                return obj;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

       
    }
}