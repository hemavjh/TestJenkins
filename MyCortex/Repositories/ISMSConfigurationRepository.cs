using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories
{
    interface ISMSConfigurationRepository
    {
      
        long SMSConfiguration_AddEdit(SMSConfigurationModel obj);
        SMSConfigurationModel SMSConfiguration_View(long Institution_Id);
        IList<SendSMSModel> SendEmail_AddEdit(SendSMSModel obj);
    }
}