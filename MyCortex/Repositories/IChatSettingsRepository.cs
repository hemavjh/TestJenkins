using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IChatSettingsRepository
    {
        IList<ChatSettingsModel> ChatSettings_AddEdit(ChatSettingsModel obj);
        IList<ChatSettingsModel> ViewEditChatSettings(int Id);
        IList<UserTypeModel> ChatSettingsUserType_List();
    }
}