using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IGatewaySettingsRepository
    {
        IList<GatewaySettingsModel> GatewaySettings_List(long Institution_Id, Guid Login_Session_Id);
        IList<GatewaySettingsModel> GatewaySettings_Details(long InstitutionId, long GatewayId, string GatewayKey);
        int GatewaySettings_Update(List<GatewaySettingsModel> model);
        int GatewayDefault_Save(long InstitutionId, long GatewayTypeId, long GatewayId);
    }
}