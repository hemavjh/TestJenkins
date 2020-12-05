using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IColorPreferenceRepository
    {
        
        ColorPreferenceModel ColorPreference_List(int? UserId, Guid Login_Session_Id);
        ColorPreferenceReturnModel ColorPreference_InsertUpdate(Guid Login_Session_Id, ColorPreferenceModel insobj);
    }
}