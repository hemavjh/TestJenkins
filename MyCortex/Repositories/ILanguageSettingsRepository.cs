using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCortex.Repositories
{
    interface ILanguageSettingsRepository
    {
        IList<LanguageSettingsModel> LanguageSettings_List(int Institution_Id, Guid Login_Session_Id);
        IList<LanguageKeyValueModel> LanguageKeyValue_List(int Language_Id,int Institution_Id);
        int LanguageSettings_InsertUpdate(List<LanguageSettingsModel> model);
        IList<InstituteLanguageModel> InstituteLanguage_List(int Institution_Id);

    }
}
