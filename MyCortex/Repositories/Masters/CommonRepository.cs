
using MyCortex.Masters.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using log4net;
using System.Web.Script.Serialization;
using MyCortex.User.Model;
using MyCortex.Admin.Models;
using Newtonsoft.Json;
using System.Threading.Tasks;
using MyCortex.Utilities;

namespace MyCortex.Repositories.Masters
{
    public class CommonRepository : ICommonRepository
    {
        ClsDataBase db;

        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public CommonRepository()
        {
            db = new ClsDataBase();
        }


        /// <summary>      
        /// Getting Country to populate dropdown
        /// </summary>          
        /// <returns>Populated List of Country </returns>
        public IList<CountryMasterModel> CountryList()
        {
            List<DataParameter> param = new List<DataParameter>();

            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].COUNTRYMASTER_SP_COUNTRYNAME");
                List<CountryMasterModel> lst = (from p in dt.AsEnumerable()
                                                select new CountryMasterModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    CountryName = p.Field<string>("COUNTRY_NAME"),
                                                    IsActive = p.Field<int>("IsActive")
                                                }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Getting State to populate dropdown
        /// </summary>          
        /// <returns>List of State </returns>
      public IList<StateMasterModel> StateList()
        {
            List<DataParameter> param = new List<DataParameter>();
          
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].StateMaster_SP_GetStateName");
                List<StateMasterModel> lst = (from p in dt.AsEnumerable()
                                              select new StateMasterModel()
                                              {
                                                  Id = p.Field<long>("Id"),
                                                  CountryId = p.Field<long?>("CountryId"),
                                                  StateName = p.Field<string>("StateName"),
                                                  IsActive = p.Field<int>("IsActive"),
                                              }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
      /// <summary>      
      /// Getting city list to populate dropdown
      /// </summary>          
      /// <returns>List of city</returns>
        public IList<LocationMasterModel> GetLocationList()
        {
            // List<DataParameter> param = new List<DataParameter>();

            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].LocationMaster_SP_GetLocationName");
                List<LocationMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new LocationMasterModel()
                                                 {
                                                     Id = p.Field<long>("Id"),
                                                     // CountryId = p.Field<int?>("CountryId"),
                                                     StateId = p.Field<long?>("StateId"),
                                                     Active = p.Field<int>("IsActive"),
                                                     LocationName = p.Field<string>("LocationName")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>      
        /// Getting State list of a country to populate dropdown
        /// </summary>          
        /// <returns>List of State of a country</returns>
        public IList<StateMasterModel> Get_StateList(long CountryId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@COUNTRYID", CountryId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].COUNTRYASEDSTATE_SP_LIST", param);
                List<StateMasterModel> lst = (from p in dt.AsEnumerable()
                                              select new StateMasterModel()
                                              {
                                                  Id = p.Field<long>("Id"),
                                                  CountryId = p.Field<long?>("CountryId"),
                                                  StateName = p.Field<string>("StateName"),
                                                  IsActive = p.Field<int>("IsActive"),
                                              }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        /// <summary>      
        /// Getting city list of a state to populate dropdown
        /// </summary>          
        /// <returns>List of city of a state</returns>
        public IList<LocationMasterModel> Get_LocationList(long CountryId, long StateId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@COUNTRYID", CountryId));
            param.Add(new DataParameter("@STATEID", StateId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].STATEBASEDLOCATION_SP_LIST", param);
                List<LocationMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new LocationMasterModel()
                                                 {
                                                     Id = p.Field<long>("Id"),
                                                     // CountryId = p.Field<int?>("CountryId"),
                                                     StateId = p.Field<long?>("StateId"),
                                                     Active = p.Field<int>("IsActive"),
                                                     LocationName = p.Field<string>("LocationName")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// user group list
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>users group list of a institution</returns>
        public IList<GroupTypeModel> GroupTypeList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GROUPTYPE_SP_LIST", param);
                List<GroupTypeModel> lst = (from p in dt.AsEnumerable()
                                            select new GroupTypeModel()
                                            {
                                                Id = p.Field<long>("Id"),
                                                GROUP_NAME = p.Field<string>("GROUP_NAME"),
                                                IsActive = p.Field<int>("IsActive")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// gender name list
        /// </summary>
        /// <returns>gender name list</returns>
        public IList<GenderMasterModel> GenderList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GENDER_SP_LIST");
                List<GenderMasterModel> lst = (from p in dt.AsEnumerable()
                                               select new GenderMasterModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   Gender_Name = p.Field<string>("GENDER_NAME"),
                                                   IsActive = p.Field<int>("IsActive")
                                               }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// nationality name list
        /// </summary>
        /// <returns>nationality name list</returns>
        public IList<NationalityModel> NationalityList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].NATIONALITY_SP_LIST");
                List<NationalityModel> lst = (from p in dt.AsEnumerable()
                                              select new NationalityModel()
                                              {
                                                  Id = p.Field<long>("Id"),
                                                  Name = p.Field<string>("NAME"),
                                                  IsActive = p.Field<int>("IsActive")
                                              }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// language name list
        /// </summary>
        /// <returns>language name list</returns>
        public IList<LanguageProficiencyModel> LanguageList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].LANGUAGE_SP_LIST");
                List<LanguageProficiencyModel> lst = (from p in dt.AsEnumerable()
                                                      select new LanguageProficiencyModel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Name = p.Field<string>("Name"),
                                                          IsActive = p.Field<int>("IsActive")
                                                      }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// marital status name list
        /// </summary>
        /// <returns>marital status name list</returns>
        public IList<MaritalStatusModel> MaritalStatusList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].MARITALSTATUS_SP_LIST");
                List<MaritalStatusModel> lst = (from p in dt.AsEnumerable()
                                                select new MaritalStatusModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    Name = p.Field<string>("Name"),
                                                    IsActive = p.Field<int>("IsActive")
                                                }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// Ethnic Group status name list
        /// </summary>
        /// <returns>Ethnic Group name list</returns>
        public IList<EthinnicGroupModel> EthnicGroupList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ETHINICGROUP_SP_LIST");
                List<EthinnicGroupModel> lst = (from p in dt.AsEnumerable()
                                                select new EthinnicGroupModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    Name = p.Field<string>("Name"),
                                                    IsActive = p.Field<int>("IsActive")
                                                }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// Chronic condition status name list
        /// </summary>
        /// <returns>chronic condition name list</returns>
        public IList<ChronicConditionModel> ChronicConditionList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CHRONICCONDITION_SP_LIST");
                List<ChronicConditionModel> lst = (from p in dt.AsEnumerable()
                                                   select new ChronicConditionModel()
                                                   {
                                                       Id = p.Field<long>("Id"),
                                                       Name = p.Field<string>("Name"),
                                                       IsActive = p.Field<int>("IsActive")
                                                   }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// relation ship name list
        /// </summary>
        /// <returns>relation ship name list</returns>
        public IList<RelationshipMasterModel> RelationshipList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].RELATIONSHIPMASTER_SP_LIST");
                List<RelationshipMasterModel> lst = (from p in dt.AsEnumerable()
                                                     select new RelationshipMasterModel()
                                                     {
                                                         Id = p.Field<long>("Id"),
                                                         Name = p.Field<string>("Name"),
                                                         IsActive = p.Field<int>("IsActive")
                                                     }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// diet type name list
        /// </summary>
        /// <returns> diet type name list</returns>
        public IList<DietTypeModel> DietTypeList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DIETDESCRIBE_SP_LIST");
                List<DietTypeModel> lst = (from p in dt.AsEnumerable()
                                           select new DietTypeModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               Name = p.Field<string>("Name"),
                                               IsActive = p.Field<int>("IsActive")
                                           }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// schedule name list
        /// </summary>
        /// <returns></returns>
        public IList<ScheduleMasterModel> ScheduleList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SCHEDULE_SP_LIST");
                List<ScheduleMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new ScheduleMasterModel()
                                                 {
                                                     Id = p.Field<long>("Id"),
                                                     Name = p.Field<string>("Name"),
                                                     IsActive = p.Field<int>("IsActive")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// allergy substance type list
        /// </summary>
        /// <returns></returns>
        public IList<AlergySubstanceModel> AlergySubstanceList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALERGYSUBSTANCE_SP_LIST");
                List<AlergySubstanceModel> lst = (from p in dt.AsEnumerable()
                                                  select new AlergySubstanceModel()
                                                  {
                                                      Id = p.Field<long>("Id"),
                                                      Name = p.Field<string>("Name"),
                                                      IsActive = p.Field<int>("IsActive")
                                                  }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// blood group name list
        /// </summary>
        /// <returns></returns>
        public IList<BloodGroupModel> BloodGroupList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].BLOODGROUP_SP_LIST");
                List<BloodGroupModel> lst = (from p in dt.AsEnumerable()
                                             select new BloodGroupModel()
                                             {
                                                 Id = p.Field<long>("Id"),
                                                 BloodGroup_Name = p.Field<string>("BloodGroup_Name"),
                                                 IsActive = p.Field<int>("IsActive")
                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// blood group name list
        /// </summary>
        /// <returns></returns>
        public IList<TabDeviceslist> Deviceslist()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[MyHomeDeviceLists]");
                List<TabDeviceslist> lst = (from p in dt.AsEnumerable()
                                             select new TabDeviceslist()
                                             {
                                                 ID = p.Field<long>("ID"),
                                                 DeviceName = p.Field<string>("DeviceName"),
                                                 ISACTIVE = p.Field<bool>("ISACTIVE")
                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        public IList<TabUserlist> UserList(long Institution_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>(); 
            param.Add(new DataParameter("@INSTITUTIONID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTYPE_TAB_DETAILS]", param);
                List<TabUserlist> lst = (from p in dt.AsEnumerable()
                                         select new TabUserlist()
                                         {
                                             ID = p.Field<long>("ID"),
                                             FULLNAME = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                             PIN = p.Field<string>("PIN"),
                                             ISACTIVE = Convert.ToBoolean(p.Field<int>("ISACTIVE"))
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public TabUserlist USERPINDETAILS(long ID)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", ID));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTYPE_TABPIN_DETAILS]", param);
            TabUserlist list = (from p in dt.AsEnumerable()
                                      select new TabUserlist()
                                      {
                                          ID = p.Field<long>("ID"),
                                          FULLNAME = p.Field<string>("USERNAME"),
                                          PIN = p.Field<string>("PIN"),
                                          ISACTIVE = Convert.ToBoolean(p.Field<int>("ISACTIVE"))

                                      }).FirstOrDefault();
            return list;
        }

        /// <summary>
        /// to get affiliation name list
        /// </summary>
        /// <returns>affiliation name list</returns>
        public IList<ddItemList> InstitutionNameList(long status)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Status", status));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SP_GETINSTITUTIONNAME", param);
            List<ddItemList> list = (from p in dt.AsEnumerable()
                                     select new ddItemList()
                                     {
                                         Id = p.Field<long>("Id"),
                                         Name = p.Field<string>("INSTITUTION_NAME")
                                     }).ToList();
            return list;
        }
        /// <summary>
        /// to get option type name list
        /// </summary>
        /// <returns>option type name list</returns>
        public IList<OptionTypeModel> OptionTypeList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].OPTIONTYPE_SP_LIST");
                List<OptionTypeModel> lst = (from p in dt.AsEnumerable()
                                             select new OptionTypeModel()
                                             {
                                                 Id = p.Field<long>("Id"),
                                                 OptionName = p.Field<string>("OptionName"),
                                                 IsActive = p.Field<int>("IsActive")
                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// to get App Configuration value of a App Configuration in a institution
        /// </summary>
        /// <returns>App configuration value</returns>
        public IList<AppConfigurationModel> AppConfigurationDetails(string ConfigCode, long Institution_Id)
        {
            
            List<DataParameter> param = new List<DataParameter>();
            if (!string.IsNullOrEmpty(ConfigCode))
            {
                param.Add(new DataParameter("@CONFIGCODE", ConfigCode));
            }
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[APPCONFIGURATION_SP_LIST]", param);
            var configList = (from p in dt.AsEnumerable()
                                select new AppConfigurationModel()
                                {
                                    Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                    ConfigCode = p.Field<string>("CONFIGCODE"),
                                    ConfigInfo = p.Field<string>("CONFIGINFO"),
                                    ConfigValue = p.Field<string>("CONFIGVALUE"),
                                    ConfigTypeDefinition = p.Field<string>("CONFIG_TYPEDEFINITION")
                                }).ToList();
               
            return configList;
        }

        public IList<UnitGroupTypeModel> UnitGroupTypeList()
        {
            List<DataParameter> param = new List<DataParameter>();

            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].UNITGROUPTYPE_SP_LIST");
                List<UnitGroupTypeModel> lst = (from p in dt.AsEnumerable()
                                                select new UnitGroupTypeModel()
                                                {
                                                    Id = p.Field<long>("ID"),
                                                    UnitGroupName = p.Field<string>("UNITSGROUPNAME"),
                                                    IsActive = p.Field<int>("ISACTIVE")
                                                }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<LanguageMasterModel> InstitutionLanguages(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ISUBSCRIPTIONLANGUAGE_SP_LIST]", param);
                List<LanguageMasterModel> lst = (from p in dt.AsEnumerable()
                                                select new LanguageMasterModel()
                                                {
                                                    Id = p.Field<long>("LANGUAGE_ID"),
                                                    LanguageName = p.Field<string>("LANGUAGE_NAME"),
                                                    DefaultLanguageId = p.Field<int>("LANGUAGE_PREFERENCE"),
                                                    ISRTL = p.Field<bool>("ISRTL")
                                                }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public object DBQueryAPI(string qry)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Qry", qry));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DBQueryAPI", param);
                string json = JsonConvert.SerializeObject(dt);
                return json;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public int DefaultConfig_InsertUpdate(long Institution_Id, int Step)
        {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTIONID", Institution_Id));
            param.Add(new DataParameter("@STEP", Step));
            retid = ClsDataBase.Insert("[MYCORTEX].CREATEINSTITUTIONMASTER_SP", param, true);
            //await Task.Delay(1000);
            return retid;
        }
    }
}



