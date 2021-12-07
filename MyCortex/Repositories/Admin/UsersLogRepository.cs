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
using MyCortex.Utilities;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Admin
{
    public class UsersLogRepository : IUsersLogRepository    
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public UsersLogRepository()
        {
            db = new ClsDataBase();
        }

        DataEncryption DecryptFields = new DataEncryption();
        public IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id)
        {
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERS_LOG_LIST");
            List<AdminUsersLogModel> list = (from p in dt.AsEnumerable()
                                             select new AdminUsersLogModel()
                                             {
                                                 ID = p.Field<long?>("ID"),

                                                 FULLNAME = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                 INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID"),
                                                 LOGINTIME = p.Field<DateTime?>("LOGINTIME"),
                                                 LOGOUTTIME = p.Field<DateTime?>("LOGOUTTIME"),
                                             }).ToList();
            return list;
        }
    }
}