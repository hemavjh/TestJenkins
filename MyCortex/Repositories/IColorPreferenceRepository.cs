using MyCortex.User.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IColorPreferenceRepository
    {
        ColorPreferenceModel ColorPreference_List(long? UserId);
        ColorPreferenceReturnModel ColorPreference_InsertUpdate(ColorPreferenceModel insobj);
    }
}