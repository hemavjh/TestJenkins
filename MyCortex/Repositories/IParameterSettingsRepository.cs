using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface  IParameterSettingsRepository
   {
        IList<ProtocolParameterMasterModel> ProtocolParameterMasterList();
        IList<UnitsMasterModel> UnitMasterList();
        int ParameterSettings_AddEdit(List<ParamaterSettingsModel> model);
        IList<ParamaterSettingsModel> ViewEditProtocolParameters(int Id);
        IList<ParamaterSettingsModel> ParameterMappingList(int? Parameter_Id);        
   }
  }
   