using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IInstitutionSubscriptionRepository
    {
        IList<InstitutionSubscriptionModel> InstitutionSubscription_AddEdit(Guid Login_Session_Id, InstitutionSubscriptionModel obj);
        InstitutionModel InstitutionDetailList(long? Id);
        IList<ModuleMasterModel> ModuleNameList();
        IList<LanguageMasterModel> LanguageNameList();
        IList<TelePhoningMasterModel> TelephoningNameList();
        IList<Institution_Device_list> Get_DeviceNameList();
        IList<InstitutionSubscriptionModel> InstitutionSubscription_List(long? Id, Guid Login_Session_Id);
        InstitutionSubscriptionModel InstitutionSubscriptionDetails_View(long Id, Guid Login_Session_Id);
        //IList<InstitutionSubscriptionModuleModels> InstitutionSubscriptionModuleDetails_View(int Id);
        InstitutionSubscriptionModel InstitutionSubscriptionActiveDetails_View(long Id, Guid Login_Session_Id);
        IList<GatewayMasterModel> PaymentModule_List();
    }
}