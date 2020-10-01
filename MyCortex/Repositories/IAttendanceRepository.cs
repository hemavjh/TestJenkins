using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;
namespace MyCortex.Repositories
{
    interface IAttendanceRepository
    {
        IList<AttendanceModel> UserType_List(long InstituteId);
        long AttendanceDetails_InsertUpdate(Guid Login_Session_Id,List<AttendanceModel> insobj);
        IList<AttendanceModel> Attendance_List(int? IsActive, long Institution_Id, Guid Login_Session_Id);
        AttendanceModel Attendance_View(long Id, Guid Login_Session_Id);
        IList<AttendanceModel> Attendance_InActive(AttendanceModel noteobj);
        IList<AttendanceModel> Attendance_Active(AttendanceModel noteobj);

        
    }
}