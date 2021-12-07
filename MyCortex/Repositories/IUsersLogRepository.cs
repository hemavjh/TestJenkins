using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IUsersLogRepository
    {
        IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id);
    }        
}