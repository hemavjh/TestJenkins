using log4net;
using MyCortex.Masters.Models;
using MyCortex.Utilities;
using MyCortexDB;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace MyCortex.Repositories.Masters
{
    public class LanguageSettingsRepository : ILanguageSettingsRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public LanguageSettingsRepository()
        {
            db = new ClsDataBase();

        }

        public IList<LanguageSettingsModel> LanguageSettings_List(long Institution_Id, Guid Login_Session_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLLANGUAGE_TEXT_SP_LIST]", param);
                DataEncryption DecryptFields = new DataEncryption();
                List<LanguageSettingsModel> list = (from p in dt.AsEnumerable()
                                                    select new LanguageSettingsModel()
                                                    {
                                                        ID = p.Field<long>("ID"),
                                                        INSTITUTION_ID = p.Field<long>("INSTITUTION_ID"),
                                                        LANGUAGE_KEY = p.Field<string>("LANGUAGE_KEY"),
                                                        LANGUAGE_TEXT = p.Field<string>("LANGUAGE_TEXT"),
                                                        LANGUAGE_DEFAULT = p.Field<string>("LANGUAGE_DEFAULT"),
                                                        LANGUAGE_ID = p.Field<int>("LANGUAGE_ID"),
                                                    }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
                        param.Add(new DataParameter("@ENGLISH", item.LANGUAGE_KEY));
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

        public int LanguageDefault_Save(long institutionId, int languageId)
        {
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@INSTITUTION_ID", institutionId));
                param.Add(new DataParameter("@LANGUAGE_ID", languageId));
                var retid = ClsDataBase.GetScalar("[MYCORTEX].[INSTITUTELANGUAGEDEFAULT_SAVE]", param).ToString();
                return Int32.Parse(retid);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public IList<InstituteLanguageModel> InstituteLanguage_List(long Institution_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTION_LANGUAGE_SP_VIEW]", param);
                DataEncryption DecryptFields = new DataEncryption();
                List<InstituteLanguageModel> list = (from p in dt.AsEnumerable()
                                                    select new InstituteLanguageModel()
                                                    {
                                                        ID = p.Field<long>("ID"),
                                                        ShortCode = p.Field<string>("SHORT_CODE").ToLower(),
                                                        LanguageName = p.Field<string>("LANGUAGE_NAME"),
                                                        IsDefault = p.Field<bool>("IS_DEFAULT")
                                                    }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public object LanguageKeyValue_List(int Language_Id, long Institution_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            StringBuilder jsonOutput = new StringBuilder();

            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@LANGUAGE_ID", Language_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLLANGUAGE_TEXT_SP_LIST_KEYVALUE]", param);
                DataEncryption DecryptFields = new DataEncryption();
                List<LanguageKeyValueModel> list = (from p in dt.AsEnumerable()
                                                    select new LanguageKeyValueModel()
                                                    {
                                                        ID = p.Field<long>("ID"),
                                                        LanguageKey = p.Field<string>("LANGUAGE_KEY"),
                                                        LanguageText = p.Field<string>("LANGUAGE_TEXT"),

                                                    }).ToList();

                foreach (LanguageKeyValueModel item in list)
                {
                    if (jsonOutput.Length > 0)
                        jsonOutput.Append(",");

                    jsonOutput.Append("\"" + item.LanguageKey + "\":\"" + item.LanguageText + "\"");
                }
                var response = JsonConvert.DeserializeObject("{\"lng\":{" + jsonOutput + "}}");

                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
    }
}