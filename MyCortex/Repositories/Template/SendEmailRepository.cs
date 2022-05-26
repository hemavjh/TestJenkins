  
using MyCortex.Template.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.Admin.Models;
using MyCortex.Notification.Model;

namespace MyCortex.Repositories.Template
{
    public class SendEmailRepository : ISendEmailRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public SendEmailRepository()
        {
            db = new ClsDataBase();

        }

        /// <summary>
        /// Email User Type name List
        /// </summary>
        /// <returns></returns>
        public IList<SendEmail_UsertypeModal> Email_UserTypeList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[EMAIL_USERTYPE_LIST]");
                List<SendEmail_UsertypeModal> lst = (from p in dt.AsEnumerable()
                                                     select new SendEmail_UsertypeModal()
                                                     {
                                                         Id = p.Field<long>("ID"),
                                                         TypeName = p.Field<string>("TYPENAME"),
                                                         IsActive = p.Field<int>("ISACTIVE")
                                                     }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// Email Teplate List
        /// </summary>
        /// <param name="InstitutionId">Institution Id</param>
        /// <param name="TemplateType_Id">TemplateType Id</param>
        /// <returns></returns>
        public IList<SendEmailTemplateModel> Email_TemplateTypeList(long InstitutionId,long TemplateType_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {

                param.Add(new DataParameter("@Institution_Id", InstitutionId));
                param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[EMAIL_TEMPLATETYPE_LIST]", param);
                List<SendEmailTemplateModel> list = (from p in dt.AsEnumerable()
                                                     select new SendEmailTemplateModel()
                                                     {
                                                         Id = p.Field<long>("ID"),
                                                         TemplateName = p.Field<string>("TEMPLATENAME"),
                                                         EmailTemplate = p.Field<string>("EMAILTEMPLATE"),
                                                         IsActive = p.Field<int>("ISACTIVE")
                                                     }).ToList();
                return list;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// user list to send mail for the selected filter
        /// </summary>
        /// <param name="UserTypeId"></param>
        /// <param name="Institution_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <returns></returns>
        public IList<SendEmailModel> Get_SendEmail_UserList(string UserTypeId, long Institution_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@UserTypeId", UserTypeId));
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@PatientNo", PATIENTNO));
                param.Add(new DataParameter("@InsuranceNo", INSURANCEID));
                param.Add(new DataParameter("@GenderId", GENDER_ID));
                param.Add(new DataParameter("@NationalityId", NATIONALITY_ID));
                param.Add(new DataParameter("@EthnicGroupId", ETHINICGROUP_ID));
                param.Add(new DataParameter("@MobileNo", MOBILE_NO));
                param.Add(new DataParameter("@PhoneNo", HOME_PHONENO));
                param.Add(new DataParameter("@Email", EMAILID));
                param.Add(new DataParameter("@MaritalStatusId", MARITALSTATUS_ID));
                param.Add(new DataParameter("@CountryId", COUNTRY_ID));
                param.Add(new DataParameter("@StateId", STATE_ID));
                param.Add(new DataParameter("@CityId", CITY_ID));
                param.Add(new DataParameter("@BloodGroupId", BLOODGROUP_ID));
                param.Add(new DataParameter("@GroupId", Group_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[SENDEMAIL_SP_USERLIST]", param);
                List<SendEmailModel> list = (from p in dt.AsEnumerable()
                                             select new SendEmailModel()
                                             {
                                                 Id = p.Field<long>("ID"),
                                                 UserName = p.Field<string>("FULLNAME"),
                                                 EmailId = p.Field<string>("EMAILID"),
                                                 MobileNO = p.Field<string>("MOBILE_NO"), 
                                                 UserType = p.Field<string>("UserType"),
                                                 IsActive = p.Field<int>("ISACTIVE")
                                             }).ToList();
                return list;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }



        /// <summary>
        /// to insert/update a Email sent
        /// </summary>
        /// <param name="Emailobj">email details model</param>
        /// <returns>inserted/updated Email sent</returns>
        public IList<SendEmailModel> SendEmail_AddEdit(SendEmailModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@ID", obj.Id));
                param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
                param.Add(new DataParameter("@TEMPLATE_ID", obj.Template_Id));
                param.Add(new DataParameter("@USER_ID", obj.UserId));
                param.Add(new DataParameter("@EMAIL_BODY", obj.Email_Body));
                param.Add(new DataParameter("@EMAIL_SUBJECT", obj.Email_Subject));
                param.Add(new DataParameter("@API_RETURN_ID", obj.ResponseId));
                param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
                {
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SENDEMAIL_INSERTUPDATE ", param);
                    IList<SendEmailModel> list = (from p in dt.AsEnumerable()
                                                  select new SendEmailModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      UserId = p.Field<long>("USERID"),
                                                      Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                      //Email_Body = p.Field<string>("EMAIL_BODY"),
                                                      Email_Subject = p.Field<string>("EMAIL_SUBJECT"),
                                                      Template_Id = p.Field<long>("TEMPLATE_ID"),
                                                      UserName = p.Field<string>("FULLNAME"),
                                                      Created_By = p.Field<long>("CREATED_BY"),
                                                      flag = p.Field<int>("FLAG"),
                                                      Send_Date = p.Field<DateTime>("SEND_DATE"),
                                                      EmailId = p.Field<string>("EMAILID")
                                                  }).ToList();
                    return list;
                }
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<SendEmailModel> SendEmail_ResendListing(SendEmailModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@ID", obj.UserId));
                {
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SENDEMAIL_RESENDLISTING", param);
                    IList<SendEmailModel> list = (from p in dt.AsEnumerable()
                                                  select new SendEmailModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      UserId = p.Field<long>("USERID"),
                                                      Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                      Email_Subject = p.Field<string>("EMAIL_SUBJECT"),
                                                      Template_Id = p.Field<long>("TEMPLATE_ID"),
                                                      UserName = p.Field<string>("FULLNAME"),
                                                      Created_By = p.Field<long>("CREATED_BY"),
                                                      flag = p.Field<int>("FLAG"),
                                                      Send_Date = p.Field<DateTime>("SEND_DATE"),
                                                      EmailId = p.Field<string>("EMAILID")
                                                  }).ToList();
                    return list;
                }
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get composed email detail from Email template based on Event and Template
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Template_Id"></param>
        /// <param name="Institution_Id"></param>
        /// <param name="TemplateType_Id"></param>
        /// <returns></returns>
        public SendEmailModel GenerateTemplate(long Id, long Template_Id, long Institution_Id, long TemplateType_Id)
        {
            string Template = "";
            string TagName = "";
            string FieldName = "";
            string TagsReplaceData = "";
            string FinalResult = "";
            string EmailSubject = "";
            string GeneralTemplate = "";
            int EncryptFlag;
            //long TemplateType_Id;
            string Section = "";
            //string TemplateType = "Email"; //for Email based Tag
            DataEncryption DecryptFields = new DataEncryption();
            ////Get Template Type Id
            //List<DataParameter> Temp_param = new List<DataParameter>();
            //Temp_param.Add(new DataParameter("@TemplateType", TemplateType));
            ////Temp_param.Add(new DataParameter("@Institution_Id", Institution_Id));
            //DataTable Temp_dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATETYPE_BASED_ID]", Temp_param);
            //DataRow Temp_dr = Temp_dt.Rows[0];
            //TemplateType_Id = int.Parse(Temp_dr["Id"].ToString());

            //Get the Email Template
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Template_Id", Template_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_BASED_EMAILBODY]", param);
            DataRow dr = dt.Rows[0];
            Template = dr["EMAILTEMPLATE"].ToString();
            EmailSubject = dr["EMAILSUBJECT"].ToString();

            //Get the Section Group Details
            List<DataParameter> Sec_param = new List<DataParameter>();
            Sec_param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
            DataTable Sec_dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_SP_GETSECTION]", Sec_param);
            DataRow Sec_dr = Sec_dt.Rows[0];
            Section = Sec_dr["SECTION_NAME"].ToString();


            //Get the User Result Data
            List<DataParameter> Result_param = new List<DataParameter>();
            Result_param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
            Result_param.Add(new DataParameter("@SectionName", Section));
            Result_param.Add(new DataParameter("@PrimaryKey_Id", Id));
            DataTable Result_dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_RESULTLIST]", Result_param);

            //Replaced Process
            foreach (DataRow dtRow in Result_dt.Rows)
            {
                List<DataParameter> param2 = new List<DataParameter>();
                param2.Add(new DataParameter("@TemplateType_Id", Template_Id));
                param2.Add(new DataParameter("@SectionName", Section));
                DataTable dt2 = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_RESULT_TAGSLIST]", param2);
                foreach (DataRow dtRow1 in dt2.Rows)
                {
                    FinalResult = Template;
                    TagName = dtRow1["TagsName"].ToString();
                    FieldName = dtRow1["FieldName"].ToString();
                    EncryptFlag = int.Parse(dtRow1["ENCRYPT_FLAG"].ToString());
                    TagsReplaceData = dtRow[FieldName].ToString();
                    //if (EncryptFlag == 1)
                    //{
                    //    TagsReplaceData = DecryptFields.Decrypt(TagsReplaceData);
                    //}
                    Template = FinalResult.Replace(TagName, TagsReplaceData);
                    //if (TemplateType_Id == 3)
                    //{
                        Template = Template.Replace("<p>", "");
                        Template = Template.Replace("</p>", "");
                    //}
                }
            }
            return new SendEmailModel
            {
                Id = Id,
                Email_Body = Template,
                Email_Subject = EmailSubject
            };
        }
        /// <summary>
        /// to get Email sent History for the given filter
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Period_From"></param>
        /// <param name="Period_To"></param>
        /// <param name="Email_Stauts"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="IsActive"></param>
        /// <param name="INSTITUTION_ID"></param>
        /// <param name="TemplateType_Id"></param>
        /// <returns></returns>
        public IList<EmailHistoryListModel> EmailHistory_List(long? Id, DateTime? Period_From, DateTime? Period_To, int? Email_Stauts, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int? IsActive, long? INSTITUTION_ID, long TemplateType_Id, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@ID", Id));
                param.Add(new DataParameter("@PERIOD_FROM", Period_From));
                param.Add(new DataParameter("@PERIOD_TO", Period_To));
                param.Add(new DataParameter("@EMAIL_STATUS", Email_Stauts));
                param.Add(new DataParameter("@PatientNo", PATIENTNO));
                param.Add(new DataParameter("@InsuranceNo", INSURANCEID));
                param.Add(new DataParameter("@GenderId", GENDER_ID));
                param.Add(new DataParameter("@NationalityId", NATIONALITY_ID));
                param.Add(new DataParameter("@EthnicGroupId", ETHINICGROUP_ID));
                param.Add(new DataParameter("@MobileNo", MOBILE_NO));
                param.Add(new DataParameter("@PhoneNo", HOME_PHONENO));
                param.Add(new DataParameter("@Email", EMAILID));
                param.Add(new DataParameter("@MaritalStatusId", MARITALSTATUS_ID));
                param.Add(new DataParameter("@CountryId", COUNTRY_ID));
                param.Add(new DataParameter("@StateId", STATE_ID));
                param.Add(new DataParameter("@CityId", CITY_ID));
                param.Add(new DataParameter("@BloodGroupId", BLOODGROUP_ID));
                param.Add(new DataParameter("@GroupId", Group_Id));
                param.Add(new DataParameter("@IsActive", IsActive));
                param.Add(new DataParameter("@InstitutionId", INSTITUTION_ID));
                param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLEMAILTHISTORY_SP_LIST", param);

                List<EmailHistoryListModel> lst = (from p in dt.AsEnumerable()
                                                   select new EmailHistoryListModel()
                                                   {
                                                       Id = p.Field<long>("ID"),
                                                       UserId = p.Field<long>("USERID"),
                                                       FullName = p.Field<string>("FULLNAME"),
                                                       UserType_Id = p.Field<long>("USERTYPE_ID"),
                                                       TypeName = p.Field<string>("TYPENAME"),
                                                       Template_Id = p.Field<long>("TEMPLATE_ID"),
                                                       TemplateName = p.Field<string>("TEMPLATENAME"),
                                                       EmailSubject = p.Field<string>("EMAILSUBJECT"),
                                                       EmailTemplate = p.Field<string>("EMAILTEMPLATE"),
                                                       Send_Date = p.Field<DateTime>("SEND_DATE"),
                                                       Email_Status = p.Field<int>("EMAIL_STATUS"),
                                                       Email_Error_Reason = p.Field<string>("EMAIL_ERROR_REASON") ?? "",
                                                       EmailId = p.Field<string>("EMAILID"),
                                                       EmailStatusType = p.Field<string>("EmailStatusType"),
                                                       MobileNO = p.Field<string>("MOBILE_NO")
                                                   }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public void SendEmail_Update(long Id, string Error_Reason, int Email_Status, string Sender_MessageId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            //_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@EMAIL_ERROR_REASON", Error_Reason));
                param.Add(new DataParameter("@EMAIL_STATUS", Email_Status));
                param.Add(new DataParameter("@Send_EmailId", Id));
                param.Add(new DataParameter("@Sender_MessageId", Sender_MessageId));
                ClsDataBase.Update("[MYCORTEX].[SENDEMAIL_UPDATE]", param);
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }
        /// <summary>
        /// to update User FCM token for Notification sending
        /// </summary>
        /// <param name="UserFCM">User FCM Token detail</param>
        /// <returns>updated FCM Token detail</returns>
        public void SendEmail_DeliveryStatus(string StatusEvent, string Sender_MessageId, string errorReason)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@EMAIL_STATUS", StatusEvent));
                param.Add(new DataParameter("@SENDER_MESSAGEID", Sender_MessageId));
                param.Add(new DataParameter("@ERROR_REASON", errorReason));
                ClsDataBase.Update("[MYCORTEX].[SENDEMAIL_DELIVERYSTATUSUPDATE]", param);
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }

        public NotifictaionUserFCM UpdateUser_FCMTocken(NotifictaionUserFCM objDetail)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@USER_ID", objDetail.User_Id));
                param.Add(new DataParameter("@FCMTOKEN", objDetail.FCMToken));
                param.Add(new DataParameter("@DEVICETYPE", objDetail.DeviceType));

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USER_FCMTOKEN_SP_INSERTUPDATE", param);

                NotifictaionUserFCM lst = (from p in dt.AsEnumerable()
                                           select new NotifictaionUserFCM()
                                           {
                                               User_Id = p.Field<long>("USER_ID"),
                                               FCMToken = p.Field<string>("FCMTOKEN"),
                                               DeviceType = p.Field<string>("DEVICETYPE")
                                           }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to get FCM token of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>FCM token detail of a user</returns>
        public List<NotifictaionUserFCM> UserFCMToken_Get_List(long User_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@USER_ID", User_Id));

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERFCMTOKEN_SP_LIST", param);

                List<NotifictaionUserFCM> lst = (from p in dt.AsEnumerable()
                                           select new NotifictaionUserFCM()
                                           {
                                               User_Id = p.Field<long>("USER_ID"),
                                               FCMToken = p.Field<string>("FCMTOKEN"),
                                               DeviceType = p.Field<string>("DEVICETYPE"),
                                               SiteUrl = p.Field<string>("SITEURL")
                                           }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to get Notification list of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>Notification list of a user</returns>
        public UserNotificationListModel User_get_NotificationList(long User_Id, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationListModel model = new UserNotificationListModel();
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@USER_ID", User_Id));
                // get notification count
                DataTable dt1 = ClsDataBase.GetDataTable("[MYCORTEX].[NOTIFICATION_UNREAD_COUNT]", param);
                DataRow dr = dt1.Rows[0];
                int TotalCount = int.Parse(dr["TotalCount"].ToString());
                int UnreadCount = int.Parse(dr["UnreadCount"].ToString());

                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));

                // get notification list
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USER_SP_GETNOTIFICATION_LIST", param);

                List<UserNotificationModel> lst = (from p in dt.AsEnumerable()
                                                   select new UserNotificationModel()
                                                   {
                                                       Id = p.Field<long>("ID"),
                                                       UserId = p.Field<long>("USERID"),
                                                       MessageSubject = p.Field<string>("EMAIL_SUBJECT"),
                                                       MessageBody = p.Field<string>("EMAIL_BODY"),
                                                       SentDate = p.Field<DateTime>("SEND_DATE"),
                                                       ReadFlag = p.Field<int>("READ_FLAG")
                                                   }).ToList();
                
                model.UserId = User_Id;
                model.NotificationUnread = UnreadCount;
                model.NotificationTotal = TotalCount;
                model.usernotification = lst;
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return model;
            }
        }
        /// <summary>
        /// to get Notification list of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>Notification list of a user</returns>
        public UserNotificationListModel ClearNotification_Update(long User_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationListModel model = new UserNotificationListModel();
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@USER_ID", User_Id)); 
                //Clear Notification
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[Clear_NOTIFICATION_SP_UPDATE]", param);
                List<UserNotificationModel> lst = (from p in dt.AsEnumerable()
                                                   select new UserNotificationModel()
                                                   {
                                                       Id = p.Field<long>("ID"),
                                                       UserId = p.Field<long>("USERID"),
                                                       MessageSubject = p.Field<string>("EMAIL_SUBJECT"),
                                                       MessageBody = p.Field<string>("EMAIL_BODY"),
                                                       SentDate = p.Field<DateTime>("SEND_DATE"),
                                                       ReadFlag = p.Field<int>("READ_FLAG")
                                                   }).ToList();
                model.UserId = User_Id; 
                model.usernotification = lst;
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return model;
            }
        }
        /// <summary>
        /// to get Notification list of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>Notification list of a user</returns>
        public UserNotificationListModel CountNotification_Update(long User_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationListModel model = new UserNotificationListModel();
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@USER_ID", User_Id)); 
                // count notification  
                DataTable dt1 = ClsDataBase.GetDataTable("[MYCORTEX].[NOTIFICATION_UNREAD_COUNT]", param);
                DataRow dr = dt1.Rows[0];
                int TotalCount = int.Parse(dr["TotalCount"].ToString());
                int UnreadCount = int.Parse(dr["UnreadCount"].ToString());

                model.NotificationTotal = TotalCount;
                model.NotificationUnread = UnreadCount;
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return model;
            }
        }
        /// <summary>
        /// to insert/update a notification for a user
        /// </summary>
        /// <param name="SendEmail_Id">Email config id</param>
        /// <returns>inserted/updated notification</returns>
        public UserNotificationModel Notification_Update(long SendEmail_Id, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SendEmail_Id", SendEmail_Id)); 
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
             
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[NOTIFICATION_SP_UPDATE]", param);
                UserNotificationModel lst = (from p in dt.AsEnumerable()
                                             select new UserNotificationModel()
                                             {
                                                 Id = p.Field<long>("ID"),
                                                 UserId = p.Field<long>("USERID"),
                                                 MessageSubject = p.Field<string>("EMAIL_SUBJECT"),
                                                 MessageBody = p.Field<string>("EMAIL_BODY"),
                                                 SentDate = p.Field<DateTime>("SEND_DATE"),
                                                 ReadFlag = p.Field<int>("READ_FLAG")  
                                             }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<SendEmailModel> SendArchivedetails()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].EMAILARCHIVE_SP_HISTORY");
                IList<SendEmailModel> list = (from p in dt.AsEnumerable()
                                              select new SendEmailModel()
                                              {
                                                  flag = p.Field<int>("flag")
                                              }).ToList();
                return list;

            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


    }
}