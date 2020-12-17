using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class LanguageSettingsModel
    {
        public long ID { get; set; }
        public long INSTITUTION_ID { get; set; }
        public string LANGUAGE_KEY { get; set; }
        public string LANGUAGE_TEXT { get; set; }
        public string LANGUAGE_DEFAULT { get; set; }
    }

    public class LanguageKeyValueModel
    {
        public long ID { get; set; }
        public string LANGUAGE_KEY { get; set; }
        public string LANGUAGE_VALUE { get; set; }
    }

    public class LanguageSettingsReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<LanguageSettingsModel> LanguageSettings { get; set; }
    }
}