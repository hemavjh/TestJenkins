using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IMyHomeRepository
    {
        IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id);
    }
}