using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IWebConfigurationRepository
    {
        IList<WebConfigurationModel> WebConfiguration_List(int? IsActive, int? Institution_Id);
        WebConfigurationModel WebConfiguration_View(long Id, Guid Login_Session_Id);
        long WebConfiguration_InsertUpdate(Guid Login_Session_Id, List<WebConfigurationModel> insobj);
        int Configuration_InsertUpdate(List<WebConfigurationModel> model);
        IList<WebConfigurationModel> WebConfiguration_InActive(WebConfigurationModel noteobj);
        IList<WebConfigurationModel> WebConfiguration_Active(WebConfigurationModel noteobj);
    }
}