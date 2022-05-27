using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
  
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Masters
{
    public class ChatSettingsRepository : IChatSettingsRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/

        public ChatSettingsRepository()
        {

            db = new ClsDataBase();
        }

        /// <summary>      
        /// Admin -->  Chat Settings --> View page
        /// to get the details of Chat Settings
        /// </summary>        
        /// <param name="Id">Id of Chat Settings</param>    
        /// <returns>Populated a AV chat admin settings </returns>

        public IList<ChatSettingsModel> ViewEditChatSettings(int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].AVCHATADMIN_SETTINGS_SP_VIEWEDIT", param);
                List<ChatSettingsModel> obj = (from p in dt.AsEnumerable()
                                         select new ChatSettingsModel()

                                         {
                                             Id = p.Field<long>("ID"),
                                             Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                           //  Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                             FromUser_TypeId = p.Field<long>("FROMUSER_TYPEID"),
                                            // FromUser = p.Field<string>("FROMUSER"),
                                             ToUser_TypeId = p.Field<long>("TOUSER_TYPEID"),
                                            // ToUser = p.Field<string>("TOUSER"),
                                             Flag = p.Field<int>("FLAG"),
                                             IsActive = p.Field<int>("ISACTIVE"),
                                             Created_by = p.Field<long>("CREATED_BY"),
                                           
                                         }).ToList();
                return obj;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        public bool ChatPreferenceSave(Int64 InstitutionId, int PreferenceType)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
                param.Add(new DataParameter("@PREFERENCE_TYPE", PreferenceType));
                ClsDataBase.Update("[MYCORTEX].[CHAT_PREFERENCE_UPDATE]", param);
                return true;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return false;
            }
        }

        public int ChatPreferenceGet(Int64 InstitutionId)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            int preferenceType = 1;

            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
                preferenceType = Convert.ToInt32(ClsDataBase.GetScalar("[MYCORTEX].[CHAT_PREFERENCE_GET]", param));
                return preferenceType;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return preferenceType;
            }
        }

        /// <summary>
        /// to Insert/Update the entered AV/Chat Settings Information 
        /// </summary>
        /// <param name="obj">AV/Chat Settings detail</param>      
        /// <returns>Inserted/Updated settings detail with status</returns>

        public IList<ChatSettingsModel> ChatSettings_AddEdit(ChatSettingsModel obj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            int retid;
           
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@ID", obj.Id));
                param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
                param.Add(new DataParameter("@FROMUSER_TYPEID", obj.FromUser_TypeId));
                param.Add(new DataParameter("@TOUSER_TYPEID", obj.ToUser_TypeId));
                param.Add(new DataParameter("@FLAG", obj.Flag));
                param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));

                var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
                /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
                try
                {
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].AVCHATADMIN_SETTINGS_SP_INSERTUPDATE", param);
                    IList<ChatSettingsModel> INS = (from p in dt.AsEnumerable()
                                                   select
                                                   new ChatSettingsModel()
                                                   {
                                                     //  Id = p.Field<long>("ID"),
                                                       Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                       FromUser_TypeId = p.Field<long>("FROMUSER_TYPEID"),
                                                       ToUser_TypeId = p.Field<long>("TOUSER_TYPEID"),
                                                       Flag = p.Field<int>("FLAG"),
                                                       IsActive = p.Field<int>("ISACTIVE"),
                                                       Created_by = p.Field<long>("CREATED_BY"),
                                                       Created_dt = p.Field<DateTime>("CREATED_DT"),
                                                       FlagType = p.Field<int>("flag"),
                                                   }).ToList();
                    return INS;
                    
                }
                catch (Exception ex)
                {
                  /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                    return null;
                }          
        }

        /// <summary>      
        /// Char Settings  --> Chat Settings
        /// to get the list of Usertypes to give access in matrix format
        /// </summary> 
        /// <returns>List of Usertypes Details</returns>
        public IList<UserTypeModel> ChatSettingsUserType_List()
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
              var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERTYPE_GENERAL_LIST");
            List<UserTypeModel> list = (from p in dt.AsEnumerable()
                                        select new UserTypeModel()
                                           {
                                               Id = p.Field<long>("ID"),
                                               TypeName = p.Field<string>("TYPENAME"),
                                               IsActive = p.Field<int>("ISACTIVE")
                                           }).ToList();
            return list;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
    }
}