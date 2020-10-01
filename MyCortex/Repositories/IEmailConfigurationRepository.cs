using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories
{
    interface IEmailConfigurationRepository
    {
        long EmailHistory_AddEdit(EmailGenerateModel obj);
        long EmailConfiguration_AddEdit(EmailConfigurationModel obj);
        EmailConfigurationModel EmailConfiguration_View(long Institution_Id);
    }
}