using log4net;
using MyCortex.Masters.Models;
using MyCortex.Utilities;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace MyCortex.Repositories.Masters
{
    public class LanguageSettingsRepository : ILanguageSettingsRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public IList<LanguageSettingsModel> LanguageSettings_List(int Institution_Id, Guid Login_Session_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLLANGUAGE_SP_LIST]", param);
                DataEncryption DecryptFields = new DataEncryption();
                List<LanguageSettingsModel> list = (from p in dt.AsEnumerable()
                                                    select new LanguageSettingsModel()
                                                    {
                                                        ID = p.Field<long>("ID"),
                                                        INSTITUTION_ID = p.Field<long>("INSTITUTION_ID"),
                                                        LANGUAGE_KEY = p.Field<string>("LANGUAGE_KEY"),
                                                        DEFAULT_TEXT = p.Field<string>("DEFAULT_TEXT"),
                                                        ENGLISH = p.Field<string>("ENGLISH"),
                                                        FRENCH = p.Field<string>("FRENCH"),
                                                        SPANISH = p.Field<string>("SPANISH"),
                                                        ARABIC = p.Field<string>("ARABIC"),
                                                        ISACTIVE = p.Field<bool>("ISACTIVE"),

                                                    }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public int LanguageSettings_InsertUpdate(List<LanguageSettingsModel> obj)
        {
            try
            {
                int retid = 0;
                // int executedOnce = 0;

                foreach (LanguageSettingsModel item in obj)
                {
                    //if (item.Units_ID != null)
                    {
                        List<DataParameter> param = new List<DataParameter>();
                        param.Add(new DataParameter("@ID", item.ID));
                        param.Add(new DataParameter("@INSTITUTION_ID", item.INSTITUTION_ID));
                        param.Add(new DataParameter("@ENGLISH", item.ENGLISH));
                        param.Add(new DataParameter("@FRENCH", item.FRENCH));
                        param.Add(new DataParameter("@SPANISH", item.SPANISH));
                        param.Add(new DataParameter("@ARABIC", item.ARABIC));
                        param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                        retid = ClsDataBase.Insert("[MYCORTEX].[TBLLANGUAGE_SP_UPDATE]", param, true);


                    }

                }
                return retid;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public IList<LanguageKeyValueModel> LanguageKeyValue_List(int Institution_Id, Guid Login_Session_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLLANGUAGE_SP_LIST_BASEDONINSTITUTESETTINGS]", param);
                DataEncryption DecryptFields = new DataEncryption();
                List<LanguageKeyValueModel> list = (from p in dt.AsEnumerable()
                                                    select new LanguageKeyValueModel()
                                                    {
                                                        ID = p.Field<long>("ID"),
                                                        LANGUAGE_KEY = p.Field<string>("LANGUAGE_KEY"),
                                                        LANGUAGE_VALUE = p.Field<string>("LANGUAGE_VALUE"),

                                                    }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}