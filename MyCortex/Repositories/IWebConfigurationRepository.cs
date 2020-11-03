using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IWebConfigurationRepository
    {
        IList<WebConfigurationModel> WebConfiguration_List(int? IsActive);
    }
}