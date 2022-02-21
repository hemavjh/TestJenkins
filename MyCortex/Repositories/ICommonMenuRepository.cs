using MyCortex.CommonMenu.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface ICommonMenuRepository
    {
        IList<CommonMenuModel> CommonMenu_Listall(long Id);

        IList<CommonModuleList> CommonModule_List(long InsId);
    }
}