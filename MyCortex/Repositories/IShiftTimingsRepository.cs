using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;
namespace MyCortex.Repositories
{
    interface IShiftTimingsRepository
    {

        IList<ShiftTimingsModel> ShiftTimings_InsertUpdate(Guid Login_Session_Id,ShiftTimingsModel obj);
        IList<ShiftTimingsModel> ShiftTimings_List(int? IsActive, long InstituteId, Guid Login_Session_Id);
        ShiftTimingsModel ShiftTimings_View(long Id, Guid Login_Session_Id);
        IList<ShiftTimingsModel> ShiftTimings_InActive(ShiftTimingsModel noteobj);
        IList<ShiftTimingsModel> ShiftTimings_Active(ShiftTimingsModel noteobj);
        ShiftTimingsModel ActivateShiftTiming_List(long Id, long Institution_Id);
    }
}