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
using MyCortex.EmailAlert.Models;
using MyCortex.Utilities;

namespace MyCortex.Repositories.EmailAlert
{
    public class EmailAlertConfigRepository : IEmailAlertConfigRepository
    {
         ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public EmailAlertConfigRepository()
        {
            db = new ClsDataBase();
        }

        /// <summary>
        /// to get Email Alert of a selected record
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>Email Alert detail of a selected record</returns>
        public EmailAlertmodel EmailAlert_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLALERTCONFIGURATION_SP_VIEW]", param);
                EmailAlertmodel INS = (from p in dt.AsEnumerable()
                                                select
                                                new EmailAlertmodel()
                                                {
                                                    Id = p.Field<long>("ID"),
                                                    Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                    Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                    Event_Id = p.Field<long>("EVENT_ID"),
                                                    EventName = p.Field<string>("EVENTNAME"), 
                                                    EmailFlag = p.Field<bool>("EMAILFLAG"),
                                                    AppFlag = p.Field<bool>("APPFLAG"),
                                                    WebFlag = p.Field<bool>("WEBFLAG"),
                                                    EmailTemplate_Id = p.Field<long?>("EMAILTEMPLATE_ID"),
                                                    EmailTemplate = p.Field<string>("EMAILTEMPLATENAME"),
                                                    AppTemplate_Id = p.Field<long?>("APPTEMPLATE_ID"),
                                                    AppTemplate = p.Field<string>("APPTEMPLATENAME"),
                                                    WebTemplate_Id = p.Field<long?>("WEBTEMPLATE_ID"),
                                                    WebTemplate = p.Field<string>("WEBTEMPLATENAME"),
                                                    AlertDays = p.Field<decimal?>("ALERTDAYS"),
                                                }).FirstOrDefault();
             //   INS.EmailTemplateTagList = EmailTemplateTag_View(INS.Id);
                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /* THIS IS FOR ADD EDIT FUNCTION */
        /// <summary>
        /// Email Template --> Email Alert  Details --> Add/Edit Page
        /// to Insert/Update the entered Email Alert details
        /// </summary>
        /// <param name="obj">Email Alert detail model</param>      
        /// <returns>Email Alert details of the Inserted/Updated record</returns>
        public IList<EmailAlertmodel> EmailAlertDetails_AddEdit(EmailAlertmodel obj)
        {
            long InsSubModId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@EVENT_ID", obj.Event_Id));
            param.Add(new DataParameter("@EMAILFLAG", obj.EmailFlag));
            param.Add(new DataParameter("@APPFLAG", obj.AppFlag));
            param.Add(new DataParameter("@WEBFLAG", obj.WebFlag));
            param.Add(new DataParameter("@EMAILTEMPLATE_ID", obj.EmailTemplate_Id));
            param.Add(new DataParameter("@APPTEMPLATE_ID", obj.AppTemplate_Id));
            param.Add(new DataParameter("@WEBTEMPLATE_ID", obj.WebTemplate_Id));
            param.Add(new DataParameter("@ALERTDAYS", obj.AlertDays));
            param.Add(new DataParameter("@MODIFIEDUSERID", obj.ModifiedUser_Id));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            //param.Add(new DataParameter("@CREATEDBY_ID", HttpContext.Current.Session["BYID"]));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // InsSubId = ClsDataBase.Insert("INS_SUb_EX", param, true);
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLALERTCONFIGURATION_SP_INSERT", param);

                DataRow dr = dt.Rows[0];
                var InsertId = (dr["Id"].ToString());
                IList<EmailAlertmodel> INS = (from p in dt.AsEnumerable()
                                                       select
                                                       new EmailAlertmodel()
                                                       {
                                                           Id = p.Field<long>("Id"),
                                                           Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                           Event_Id = p.Field<long>("EVENT_ID"),
                                                           EmailFlag = p.Field<bool>("EMAILFLAG"),
                                                           AppFlag = p.Field<bool>("APPFLAG"),
                                                           WebFlag = p.Field<bool>("WEBFLAG"),
                                                           EmailTemplate_Id = p.Field<long?>("EMAILTEMPLATE_ID"),
                                                           AppTemplate_Id = p.Field<long?>("APPTEMPLATE_ID"),
                                                           WebTemplate_Id = p.Field<long?>("WEBTEMPLATE_ID"),
                                                           AlertDays = p.Field<decimal?>("ALERTDAYS"),
                                                           ModifiedUser_Id = p.Field<long>("MODIFIEDUSERID"),
                                                           Created_By = p.Field<long>("CREATED_BY"),
                                                           Flag = p.Field<int>("flag"),
                                                           //SubscriptionId = p.Field<int>("SubScription_Id"),
                                                       }).ToList();

                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to get Email Alert  list of selected filter
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>Email Alert list of a selected record</returns>
        public IList<EmailAlertmodel> EmailAlert_List(long Id, int IsActive)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@Id", Id));
                param.Add(new DataParameter("@IsActive", IsActive));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLALERTCONFIGURATION_SP_LIST", param);
                List<EmailAlertmodel> lst = (from p in dt.AsEnumerable()
                                             select new EmailAlertmodel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                          Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                          Event_Id = p.Field<long>("EVENT_ID"),
                                                          EventName = p.Field<string>("EVENTNAME"),
                                                          EmailFlag = p.Field<bool>("EMAILFLAG"),
                                                          AppFlag = p.Field<bool>("APPFLAG"),
                                                          WebFlag = p.Field<bool>("WEBFLAG"),
                                                          EmailTemplate_Id = p.Field<long?>("EMAILTEMPLATE_ID"),
                                                          EmailTemplate = p.Field<string>("EMAILTEMPLATENAME"),
                                                          AppTemplate_Id = p.Field<long?>("APPTEMPLATE_ID"),
                                                          AppTemplate = p.Field<string>("APPTEMPLATENAME"),
                                                          WebTemplate_Id = p.Field<long?>("WEBTEMPLATE_ID"),
                                                          WebTemplate = p.Field<string>("WEBTEMPLATENAME"),
                                                          AlertDays = p.Field<decimal?>("ALERTDAYS"),
                                                          IsActive = p.Field<int>("ISACTIVE"),
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
        /// to deactivate a Email alert detail
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>success response of email alert deactivated</returns>
        public void EmailAlert_Delete(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].TBLALERTCONFIGURATION_SP_DELETE", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// to activate a Email alert detail
        /// </summary>
        /// <param name="Id">Email Alert Id</param>
        /// <returns>success response of email alert activated</returns>
        public void EmailAlert_Active(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].TBLALERTCONFIGURATION_SP_ACTIVE", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }

        /// <summary>
        /// to get list of Email alert detail of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>list of Email alert detail of a institution</returns>
        public IList<EventModel> AlertEvent_List(int Institution_Id ,int Id,int status)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@Status", status));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALERTEVENTMASTER_SP_LIST", param);
                List<EventModel> lst = (from p in dt.AsEnumerable()
                                        select new EventModel()
                                        {
                                            Id = p.Field<long>("Id"),
                                            Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                            Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                            EventName = p.Field<string>("EVENTNAME"),
                                            EventType_Id = p.Field<long>("EVENTTYPE_ID"),
                                            Name = p.Field<string>("EVENTTYPENAME"),
                                            IsActive = p.Field<int>("ISACTIVE"),
                                            EventCode = p.Field<string>("EVENT_CODE"),
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
        /// Email Template name list for the given filter
        /// </summary>
        /// <param name="TemplateType_Id">TemplateType Id</param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Email Template name list</returns>
        public IList<EmailAlertmodel> Template_List(int TemplateType_Id, int Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@Institution_Id", Institution_Id));
                param.Add(new DataParameter("@TemplateType_Id", TemplateType_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TEMPLATE_SP_LIST", param);
                List<EmailAlertmodel> lst = (from p in dt.AsEnumerable()
                                             select new EmailAlertmodel()
                                        {
                                            Id = p.Field<long>("Id"),
                                            TemplateName = p.Field<string>("TEMPLATENAME"),                                           
                                            IsActive = p.Field<int>("ISACTIVE"),
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
        /// get the "To" and "CC" users types of a event 
        /// </summary>
        /// <param name="EventId">Event Id</param>
        /// <returns>get the "To" and "CC" users types of a event </returns>
        public IList<EmailAlertmodel> EventTo_List(long EventId)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@EVENTID", EventId));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].EVENTTO_SP_DETAILS", param);
                List<EmailAlertmodel> lst = (from p in dt.AsEnumerable()
                                             select new EmailAlertmodel()
                                             {
                                                 Event_Id = p.Field<long>("EVENT_ID"),
                                                 EventTo = p.Field<string>("EVENTTO"),
                                                 EventCC = p.Field<string>("EVENTCC"),
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