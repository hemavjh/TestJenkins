﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using MyCortex.Admin.Models;
using MyCortex.Masters.Models;

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
        public int? No_Of_HiveUsers { get; set; }
        public int? No_Of_HiveChartUsers { get; set; }
        [Required]
        public int? No_Of_Hive { get; set; }
        [Required]
        public int? No_Of_HiveChart { get; set; }
        public int? No_Of_HiveDevices { get; set; }
        public int? No_Of_HiveChartDevices { get; set; }
        public DateTime Contract_PeriodFrom { get; set; }
        [Required]
        public DateTime Contract_PeriodTo { get; set; }
        public int Subscription_Type { get; set; }
        public int Recording_Type { get; set; }
        public int TelePhone_User { get; set; }

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
        public IList<Institution_Device_list> ChildDeviceList { get; set; }
        public IList<InstitutionSubscriptionLanguageModels> Institution_Languages { get; set; }
        public IList<Institution_Device_list> Institution_DeviceName_list { get; set; }
        public IList<LanguageMasterModel> Language_List { get; set; }
        public IList<Institution_Device_list> Device_list { get; set; }
        public IList<InstitutionSubscriptionLanguageModels> ChildLanguageList { get; set; }
        public IList<GatewayMasterModel> Payment_Module_Id { get; set; }
        public IList<GatewayMasterModel> ChildPaymentList { get; set; }
        public IList<GatewayMasterModel> Payment_List { get; set; }
        public IList<GatewayMasterModel> ChildInsuranceList { get; set; }
        public bool ChronicCc { get; set; }
        public bool ChronicCg { get; set; }
        public bool ChronicCl { get; set; }

        public bool ChronicSc { get; set; }

        public int Created_No_Of_Patient { get; set; }
        public int Created_No_Of_HealthCareProf { get; set; }
        public int Remaining_No_Of_Patient { get; set; }
        public int Remaining_No_Of_HealthCareProf { get; set; }

        public int? Created_No_Of_Hive { get; set; }
        public int? Created_No_Of_Hivechart { get; set; }
        public int? Remaining_No_Of_Hive { get; set; }
        public int? Remaining_No_Of_Hivechart { get; set; }

        public int? Created_No_Of_Hive_Users { get; set; }
        public int? Created_No_Of_Hivechart_Users { get; set; }
        public int? Remaining_No_Of_Hive_Users { get; set; }
        public int? Remaining_No_Of_Hivechart_Users { get; set; }

        public int? Created_No_Of_Hive_Devices { get; set; }
        public int? Created_No_Of_Hivechart_Devices { get; set; }
        public int? Remaining_No_Of_Hive_Devices { get; set; }
        public int? Remaining_No_Of_Hivechart_Devices { get; set; }
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
    public class Institution_Device_list
    {
        public long Id { get; set; }
        public long Institution_Subcription_Id { get; set; }
        public int DeviceId { get; set; }
        public string Make { get; set; }
        public string DeviceType { get; set; }
        public string Series { get; set; }
        public string ModelNumber { get; set; }
        public int IsActive { get; set; }
        public long ChildId { get; set; }
        public string DeviceName { get; set; }
    }
    public class InstitutionSubscriptionReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<InstitutionSubscriptionModel> Institute { get; set; }
    }
    public class GatewayMasterModel
    {
        public long Id { get; set; }
        public string PaymentGatewayName { get; set; }
        public int IsActive { get; set; }
        public long DefaultPaymentGatewayId { get; set; }
        public string PaymentName { get; internal set; }
        public long GateWayType { get; set; }
    }
    public class GatewayMasterReturn
    {
        public long Id { get; set; }
        public int GateWayType { get; set; }
    }
}