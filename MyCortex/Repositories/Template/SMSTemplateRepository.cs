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
using MyCortex.Template.Models;
//using MyCortex.Repositories.Template;


namespace MyCortex.Repositories.Template
{
    public class SMSTemplateRepository : ISMSTemplateRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public SMSTemplateRepository()
        {
            db = new ClsDataBase();

        }


        /// <summary>
        /// SMS Template --> SMS Template  Details --> Add/Edit Page
        /// to Insert/Update the entered SMS Template  Information
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">details of SMS Template </param>      
        /// <returns>template details of the Inserted/Updated record</returns>
        //public IList<SMSTemplateDesignModel> SMSTemplateTag_AddEdit(SMSTemplateDesignModel obj)
        //{
        //    long InsSubModId;
        //    List<DataParameter> param = new List<DataParameter>();
        //    param.Add(new DataParameter("@ID", obj.Id));
        //    param.Add(new DataParameter("@INSITUTION_ID", obj.Institution_Id));
        //    param.Add(new DataParameter("@TEMPLATETYPE_ID", obj.TemplateType_Id));
        //    // param.Add(new DataParameter("@TYPE_ID", obj.Type_Id));
        //    param.Add(new DataParameter("@SMSSUBJECT", obj.SMSSubject));
        //    param.Add(new DataParameter("@SMSTEMPLATE", obj.SMSTemplate));
        //    param.Add(new DataParameter("@MODIFIEDUSERID", obj.ModifiedUser_Id));
        //    param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
        //    param.Add(new DataParameter("@TemplateName", obj.TemplateName));
        //    //param.Add(new DataParameter("@CREATEDBY_ID", HttpContext.Current.Session["BYID"]));
        //    _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
        //    try
        //    {
        //        // InsSubId = ClsDataBase.Insert("INS_SUb_EX", param, true);
        //        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLSMSTEMPLATE_SP_INSERT", param);

        //        DataRow dr = dt.Rows[0];
        //        var InsertId = (dr["Id"].ToString());
        //        IList<SMSTemplateDesignModel> INS = (from p in dt.AsEnumerable()
        //                                               select
        //                                               new SMSTemplateDesignModel()
        //                                               {
        //                                                   Id = p.Field<long>("Id"),
        //                                                   Institution_Id = p.Field<long>("INSTITUTION_ID"),
        //                                                   TemplateType_Id = p.Field<long>("TEMPLATETYPE_ID"),
        //                                                   TemplateName = p.Field<string>("TEMPLATENAME"),
        //                                                   SMSSubject = p.Field<string>("SMSSUBJECT"),
        //                                                   SMSTemplate = p.Field<string>("SMSTEMPLATE"),
        //                                                       //ModifiedUser_Id = p.Field<long>("MODIFIEDUSERID"),
        //                                                       Created_By = p.Field<long>("CREATED_BY"),
        //                                                   flag = p.Field<int>("flag"),
        //                                                       //SubscriptionId = p.Field<int>("SubScription_Id"),
        //                                                   }).ToList();

        //        foreach (SMSTemplateTagModel item in obj.SMSTemplateTagList)
        //        {
        //            List<DataParameter> param1 = new List<DataParameter>();
        //            param1.Add(new DataParameter("@Id", item.Id));
        //            param1.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
        //            param1.Add(new DataParameter("@SMS_TEMPLATEID", InsertId));
        //            param1.Add(new DataParameter("@TAGNAME", item.TagName));
        //            param1.Add(new DataParameter("@MODIFIEDUSERID", item.ModifiedUser_Id));
        //            param1.Add(new DataParameter("@CREATED_BY", item.Created_By));
        //            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLSMSTEMPLATETAG_SP_INSERT", param1, true);
        //        }
        //        return INS;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.Error(ex.Message, ex);
        //        return null;
        //    }
        //}


        /// <summary>
        /// to deactivate a SMS Template
        /// </summary>
        /// <param name="Id">SMS Template Id</param>
        /// <returns>success response of deactivate</returns>
        public void SMSTemplate_Delete(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].TBLSMSTEMPLATE_SP_DELETE", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// to activate a SMS Template
        /// </summary>
        /// <param name="Id">SMS Template Id</param>
        /// <returns>success response of activate</returns>
        public void SMSTemplate_Active(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].TBLSMSTEMPLATE_SP_ACTIVE", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// get the Template tag list
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Template tag list</returns>
        public IList<TagListModels> TemplateTag_List(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to get SMS Template and Tag mapping list for the institution
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>SMS Template and Tag mapping list for the institution</returns>
        public IList<TagListMappingModels> SMSTemplateTagMapping_List(long Id, long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

    }
}