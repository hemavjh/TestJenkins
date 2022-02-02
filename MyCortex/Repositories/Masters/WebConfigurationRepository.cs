using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using log4net;
using MyCortex.Masters.Models;
using MyCortex.Utilities;
using MyCortexDB;

namespace MyCortex.Repositories.Masters
{
    public class WebConfigurationRepository: IWebConfigurationRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public IList<WebConfigurationModel> WebConfiguration_List(int? IsActive, int? Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@IS_ACTIVE", IsActive));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].APPCONFIGURATION_SP_LISTING", param);
                List<WebConfigurationModel> list = (from p in dt.AsEnumerable()
                                              select new WebConfigurationModel()
                                              {
                                                  ID = p.Field<long>("ID"),
                                                  INSTITUTION_ID = p.Field<long>("INSTITUTION_ID"),
                                                  CONFIGCODE = p.Field<string>("CONFIGCODE"),
                                                  CONFIGINFO = p.Field<string>("CONFIGINFO"),
                                                  CONFIGVALUE = p.Field<string>("CONFIGVALUE"),
                                                  CONFIG_TYPEDEFINITION = p.Field<string>("CONFIG_TYPEDEFINITION"),
                                                  ISACTIVE = p.Field<int>("ISACTIVE"),

                                              }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public WebConfigurationModel WebConfiguration_View(long Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].APPCONFIGURATION_SP_VIEW", param);
                WebConfigurationModel WCM = (from p in dt.AsEnumerable()
                                       select new WebConfigurationModel()
                                       {
                                           ID = p.Field<long>("ID"),
                                           INSTITUTION_ID = p.Field<long>("INSTITUTION_ID"),
                                           CONFIGCODE = p.Field<string>("APPCONFIG_CODE"),
                                           CONFIGINFO = p.Field<string>("APPCONFIG_NAME"),
                                           CONFIGVALUE = p.Field<string>("APPCONFIG_VALUE"),
                                           CONFIG_TYPEDEFINITION = p.Field<string>("TYPEDEFINITION"),
                                           REMARKS = p.Field<string>("REMARKS"),
                                           ISACTIVE = p.Field<int>("IS_ACTIVE"),

                                       }).FirstOrDefault();
                return WCM;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public IList<WebConfigurationModel> ChronicCodeList()
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[CHRONIC_CODE_LIST]");
                DataEncryption DecryptFields = new DataEncryption();
                List<WebConfigurationModel> list = (from p in dt.AsEnumerable()
                                                    select new WebConfigurationModel()
                                                    {
                                                        CHRONICID = p.Field<string>("ID"),
                                                        CHRONICNAME = p.Field<string>("NAME"),
                                                    }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        
        public long WebConfiguration_InsertUpdate(Guid Login_Session_Id, List<WebConfigurationModel> insobj)
        {
            try
            {
                string flag = "";
                foreach (WebConfigurationModel item in insobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.ID));
                    param.Add(new DataParameter("@INSTITUTION_ID", item.INSTITUTION_ID));
                    param.Add(new DataParameter("@APPCONFIG_CODE", item.CONFIGCODE));
                    param.Add(new DataParameter("@APPCONFIG_NAME", item.CONFIGINFO));
                    param.Add(new DataParameter("@APPCONFIG_VALUE", item.CONFIGVALUE));
                    param.Add(new DataParameter("@APPCONFIG_TYPE", item.CONFIG_TYPEDEFINITION));
                    param.Add(new DataParameter("@REMARKS", item.REMARKS));
                    param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].APPCONFIGURATION_SP_INSERTUPDATE", param);
                        DataRow dr = dt.Rows[0];
                        flag = (dr["FLAG"].ToString());
                    }
                }
                var data = (Convert.ToInt64(flag));
                return data;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);

            }
            return 0;
        }

        public int Configuration_InsertUpdate(List<WebConfigurationModel> obj)
        {
            try
            {
                int retid = 0;
                // int executedOnce = 0;

                foreach (WebConfigurationModel item in obj)
                {
                    //if (item.Units_ID != null)
                    {
                        List<DataParameter> param = new List<DataParameter>();
                        param.Add(new DataParameter("@Id", item.ID));
                        param.Add(new DataParameter("@INSTITUTION_ID", item.INSTITUTION_ID));
                        // param.Add(new DataParameter("@USER_ID", item.User_Id));
                        param.Add(new DataParameter("@CONFIG_VALUE", item.CONFIGVALUE));
                        param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                        retid = ClsDataBase.Insert("[MYCORTEX].APPCONFIGURATION_SP_UPDATE", param, true);


                    }

                }
                //foreach (WebConfigurationModel item in obj)
                //{
                //    // execute only once for thie institution
                //    if (executedOnce == 0)
                //    {
                //        List<DataParameter> param = new List<DataParameter>();
                //        param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_ID));
                //        retid = ClsDataBase.Insert("[MYCORTEX].STANDARD_PARAMETER_PARENT_INSERTUPDATE", param, true);
                //        executedOnce = 1;
                //    }
                //}
                return retid;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        /* This is for Delete Allergy Details */
        public IList<WebConfigurationModel> WebConfiguration_InActive(WebConfigurationModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.ID));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].WEBCONFIGURATION_SP_INACTIVE", param);
                IList<WebConfigurationModel> list = (from p in dt.AsEnumerable()
                                               select new WebConfigurationModel()
                                               {
                                                   Flag = p.Field<int>("flag")
                                               }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        public IList<WebConfigurationModel> WebConfiguration_Active(WebConfigurationModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.ID));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].WEBCONFIGURATION_SP_ACTIVE", param);
                IList<WebConfigurationModel> list = (from p in dt.AsEnumerable()
                                               select new WebConfigurationModel()
                                               {
                                                   Flag = p.Field<int>("flag")
                                               }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
    }
}