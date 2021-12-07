using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using log4net;
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
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// get the list of Users Log for the filter
        /// </summary>
        /// <param name="Institution_Id">Primary key Id of institution</param>
        /// <param name="login_session_id">LOGIN SESSION ID</param>
        /// <returns></returns>
        [HttpGet]
        public IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id)
        {
            IList<AdminUsersLogModel> model;
            model = repository.Admin_Userslog_List(Institution_Id, login_session_id);
            return model;
        }
    }
}
