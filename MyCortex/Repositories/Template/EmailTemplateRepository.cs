using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Template.Models;
//using MyCortex.Repositories.Template;


namespace MyCortex.Repositories.Template
{
    public class EmailTemplateRepository : IEmailTemplateRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public EmailTemplateRepository()
        {
            db = new ClsDataBase();

        }


        /// <summary>
        /// to get Template details of a Id
        /// </summary>
        /// <param name="Id">Template details Id</param>
        /// <returns>Template details of a Id</returns>
        public EmailTemplateDesignModel EmailTemplateDetails_View(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
             var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLEMAILTEMPLATE_SP_VIEW]", param);
            EmailTemplateDesignModel INS = (from p in dt.AsEnumerable()
                                            select
                                            new EmailTemplateDesignModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                TemplateType_Id = p.Field<long>("TEMPLATETYPE_ID"),
                                                TemplateName = p.Field<string>("TEMPLATENAME"),
                                                EmailSubject = p.Field<string>("EMAILSUBJECT"),
                                                EmailTemplate = p.Field<string>("EMAILTEMPLATE"),
                                                Type_Name = p.Field<string>("TAGTYPENAME")
                                            }).FirstOrDefault();
            INS.EmailTemplateTagList = EmailTemplateTag_View(INS.Id);
            return INS;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// Email Template --> Email Template  Details --> Add/Edit Page
        /// to Insert/Update the entered Email Template  Information
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">details of Email Template </param>      
        /// <returns>template details of the Inserted/Updated record</returns>
        public  IList<EmailTemplateDesignModel> EmailTemplateTag_AddEdit(EmailTemplateDesignModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long InsSubModId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@INSITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@TEMPLATETYPE_ID", obj.TemplateType_Id));
           // param.Add(new DataParameter("@TYPE_ID", obj.Type_Id));
            param.Add(new DataParameter("@EMAILSUBJECT", obj.EmailSubject));
            param.Add(new DataParameter("@EMAILTEMPLATE", obj.EmailTemplate));
            param.Add(new DataParameter("@MODIFIEDUSERID", obj.ModifiedUser_Id));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            param.Add(new DataParameter("@TemplateName", obj.TemplateName));
            //param.Add(new DataParameter("@CREATEDBY_ID", HttpContext.Current.Session["BYID"]));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                // InsSubId = ClsDataBase.Insert("INS_SUb_EX", param, true);
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLEMAILTEMPLATE_SP_INSERT", param);

                DataRow dr = dt.Rows[0];
                var InsertId = (dr["Id"].ToString());
                IList<EmailTemplateDesignModel> INS = (from p in dt.AsEnumerable()
                                                           select
                                                           new EmailTemplateDesignModel()
                                                           {
                                                               Id = p.Field<long>("Id"),
                                                               Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                               TemplateType_Id = p.Field<long>("TEMPLATETYPE_ID"),
                                                               TemplateName = p.Field<string>("TEMPLATENAME"),
                                                               EmailSubject = p.Field<string>("EMAILSUBJECT"),
                                                               EmailTemplate = p.Field<string>("EMAILTEMPLATE"),
                                                               //ModifiedUser_Id = p.Field<long>("MODIFIEDUSERID"),
                                                               Created_By = p.Field<long>("CREATED_BY"),
                                                               flag = p.Field<int>("flag"),
                                                               //SubscriptionId = p.Field<int>("SubScription_Id"),
                                                           }).ToList();

                foreach (EmailTemplateTagModel item in obj.EmailTemplateTagList)
                {
                    List<DataParameter> param1 = new List<DataParameter>();
                    param1.Add(new DataParameter("@Id", item.Id));
                    param1.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                    param1.Add(new DataParameter("@EMAIL_TEMPLATEID", InsertId));
                    param1.Add(new DataParameter("@TAGNAME", item.TagName));
                    param1.Add(new DataParameter("@MODIFIEDUSERID", item.ModifiedUser_Id));
                    param1.Add(new DataParameter("@CREATED_BY", item.Created_By));
                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLEMAILTEMPLATETAG_SP_INSERT", param1, true);
                }
                return INS;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// to get template tag details of a template
        /// </summary>
        /// <param name="Id">Template Id</param>
        /// <returns>template tag details of a template</returns>
        public IList<EmailTemplateTagModel> EmailTemplateTag_View(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Id", Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLEMAILTEMPLATETAG_SP_VIEW",param);
                List<EmailTemplateTagModel> lst = (from p in dt.AsEnumerable()
                                               select new EmailTemplateTagModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                   Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                   Email_TemplateId = p.Field<long>("EMAIL_TEMPLATEID"),
                                                   TagType_Name = p.Field<string>("TAGNAME"),
                                                   Created_By = p.Field<long>("CREATED_BY")
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
        /// to get list Template tag details for the given filter
        /// </summary>
        /// <param name="TemplateType_Id">Template type Id</param>
        /// <returns>Template details tag details</returns>
        public IList<EmailTemplateDesignModel> EmailTemplateTag_List(long Id, int IsActive, long TemplateType_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Id", Id));
                param.Add(new DataParameter("@IsActive", IsActive));
                param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLEMAILTEMPLATETAG_SP_LIST", param);
                List<EmailTemplateDesignModel> lst = (from p in dt.AsEnumerable()
                                                      select new EmailTemplateDesignModel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                          Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                          TemplateType_Id = p.Field<long>("TemplateType_Id"),
                                                          TemplateName = p.Field<string>("TEMPLATENAME"),
                                                          EmailSubject = p.Field<string>("EMAILSUBJECT"),
                                                          EmailTemplate = p.Field<string>("EMAILTEMPLATE"),
                                                          Created_By = p.Field<long>("CREATED_BY"),
                                                          IsActive = p.Field<int>("IsActive")
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
        /// to deactivate a Email Template
        /// </summary>
        /// <param name="Id">Email Template Id</param>
        /// <returns>success response of deactivate</returns>
        public void EmailTemplate_Delete(int Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].TBLEMAILTEMPLATE_SP_DELETE", param);
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }

        /// <summary>
        /// to activate a Email Template
        /// </summary>
        /// <param name="Id">Email Template Id</param>
        /// <returns>success response of activate</returns>
        public void EmailTemplate_Active(int Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].TBLEMAILTEMPLATE_SP_ACTIVE", param);
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }

        /// <summary>
        /// get the Template tag list
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Template tag list</returns>
        public IList<TagListModels> TemplateTag_List(long Institution_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLTAGTYPE_SP_LIST", param);
                List<TagListModels> lst = (from p in dt.AsEnumerable()
                                           select new TagListModels()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          TagTypeName = p.Field<string>("TAGTYPENAME"),                                                        
                                                          IsActive = p.Field<int>("ISACTIVE"),
                                                          Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                          Institution_Name = p.Field<string>("INSTITUTION_NAME"),      
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
        /// to get Section Based Email Template and Tag mapping list for the institution
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <param name="SectionName">Section Name</param>
        /// <returns>Section Based Email Template and Tag mapping list for the institution</returns>
        public IList<TagListMappingModels> SectionEmailTemplateTagMapping_List(long Id, long Institution_Id, string SectionName)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Id", Id));
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Sectionname", SectionName));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[SECTIONTYPE_TAGTYPEMAPPING_SP_LIST]", param);
                List<TagListMappingModels> lst = (from p in dt.AsEnumerable()
                                                  select new TagListMappingModels()
                                                  {
                                                      Id = p.Field<long>("Id"),
                                                      TagType_Id = p.Field<long>("TAGTYPE_ID"),
                                                      TagType_Name = p.Field<string>("TAGTYPENAME"),
                                                      TagList = p.Field<string>("TAGLIST"),
                                                      IsActive = p.Field<int>("ISACTIVE"),
                                                      Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                      Institution_Name = p.Field<string>("INSTITUTION_NAME"),
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
        /// to get Email Template and Tag mapping list for the institution
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Email Template and Tag mapping list for the institution</returns>
        public IList<TagListMappingModels> EmailTemplateTagMapping_List(long Id, long Institution_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@Id", Id));
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLTAGTYPEMAPPING_SP_LIST", param);
                List<TagListMappingModels> lst = (from p in dt.AsEnumerable()
                                                  select new TagListMappingModels()
                                           {
                                               Id = p.Field<long>("Id"),
                                               TagType_Id = p.Field<long>("TAGTYPE_ID"),
                                               TagType_Name = p.Field<string>("TAGTYPENAME"),
                                               TagList = p.Field<string>("TAGLIST"),
                                               IsActive = p.Field<int>("ISACTIVE"),
                                               Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
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