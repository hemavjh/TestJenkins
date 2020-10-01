using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IPasswordPolicyRepository
    {
        IList<PasswordPolicyModel> PasswordPolicy_InsertUpdate(PasswordPolicyModel obj);
        PasswordPolicyModel PasswordPolicy_View(long Institution_Id);
    }
}