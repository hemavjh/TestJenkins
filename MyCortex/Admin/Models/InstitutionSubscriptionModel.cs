using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using MyCortex.Admin.Models;

namespace MyCortex.Admin.Models
{
    public class InstitutionSubscriptionModel
    {
        public InstitutionSubscriptionModel()
        {

        }



        public long Id { get; set; }
        public long Institution_Id { get; set; }
        [Required]
        public int Health_Care_Professionals { get; set; }
        [Required]
        public int No_Of_Patients { get; set; }
        [Required]
        public DateTime Contract_PeriodFrom { get; set; }
        [Required]
        public DateTime Contract_PeriodTo { get; set; }
        public int Subscription_Type { get; set; }

        public int? IsActive { get; set; }
        public int? CreatedBy_Id { get; set; }
        public DateTime Created_Dt { get; set; }
        public int TimeZone_ID { get; set; }
        public int Appointment_Module_Id { get; set; }
        public int returnval { get; set; }
        public int flag { get; set; }

        public InstitutionModel Institution { get; set; }
        public IList<InstitutionSubscriptionModuleModels> Institution_Modules { get; set; }
        public IList<ModuleMasterModel> Module_List { get; set; }
        public IList<InstitutionSubscriptionModuleModels> ChildModuleList { get; set; }
        public IList<InstitutionSubscriptionLanguageModels> Institution_Languages { get; set; }
        public IList<LanguageMasterModel> Language_List { get; set; }
        public IList<InstitutionSubscriptionLanguageModels> ChildLanguageList { get; set; }
        public int Payment_ID { get; set; }
        public int Gateway_ID { get; set; }

    }

  
    public class InstitutionSubscriptionModuleModels
    {
        public long Id { get; set; }
        public long Institution_Subcription_Id { get; set; }
        public long ModuleId { get; set; }
        public long ChildId { get; set; }
        public string ModuleName { get; set; }

    }

    public class InstitutionSubscriptionLanguageModels
    {
        public long Id { get; set; }
        public long Institution_Subcription_Id { get; set; }
        public long LanguageId { get; set; }
        public long ChildId { get; set; }
        public string LanguageName { get; set; }
    }

    public class InstitutionSubscriptionReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<InstitutionSubscriptionModel> Institute { get; set; }
    }


}