using MyCortex.Masters.Models;
using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using System.Threading.Tasks;

namespace MyCortex.Repositories
{
    interface ICommonRepository
    {       
        IList<CountryMasterModel> CountryList();
        IList<CountryMasterModel> CloneCountryList(string search);
        IList<StateMasterModel> StateList();
        IList<LocationMasterModel> GetLocationList();
        IList<StateMasterModel> Get_StateList(long CountryId);
        IList<StateMasterModel> Clone_Get_StateList(long CountryId, string search);
        IList<LocationMasterModel> Get_LocationList(long CountryId, long StateId);
        IList<LocationMasterModel> Clone_Get_LocationList(long CountryId, long StateId, string search);
        IList<GroupTypeModel> GroupTypeList(long Institution_Id);
        IList<GroupTypeModel> Clone_GroupTypeList(long Institution_Id, string search);
        IList<GenderMasterModel> GenderList();
        IList<GenderMasterModel> CloneGenderList(string search);
        IList<NationalityModel> NationalityList();
        IList<NationalityModel> CloneNationalityList(string search);
        IList<LanguageProficiencyModel> LanguageList();
        IList<EthinnicGroupModel> EthnicGroupList();
        IList<EthinnicGroupModel> CloneEthnicGroupList(string search);
        IList<ChronicConditionModel> ChronicConditionList();
        IList<ChronicConditionModel> CloneChronicConditionList(string search);
        IList<RelationshipMasterModel> RelationshipList();
        IList<RelationshipMasterModel> CloneRelationshipList(string search);
        IList<DietTypeModel> DietTypeList();
        IList<ScheduleMasterModel> ScheduleList();
        IList<AlergySubstanceModel> AlergySubstanceList();
        IList<BloodGroupModel> BloodGroupList();
        IList<BloodGroupModel> CloneBloodGroupList(string search);
        IList<MaritalStatusModel> MaritalStatusList();
        IList<MaritalStatusModel> CloneMaritalStatusList(string search);
        IList<ddItemList> InstitutionNameList(long status);
        IList<OptionTypeModel> OptionTypeList();
        IList<AppConfigurationModel> AppConfigurationDetails(string ConfigCode, long Institution_Id);
        IList<UnitGroupTypeModel> UnitGroupTypeList();
        IList<LanguageMasterModel> InstitutionLanguages(long Institution_Id);
        IList<GatewayMaster> InstitutionPayments(long Institution_Id);
        IList<GatewayMaster> InstitutionInsurances(long Institution_Id);
        IList<TabDevicesList> Deviceslist();
        IList<TabUserList> UserList(long Institution_Id);
        TabUserList USERPINDETAILS(long ID);
        object DBQueryAPI(string qry);
        int DefaultConfig_InsertUpdate(long Institution_Id, int Step);
        IList<GatewayInsuranceList> InstitutionInsurance();
        IList<GatewayInsuranceList> InstitutionPayment();
        AppointmentTimeZone getTimeZoneMasterId(string Name);
        MyAppointmentSettingsModel getMyAppointmentSettings(long Institution_Id);

    }
}