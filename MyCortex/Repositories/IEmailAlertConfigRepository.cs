using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.EmailAlert.Models;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories
{
    interface IEmailAlertConfigRepository
    {
        EmailAlertmodel EmailAlert_View(long Id);       
        IList<EmailAlertmodel> EmailAlert_List(long Id, int IsActive);
        void EmailAlert_Active(int Id);
        void EmailAlert_Delete(int Id);
        IList<EmailAlertmodel> EmailAlertDetails_AddEdit(EmailAlertmodel obj);    
        IList<EventModel> AlertEvent_List(int Institution_Id, int Id,int status);
        IList<EventModel> DefaultAlertEvent_List(int Institution_Id, int Status);
        IList<EmailAlertmodel> Template_List(int TemplateType_Id, int Institution_Id);
        IList<EmailAlertmodel> EventTo_List(long EventId);
    }
}