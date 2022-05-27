using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Web.Http;
using Newtonsoft.Json;
using MyCortex.Masters.Models;
using MyCortex.Provider;
using MyCortex.Utilities;

namespace MyCortex.Admin.Controllers
{
    public class UsersLogController : ApiController
    {
        static readonly IUsersLogRepository repository = new UsersLogRepository();

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
        /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        /// <summary>
        /// get the list of Users Log for the filter
        /// </summary>
        /// <param name="Institution_Id">Primary key Id of institution</param>
        /// <param name="login_session_id">LOGIN SESSION ID</param>
        /// <returns></returns>
        [HttpGet]
        public IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id,long? User_Id)
        {
            IList<AdminUsersLogModel> model;
            model = repository.Admin_Userslog_List(Institution_Id, login_session_id,User_Id);
            return model;
        }
        [HttpGet]
        public IList<All_UserList> GetAll_UserLists(long InstitutionId)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<All_UserList> model;
            try
            {
                /*_MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);*/
                model = repository.GetAll_UserLists(InstitutionId);
                return model;
            }
            catch (Exception ex)
            {
                /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
    }
}
