using MyCortex.CommonMenu.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using log4net;
using System.Web.Script.Serialization;

namespace MyCortex.Repositories.Menu
{
    public class CommonMenuRepository : ICommonMenuRepository
    {
        ClsDataBase db;

        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
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
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USERID", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
                return null;
            }

        }
    }
}