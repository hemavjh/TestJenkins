using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MyCortex.Masters.Models
{
    public class AppConfigurationModel
    {
        public long Institution_Id { get; set; }
        public string ConfigCode { get; set; }
        public string ConfigInfo { get; set; }
        public string ConfigValue { get; set; }
        public string ConfigTypeDefinition { get; set; }

    }

    public class MyAppointmentSettingsModel
    {
        public long Id { get; set; }
        public long InstitutionId { get; set; }
        public int NewAppointmentDuration { get; set; }
        public int FollowupDuration { get; set; }
        public int Interval { get; set; }
        public int MaxScheduleDays { get; set; }
        public bool IsDirectAppointment { get; set; }
        public bool IsCC { get; set; }
        public bool IsCG { get; set; }
        public bool IsCL { get; set; }
        public bool IsSC { get; set; }
        public bool IsPatient { get; set; }
        public int MinRescheduleDays { get; set; }
        public int MinRescheduleMinutes { get; set; }
        public bool IsAutoReschedule { get; set; }
        public int TimeZoneId { get; set; }
        public string TimeZoneName { get; set; }
        public int Appointment_Module { get; set; }
        public long DefaultPaymentId { get; set; }
        public long DefaultInsuranceId { get; set; }
        public List<MyAppointmentGatewayModel> GatewayDetails { get; set; }
        public int flag { get; set; }
        public string Status { get; set; }
        public int Telephonic_Settings { get; set; }
    }

    public class MyAppointmentGatewayModel
    {
        public long GatewayId { get; set; }
        public string GatewayName { get; set; }
        public int GatewayType { get; set; }
        public string GatewayKey { get; set; }
        public string GatewayValue { get; set; }
    }

    public class AppConfigurationsModel
    {
        public int flag { get; set; }
        public string Status { get; set; }
        public IList<AppConfigurationModel> AppConfigurations { get; set; }
        public MyAppointmentSettingsModel AppointmentSettings { get; set; }
    }
}