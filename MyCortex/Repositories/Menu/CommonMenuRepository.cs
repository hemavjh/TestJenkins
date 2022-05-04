using MyCortex.CommonMenu.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
  
using System.Web.Script.Serialization;

namespace MyCortex.Repositories.Menu
{
    public class CommonMenuRepository : ICommonMenuRepository
    {
        ClsDataBase db;

 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        /// <summary>
        /// Initializes a new instance of the class.       
        /// </summary>
        public CommonMenuRepository()
        {
            db = new ClsDataBase();

        }

        /// <summary>
        /// menu list based on user login
        /// </summary>
        /// <param name="Id">user id</param>
        /// <returns>menu list with page URL</returns>
        public IList<CommonMenuModel> CommonMenu_Listall(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USERID", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[COMMON_SP_MENU_LIST]", param);
                List<CommonMenuModel> lst = (from p in dt.AsEnumerable()
                                             select new CommonMenuModel()
                                             {
                                                 Menu_Id = p.Field<long>("MENU_ID"),
                                                 Menu_Name = p.Field<string>("MENU_NAME"),
                                                 Menu_Level = p.Field<int>("MENU_LEVEL"),
                                                 Menu_URL = p.IsNull("MENU_URL") ? null : p.Field<string>("MENU_URL"),
                                                 Image_URL = p.IsNull("IMAGE_URL") ? null : p.Field<string>("IMAGE_URL"),
                                                 Parent_Id = p.Field<int>("PARENT_ID"),
                                                 Display_Order = p.IsNull("DISPLAY_ORDER") ? 0 : p.Field<int>("DISPLAY_ORDER"),
                                                 HasChild = p.Field<int>("HASCHILD")
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
        /// Module list based on user login
        /// </summary>
        /// <param name="InsId">Institution Id</param>
        /// <returns>menu list with page URL</returns>
        public IList<CommonModuleList> CommonModule_List(long InsId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@InsId", InsId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_INSTITUTION_MODULELIST]", param);
                List<CommonModuleList> lst = (from p in dt.AsEnumerable()
                                              select new CommonModuleList()
                                              {
                                                  Module_Id = p.Field<long>("MODULE_ID"),
                                                  Module_Name = p.Field<string>("MODULE_NAME"),
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