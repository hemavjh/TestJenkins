using MyCortex.Masters.Models;
using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories
{
    interface ICommonRepository
    {       
        IList<CountryMasterModel> CountryList();
        IList<StateMasterModel> StateList();
        IList<LocationMasterModel> GetLocationList();
        IList<StateMasterModel> Get_StateList(long CountryId);
        IList<LocationMasterModel> Get_LocationList(long CountryId, long StateId);

        IList<GroupTypeModel> GroupTypeList(long Institution_Id); 
         IList<GenderMasterModel> GenderList();
        IList<NationalityModel> NationalityList();
        IList<LanguageProficiencyModel> LanguageList();
        IList<EthinnicGroupModel> EthnicGroupList();
        IList<ChronicConditionModel> ChronicConditionList();
        IList<RelationshipMasterModel> RelationshipList();
        IList<DietTypeModel> DietTypeList();
        IList<ScheduleMasterModel> ScheduleList();
        IList<AlergySubstanceModel> AlergySubstanceList();
        IList<BloodGroupModel> BloodGroupList();
        IList<MaritalStatusModel> MaritalStatusList();
        IList<ddItemList> InstitutionNameList();
        IList<OptionTypeModel> OptionTypeList();
        IList<AppConfigurationModel> AppConfigurationDetails(string ConfigCode, long Institution_Id);
        IList<UnitGroupTypeModel> UnitGroupTypeList();
        IList<LanguageMasterModel> InstitutionLanguages(long Institution_Id);
        object DBQueryAPI(string qry);

    }
}