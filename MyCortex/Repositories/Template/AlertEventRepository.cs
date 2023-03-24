using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Notification.Models;
using MyCortex.Repositories;
using MyCortex.Utilities;
using MyCortex.User.Model;
using System.Web.UI;

namespace MyCortex.Repositories.EmailAlert
{
    public class AlertEventRepository : IAlertEventRepository
    {
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public IList<AlertEventModel> AlertEvent_GenerateTemplate(long Entity_Id, string Event_Code, long Institution_Id)
        {
            IList<AlertEventModel> AlertEventTemplateModel = new List<AlertEventModel>();
            string Template = "";
            string Template1 = "";
            string TagName = "";
            string FieldName = "";
            string TagsReplaceData = "";
            string TagsReplaceData1 = "";
            string FinalResult = "";
            string FinalResult1 = "";
            string EmailSubject = "";
            int EncryptFlag;
            string Section = "";
            long TemplateType_Id;
            long Template_Id;
            int TemplateFor;
            long EntityId;
            //string TemplateType = "Email"; //for Email based Tag
            //DataEncryption DecryptFields = new DataEncryption();
            ////Get Template Type Id
            //List<DataParameter> Event_param = new List<DataParameter>();
            //Event_param.Add(new DataParameter("@Event_Name", Event_Name));
            //Event_param.Add(new DataParameter("@Institution_Id", Institution_Id));
            //DataTable Temp_dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_BASED_ID]", Event_param);
            //DataRow Temp_dr = Temp_dt.Rows[0];
            //Event_Id = int.Parse(Temp_dr["Id"].ToString());

            //Get the Event based Template
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Event_Code", Event_Code));
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_BASED_TEMPLATE]", param);
            //DataRow dr = dt.Rows[0];
            foreach (DataRow dr in dt.Rows)
            {
                Template = dr["EMAILTEMPLATE"].ToString();
                Template1 = dr["EMAILTEMPLATE"].ToString();

                EmailSubject = dr["EMAILSUBJECT"].ToString();
                TemplateType_Id = long.Parse(dr["TEMPLATETYPE_ID"].ToString());
                Template_Id = long.Parse(dr["Template_Id"].ToString());
                TemplateFor = int.Parse(dr["TemplateFor"].ToString());

                //Get the Section Group Details
                List<DataParameter> Sec_param = new List<DataParameter>();
                Sec_param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
                Sec_param.Add(new DataParameter("@EventCode", Event_Code));
                Sec_param.Add(new DataParameter("@PrimaryKey_Id", Entity_Id));
                // DataTable Sec_dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_SP_GETSECTION]", Sec_param);
                //DataRow Sec_dr = Sec_dt.Rows[0];
                // Section = Sec_dr["SECTION_NAME"].ToString();
                DataTable Sec_dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_GETSECTION]", Sec_param);
                foreach (DataRow Sec_dr in Sec_dt.Rows)
                {
                    Section = Sec_dr["SECTION_NAME"].ToString();
                    EntityId = long.Parse(Sec_dr["EntityId"].ToString());
                    //Get the User Result Data
                    List<DataParameter> Result_param = new List<DataParameter>();
                    Result_param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
                    Result_param.Add(new DataParameter("@SectionName", Section));
                    Result_param.Add(new DataParameter("@PrimaryKey_Id", EntityId));
                    DataTable Result_dt = ClsDataBase.GetDataTable("[MYCORTEX].[TEMPLATE_RESULTLIST]", Result_param);
                    string Time = DateTime.Now.ToString("h:mm:ss tt");

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
                            FinalResult1 = Template1;

                            TagName = dtRow1["TagsName"].ToString();
                            FieldName = dtRow1["FieldName"].ToString();
                            EncryptFlag = int.Parse(dtRow1["ENCRYPT_FLAG"].ToString());
                            if (Result_dt.Columns.Contains(FieldName))
                            {
                                if(TagName == "{Time}")
                                {
                                    TagsReplaceData = Time;
                                    TagsReplaceData1 = Time;
                                }
                                else if(TagName == "{Login Url}")
                                {
                                    var URLConvert = "";
                                    URLConvert = dtRow[FieldName].ToString();
                                    TagsReplaceData = "<a href =" + URLConvert + "login>" + URLConvert + "</a>";
                                    TagsReplaceData1 = "<a href =" + URLConvert + "login>" + URLConvert + "</a>";
                                    //< a href =\" + URLConvert + " + "#/login </a>"
                                }
                                else if (TagName == "{Reset}")
                                {
                                    var URLConvert = "";
                                    URLConvert = dtRow[FieldName].ToString();
                                    TagsReplaceData = "<a href =" + URLConvert + "login>" + URLConvert + "</a>";
                                    TagsReplaceData1 = "<a href =" + URLConvert + "login>" + URLConvert + "</a>";
                                }
                                else if (TagName == "{Link}")
                                {
                                    var URLConvert = "";
                                    URLConvert = dtRow[FieldName].ToString();
                                    TagsReplaceData = "<a href =" + URLConvert + "login>" + URLConvert + "</a>";
                                    TagsReplaceData1 = "<a href =" + URLConvert + "login>" + URLConvert + "</a>";
                                }
                                else if (TagName == "{ Password }" || TagName == "{Password}")
                                {
                                    string convertedString = new string('*', dtRow[FieldName].ToString().Length);
                                    TagsReplaceData1 = convertedString;
                                    TagsReplaceData = dtRow[FieldName].ToString();
                                }
                                else
                                {
                                    TagsReplaceData = dtRow[FieldName].ToString();
                                    TagsReplaceData1 = dtRow[FieldName].ToString();
                                }
                            }
                            else
                            {

                            }
                            Template = FinalResult.Replace(TagName, TagsReplaceData);
                            Template1 = FinalResult1.Replace(TagName, TagsReplaceData1);                           
                        
                        }
                    }
                    Template = Template.Replace(@"<p>", @"").Replace(@"</p>", @"");
                    Template1 = Template1.Replace(@"<p>", @"").Replace(@"</p>", @"");
                }
                var AlertModel = new AlertEventModel();
                AlertModel.TempBody = Template;
                AlertModel.TempBody1 = Template1;
                AlertModel.TempSubject = EmailSubject;
                AlertModel.TemplateType_Id = TemplateType_Id;
                AlertModel.Template_Id = Template_Id;
                AlertModel.TemplateFor = TemplateFor;
                AlertModel.UserId = Entity_Id;
                AlertModel.Institution_Id = Institution_Id;
                AlertEventTemplateModel.Add(AlertModel);
            }
            return AlertEventTemplateModel;
        }

        public IList<EmailListModel> UserCreateEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_PATIENTSIGNUP_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("Fullname"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType"),
                                                mobile_no = p.Field<string>("MOBILE_NO")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> InstitutionCreateEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_ADMINCREATION_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<EmailListModel> InstitutionEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_INSTITUTION_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> ClinicianNoteEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_CLINICIANSNOTE_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }



        public IList<EmailListModel> Diagnostic_Compliance_AlertEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_DIAG/COMP_ALERTS_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
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
        /// 
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="Type_Id"></param>
        /// <returns></returns>
        public List<PatientHealthDataModel> PatientHealthData_Compliance_List()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_COMPLIANCEALERT]");
                List<PatientHealthDataModel> list = (from p in dt.AsEnumerable()
                                                     select new PatientHealthDataModel()
                                                     {
                                                         Patient_Id = p.Field<long>("Id"),
                                                         ParameterId = p.Field<long>("PARAMETER_ID"),
                                                         HighCount = p.Field<int?>("HighCount"),
                                                         MediumCount = p.Field<int?>("MediumCount"),
                                                         LowCount = p.Field<int?>("LowCount"),
                                                         Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                     }).ToList();
                return list;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<EmailListModel> NewDataCapturedEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_NEWDATACAPTURED_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> Patient_MoreInfo_AlertEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_PATIENT_MOREINFO_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }



        public IList<EmailListModel> Patient_SignUp_HosAdmin_AlertEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_PATIENTSIGNUP_HOSADMIN_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> Patient_AppointmentCreation_AlertEvent(long Institution_Id, long Entity_Id,string CGtype=null)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                param.Add(new DataParameter("@CG_type", CGtype));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_PATIENT_APPOINTMENTCREATION_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType"),
                                                mobile_no = p.Field<string>("mobile_no"),
                                                SMSSourceId = p.Field<string>("SOURCE_ID"),
                                                SMSUserName = p.Field<string>("USERNAME"),
                                                SMSApiId = p.Field<string>("API_ID"),
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> DoctorShift_AlertEvent(long Institution_Id, long Entity_Id, string type = null)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                param.Add(new DataParameter("@type", type));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_DOCTOR_SHIFT_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType"),
                                                mobile_no = p.Field<string>("mobile_no"),
                                                SMSSourceId = p.Field<string>("SOURCE_ID"),
                                                SMSUserName = p.Field<string>("USERNAME"),
                                                SMSApiId = p.Field<string>("API_ID"),
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<EmailListModel> Patient_Appointment_Cancel_AlertEvent(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_PATIENT_APPOINTMENTCANCEL_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> CG_Assign_AlertEvent(long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_CAREGIVERASSIGN_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<EmailListModel> AppointmentRemainder_ForDoctor(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_APPOINTMENTREMAINDER_FORDOCTOR_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<EmailListModel> UserSpecificEmailList(long Institution_Id, long Entity_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Entity_Id", Entity_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_USER_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<EmailListModel> UserLimit_EmailList(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_SP_USERLIMIT_GETEMAIL]", param);
                List<EmailListModel> lst = (from p in dt.AsEnumerable()
                                            select new EmailListModel()
                                            {
                                                UserId = p.Field<long>("UserId"),
                                                UserName = p.Field<string>("FullName"),
                                                EmailId = p.Field<string>("EmailId"),
                                                EmailType_Flag = p.Field<int>("EmailSentType")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public bool Appointment_Schedule_UpdateList(long Schedule_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SCHEDULE_ID", Schedule_Id));
                ClsDataBase.Update("[MYCORTEX].[ALERTEVENT_APPOINTMENT_UPDATE_SCHEDULE_LIST]", param);
                return true;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return false;
            }
        }
        public void Get_AlertSchedule()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                List<DataParameter> param = new List<DataParameter>();

                ClsDataBase.Insert("[MYCORTEX].[ALERTEVENT_PATIENTAPPOINTMENT_GETSCHEDULE]");
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }
        public IList<Appointment_AlertEventModel> Get_AlertSchedule_List()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_APPOINTMENT_ALERT_SCHEDULE_LIST]");
                List<Appointment_AlertEventModel> lst = (from p in dt.AsEnumerable()
                                                         select new Appointment_AlertEventModel()
                                                         {
                                                             Id = p.Field<long>("ID"),
                                                             Appointment_Id = p.Field<long>("APPOINTMENT_ID"),
                                                             Event_Id = p.Field<long>("EVENT_ID"),
                                                             Remainder_SentTime = p.Field<DateTime>("REMAINDER_SENT_TIME"),
                                                             Appointment_Status = p.Field<int>("APPOINTMENT_STATUS"),
                                                             Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                             Patient_Id = p.Field<long>("PATIENT_ID"),
                                                             Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                             Event_Code = p.Field<String>("EVENT_CODE"),

                                                         }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<PasswordExpiry_AlertEventModel> AlertEvent_Get_PasswordExpiry_List()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_PASSWORDEXPIRYPERIOD]");
                List<PasswordExpiry_AlertEventModel> lst = (from p in dt.AsEnumerable()
                                                            select new PasswordExpiry_AlertEventModel()
                                                            {
                                                                UserId = p.Field<long>("UserId"),
                                                                Institution_Id = p.Field<long>("Institution_Id"),
                                                                Event_Id = p.Field<long>("Event_Id"),
                                                                Event_Code = p.Field<string>("Event_Code"),
                                                                ExpiryDays = p.Field<int>("ExpiryDays")
                                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<UserLimit_AlertEventModel> AlertEvent_Get_UserLimit_List(long Institution_Id, long UserId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@UserId", UserId));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_LICENSECOUNT]", param);
                List<UserLimit_AlertEventModel> lst = (from p in dt.AsEnumerable()
                                                       select new UserLimit_AlertEventModel()
                                                       {
                                                           UserId = p.Field<long>("UserId"),
                                                           Institution_Id = p.Field<long>("Institution_Id"),
                                                           Event_Id = p.Field<long>("EVENT_ID"),
                                                           Event_Code = p.Field<string>("Event_Code"),
                                                           Percentage = p.Field<int>("Percentage")
                                                       }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public TargetAchived_AlertEventModel AlertEvent_TargetAchievedDaily_List(long Institution_Id, long UserId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
                param.Add(new DataParameter("@PATIENT_ID", UserId));

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_TARGETDAILY]", param);
                TargetAchived_AlertEventModel lst = (from p in dt.AsEnumerable()
                                                     select new TargetAchived_AlertEventModel()
                                                     {
                                                         UserId = p.Field<long>("UserId"),
                                                         Institution_Id = p.Field<long>("Institution_Id"),
                                                         Event_Id = p.Field<long>("EVENT_ID"),
                                                         Event_Code = p.Field<string>("Event_Code"),
                                                         Percentage = p.Field<int>("Percentage"),
                                                         ParameterName = p.Field<string>("ParameterName"),
                                                     }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<TargetAchived_AlertEventModel> AlertEvent_TargetAchievedWeekly_List()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_TARGETWEEKLY]");
                List<TargetAchived_AlertEventModel> lst = (from p in dt.AsEnumerable()
                                                           select new TargetAchived_AlertEventModel()
                                                           {
                                                               UserId = p.Field<long>("UserId"),
                                                               Institution_Id = p.Field<long>("Institution_Id"),
                                                               Event_Id = p.Field<long>("EVENT_ID"),
                                                               Event_Code = p.Field<string>("Event_Code"),
                                                               Percentage = p.Field<int>("Percentage")
                                                           }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<LicenceExpiry_AlertEventModel> AlertEvent_Get_LicenceExpiry_List()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_LICENSEEXPIRY]");
                List<LicenceExpiry_AlertEventModel> lst = (from p in dt.AsEnumerable()
                                                           select new LicenceExpiry_AlertEventModel()
                                                           {
                                                               HosAdmin_Id = p.Field<long>("HosAdmin_Id"),
                                                               Institution_Id = p.Field<long>("Institution_Id"),
                                                               Event_Id = p.Field<long>("Event_Id"),
                                                               Event_Code = p.Field<string>("Event_Code"),
                                                               ExpiryDays = p.Field<int>("ExpiryDays")
                                                           }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

    }
}