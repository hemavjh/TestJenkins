using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.User.Models;

namespace MyCortex.Repositories
{
    interface IAppoinmentSlotRepository
    {
        AppoinmentSlotModel AppoinmentSlot_View(long Id);
        long AppoinmentSlot_AddEdit(List<AppoinmentSlotModel> obj);
        IList<AppoinmentSlotModel> AppoinmentSlot_List(int? IsActive, long Institution_Id);
        IList<AppoinmentSlotModel> AppoinmentSlot_Delete(AppoinmentSlotModel noteobj);
        IList<AppoinmentSlotModel> AppoinmentSlot_Active(AppoinmentSlotModel noteobj);
        IList<DoctorAppoinmentSlotModel> Doctors_List(long? Institution_Id);
        AppoinmentSlotModel ActivateDoctorSlot_List(long Id, long Institution_Id, long Doctor_Id);
    }
}