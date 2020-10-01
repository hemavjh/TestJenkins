using MyCortex.Login.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HRMS.Repositories
{
    interface IEmployeeLoginRepository
    {
        int Employeelogin_AddEdit(EmployeeLoginModel obj);
    }
}