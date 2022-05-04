using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
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
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public UsersLogRepository()
        {
            db = new ClsDataBase();
        }

        public IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id,long? User_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            
            param.Add(new DataParameter("@InstitutionId", Institution_Id));
            param.Add(new DataParameter("@UserId", User_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERS_LOG_LIST",param);
            List<AdminUsersLogModel> list = (from p in dt.AsEnumerable()
                                             select new AdminUsersLogModel()
                                             {
                                                 ID = p.Field<long?>("ID"),
                                                 FULLNAME = p.Field<string>("FULLNAME"),
                                                 INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID"),
                                                 LOGINTIME = p.Field<DateTime?>("LOGINTIME"),
                                                 LOGOUTTIME = p.Field<DateTime?>("LOGOUTTIME"),
                                                 COUNTRYCODE = p.Field<string>("COUNTRYCODE"),
                                                 LONGITUDE = p.Field<string>("LONGITUDE"),
                                                 LATITUDE = p.Field<string>("LATITUDE"),
                                                 REGIONNAME = p.Field<string>("REGIONNAME"),
                                                 ZIPCODE = p.Field<string>("ZIPCODE"),
                                                 USERNAME = p.Field<string>("USERNAME"),
                                                 STATUS = p.Field<string>("STATUS"),
                                                 FAILURE_REASON = p.Field<string>("FAILURE_REASON"),
                                                 LOGIN_COUNTRY = p.Field<string>("LOGIN_COUNTRY"),
                                                 LOGIN_CITY = p.Field<string>("LOGIN_CITY")
                                             }).ToList();
            return list;
        }
        public IList<All_UserList> GetAll_UserLists(long InstitutionId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_ALL_USERLIST]", param);
                List<All_UserList> lst = (from p in dt.AsEnumerable()
                                            select new All_UserList()
                                            {
                                                Id = p.Field<long>("ID"),
                                                FirstName = p.Field<string>("FIRSTNAME"),
                                                FullName = p.Field<string>("FULLNAME"),
                                                DepartmentId = p.Field<long>("DEPARTMENT_ID"),
                                                EmailId = p.Field<string>("EMAILID"),
                                                UserTypeId = p.Field<long>("USERTYPE_ID"),
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