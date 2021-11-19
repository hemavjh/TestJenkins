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
        IList<LanguageSettingsModel> LanguageSettings_List(long Institution_Id, Guid Login_Session_Id);
        object LanguageKeyValue_List(int Language_Id,long Institution_Id);
        int LanguageSettings_InsertUpdate(List<LanguageSettingsModel> model);
        int LanguageDefault_Save(long institutionId, int languageId);
        IList<InstituteLanguageModel> InstituteLanguage_List(long Institution_Id);

    }
}
