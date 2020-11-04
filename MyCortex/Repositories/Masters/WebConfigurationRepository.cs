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
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@IS_ACTIVE", IsActive));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].APPCONFIGURATION_SP_LISTING", param);
                DataEncryption DecryptFields = new DataEncryption();
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
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].APPCONFIGURATION_SP_VIEW", param);
                DataEncryption DecryptFields = new DataEncryption();
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
    }
}