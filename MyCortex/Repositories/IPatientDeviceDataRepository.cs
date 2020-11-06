using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.User.Models;

namespace MyCortex.Repositories
{
    interface IPatientDeviceDataRepository
    {
        long PatientDeviceData_InsertUpdate(List<PatientDeviceDataModel> insobj);
    }
}