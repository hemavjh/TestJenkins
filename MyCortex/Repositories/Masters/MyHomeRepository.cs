using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using log4net;
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Masters
{
    public class MyHomeRepository : IMyHomeRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public MyHomeRepository()
        {

            db = new ClsDataBase();
        }
       
        public IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.MYHOME_TAB_SP_LIST", param);
                DataEncryption DecryptFields = new DataEncryption();
                 List<TabListModel> list = (from p in dt.AsEnumerable()  
                                       select new TabListModel()
                                       {
                                           ID = p.Field<long>("ID"),
                                           TabName = p.Field<string>("TAB_NAME"),
                                           RefId = p.Field<string>("REF_ID"),
                                           Model = p.Field<string>("MODEL"),
                                           OS=p.Field<string>("OS"),
                                           UsersCount=p.Field<int>("NUMBER_USERS"),
                                           DevicesCount=p.Field<int>("NUMBER_DEVICES"),
                                           IsActive =p.Field<bool>("ISACTIVE")
                                       }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public long Tab_InsertUpdate(Guid Login_Session_Id, List<AttendanceModel> insobj)
        {
            try
            {
                string flag = "";
                foreach (AttendanceModel item in insobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                    param.Add(new DataParameter("@ATTENDANCE_FROMDATE", item.AttendanceFromDate));
                    param.Add(new DataParameter("@ATTENDANCE_TODATE", item.AttendanceToDate));
                    param.Add(new DataParameter("@DOCTOR_ID", item.Doctor_Id));
                    param.Add(new DataParameter("@REMARKS", item.Remarks));
                    param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.MYHOME_TAB_SP_INSERTUPDATE", param);
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

    }

}