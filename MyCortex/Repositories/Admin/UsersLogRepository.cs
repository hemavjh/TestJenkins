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

        public IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id,long? User_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            
            param.Add(new DataParameter("@InstitutionId", Institution_Id));
            param.Add(new DataParameter("@UserId", User_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
            List<DataParameter> param = new List<DataParameter>();
            DataEncryption DecryptFields = new DataEncryption();
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_ALL_USERLIST]", param);
                List<All_UserList> lst = (from p in dt.AsEnumerable()
                                            select new All_UserList()
                                            {
                                                Id = p.Field<long>("ID"),
                                                FirstName = DecryptFields.Decrypt(p.Field<string>("FIRSTNAME")),
                                                FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                DepartmentId = p.Field<long>("DEPARTMENT_ID"),
                                                EmailId = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                                UserTypeId = p.Field<long>("USERTYPE_ID"),
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