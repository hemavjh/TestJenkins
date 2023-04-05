using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.EmailAlert.Models
{
    public class EmailAlertmodel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long Event_Id { get; set; }
        public long EventType_Id { get; set; }
        public bool EmailFlag { get; set; }
        public bool AppFlag { get; set; }
        public bool WebFlag { get; set; }
        public bool SMSFlag { get; set; }
        public long? EmailTemplate_Id { get; set; }
        public long? AppTemplate_Id { get; set; }
        public long? WebTemplate_Id { get; set; }
        public long? SMSTemplate_Id { get; set; }
        public decimal? AlertDays { get; set; }
        public long ModifiedUser_Id { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public DateTime Crated_Date { get; set; }
        public string EventName { get; set; }
        public string TemplateName { get; set; }
        public string EventTypeName { get; set; }
        public string EmailTemplate { get; set; }
        public string AppTemplate { get; set; }
        public string WebTemplate { get; set; }  
        public long UserType_Id { get; set; }
        public string TypeName { get; set; }
        public int Flag { get; set; }
        public string EventTo { get; set; }
        public string EventCC { get; set; }
        public string SMSTemplate { get; set; }
        public IList<EmailAlertDetailsmodel> AlertDetails { get; set; }
    }
    public class EmailAlertmodelReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<EmailAlertmodel> EmailAlert { get; set; }
    }

    public class EmailAlertDetailsmodel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public long Event_Id { get; set; }
        public long UserType_Id { get; set; }
      
    }
    public class EventModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public string EventName { get; set; }
        public string EventCode { get; set; }
        public string Description { get; set; }
        public int IsActive { get; set; }
        public long EventType_Id { get; set; }
        public string Name { get; set; }
    }
    public class EventTypeModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string EventTypeName { get; set; }
        public string Description { get; set; }
        public int IsActive { get; set; }
    }

    public class EventAlertConfiguration
    {
        public long Id { get; set; }
        public long Event_Type_Id { get; set; }
        public string Event_Name { get; set; }
        public long Email_Template_Id { get; set; }
    }
}