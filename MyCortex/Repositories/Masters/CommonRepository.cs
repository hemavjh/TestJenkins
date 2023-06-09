﻿
using MyCortex.Masters.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
  
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

 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Getting Country to populate dropdown
        /// </summary>          
        /// <returns>Populated List of Country </returns>
        public IList<CountryMasterModel> CloneCountryList(string searchstring)
        {
            List<DataParameter> param = new List<DataParameter>();
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_COUNTRYMASTER_SP_COUNTRYNAME", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Getting State to populate dropdown
        /// </summary>          
        /// <returns>List of State </returns>
        public IList<StateMasterModel> StateList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
          
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>      
        /// Getting State list of a country to populate dropdown
        /// </summary>          
        /// <returns>List of State of a country</returns>
        public IList<StateMasterModel> Get_StateList(long CountryId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@COUNTRYID", CountryId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Getting State list of a country to populate dropdown
        /// </summary>          
        /// <returns>List of State of a country</returns>
        public IList<StateMasterModel> Clone_Get_StateList(long CountryId, string searchstring)
        {
            string countryId = CountryId.ToString();
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@COUNTRYID", countryId));
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_COUNTRYASEDSTATE_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>      
        /// Getting city list of a state to populate dropdown
        /// </summary>          
        /// <returns>List of city of a state</returns>
        public IList<LocationMasterModel> Get_LocationList(long CountryId, long StateId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@COUNTRYID", CountryId));
            param.Add(new DataParameter("@STATEID", StateId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Getting city list of a state to populate dropdown
        /// </summary>          
        /// <returns>List of city of a state</returns>
        public IList<LocationMasterModel> Clone_Get_LocationList(long CountryId, long StateId, string searchstring)
        {
            string countryId = CountryId.ToString();
            string stateId = StateId.ToString();
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@COUNTRYID", countryId));
                param.Add(new DataParameter("@STATEID", stateId));
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_STATEBASEDLOCATION_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// user group list
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>users group list of a institution</returns>
        public IList<GroupTypeModel> Clone_GroupTypeList(long Institution_Id, string searchstring)
        {
            string institution_Id = Institution_Id.ToString();
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@INSTITUTION_ID", institution_Id));
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_GROUPTYPE_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// gender name list
        /// </summary>
        /// <returns>gender name list</returns>
        public IList<GenderMasterModel> GenderList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// gender name list
        /// </summary>
        /// <returns>gender name list</returns>
        public IList<GenderMasterModel> CloneGenderList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_GENDER_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// nationality name list
        /// </summary>
        /// <returns>nationality name list</returns>
        public IList<NationalityModel> NationalityList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// nationality name list
        /// </summary>
        /// <returns>nationality name list</returns>
        public IList<NationalityModel> CloneNationalityList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_NATIONALITY_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// language name list
        /// </summary>
        /// <returns>language name list</returns>
        public IList<LanguageProficiencyModel> LanguageList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// marital status name list
        /// </summary>
        /// <returns>marital status name list</returns>
        public IList<MaritalStatusModel> MaritalStatusList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// marital status name list
        /// </summary>
        /// <returns>marital status name list</returns>
        public IList<MaritalStatusModel> CloneMaritalStatusList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_MARITALSTATUS_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Ethnic Group status name list
        /// </summary>
        /// <returns>Ethnic Group name list</returns>
        public IList<EthinnicGroupModel> EthnicGroupList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Ethnic Group status name list
        /// </summary>
        /// <returns>Ethnic Group name list</returns>
        public IList<EthinnicGroupModel> CloneEthnicGroupList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_ETHINICGROUP_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Chronic condition status name list
        /// </summary>
        /// <returns>chronic condition name list</returns>
        public IList<ChronicConditionModel> ChronicConditionList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Chronic condition status name list
        /// </summary>
        /// <returns>chronic condition name list</returns>
        public IList<ChronicConditionModel> CloneChronicConditionList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_CHRONICCONDITION_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// relation ship name list
        /// </summary>
        /// <returns>relation ship name list</returns>
        public IList<RelationshipMasterModel> RelationshipList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// relation ship name list
        /// </summary>
        /// <returns>relation ship name list</returns>
        public IList<RelationshipMasterModel> CloneRelationshipList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_RELATIONSHIPMASTER_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// diet type name list
        /// </summary>
        /// <returns> diet type name list</returns>
        public IList<DietTypeModel> DietTypeList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// schedule name list
        /// </summary>
        /// <returns></returns>
        public IList<ScheduleMasterModel> ScheduleList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// allergy substance type list
        /// </summary>
        /// <returns></returns>
        public IList<AlergySubstanceModel> AlergySubstanceList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// blood group name list
        /// </summary>
        /// <returns></returns>
        public IList<BloodGroupModel> BloodGroupList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// blood group name list
        /// </summary>
        /// <returns></returns>
        public IList<BloodGroupModel> CloneBloodGroupList(string searchstring)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                param.Add(new DataParameter("@SearchString", searchstring));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLONE_BLOODGROUP_SP_LIST", param);
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// blood group name list
        /// </summary>
        /// <returns></returns>
        public IList<TabDevicesList> Deviceslist()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[MyHomeDeviceLists]");
                List<TabDevicesList> lst = (from p in dt.AsEnumerable()
                                             select new TabDevicesList()
                                             {
                                                 ID = p.Field<long>("ID"),
                                                 DeviceName = p.Field<string>("DeviceName"),
                                                 IsActive = p.Field<bool>("ISACTIVE")
                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<TabUserList> UserList(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>(); 
            param.Add(new DataParameter("@INSTITUTIONID", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTYPE_TAB_DETAILS]", param);
                List<TabUserList> lst = (from p in dt.AsEnumerable()
                                         select new TabUserList()
                                         {
                                             ID = p.Field<long>("ID"),
                                             FullName = p.Field<string>("FULLNAME"),
                                             PIN = p.Field<string>("PIN"),
                                             IsActive = Convert.ToBoolean(p.Field<int>("ISACTIVE"))
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public TabUserList USERPINDETAILS(long ID)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", ID));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTYPE_TABPIN_DETAILS]", param);
            TabUserList list = (from p in dt.AsEnumerable()
                                      select new TabUserList()
                                      {
                                          ID = p.Field<long>("ID"),
                                          FullName = p.Field<string>("USERNAME"),
                                          PIN = p.Field<string>("PIN"),
                                          IsActive = Convert.ToBoolean(p.Field<int>("ISACTIVE"))

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
                                         Name = p.Field<string>("INSTITUTION_NAME"),
                                         Country_ISO3 = p.Field<string>("COUNTRY_ISO3"),
                                         Country_ISO2 = p.Field<string>("COUNTRY_ISO2"),
                                         CountryCode = p.Field<string>("COUNTRY_CODE"),
                                         Timezone = p.Field<string>("TIMEZONE")
                                     }).ToList();
            return list;
        }
        /// <summary>
        /// to get option type name list
        /// </summary>
        /// <returns>option type name list</returns>
        public IList<OptionTypeModel> OptionTypeList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();

            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<LanguageMasterModel> InstitutionLanguages(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<GatewayMaster> InstitutionPayments(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ISUBSCRIPTIONPAYMENT_SP_LIST]", param);
                List<GatewayMaster> lst = (from p in dt.AsEnumerable()
                                                 select new GatewayMaster()
                                                 {
                                                     Id = p.Field<long>("ID"),
                                                     PaymentGatewayName = p.Field<string>("NAME"),
                                                     IsActive = p.Field<int>("ISACTIVE"),
                                                     DefaultPaymentGatewayId = p.Field<long>("Preference")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<GatewayMaster> InstitutionInsurances(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ISUBSCRIPTIONINSURANCE_SP_LIST]", param);
                List<GatewayMaster> lst = (from p in dt.AsEnumerable()
                                                  select new GatewayMaster()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      PaymentGatewayName = p.Field<string>("NAME"),
                                                      IsActive = p.Field<int>("ISACTIVE"),
                                                      DefaultPaymentGatewayId = p.Field<long>("Preference")
                                                  }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<GatewayInsuranceList> InstitutionInsurance()
        { 
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTIONINSURANCE_SP_LIST]");
            List<GatewayInsuranceList> list = (from p in dt.AsEnumerable()
                                               select new GatewayInsuranceList()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   PaymentName = p.Field<string>("PAYMENTNAME"),
                                                   GateWayType = p.Field<int>("GATEWAYTYPE"),
                                                   IsActive = p.Field<int>("ISACTIVE")
                                               }).ToList();
            return list;
        }
        public IList<GatewayInsuranceList> InstitutionPayment()
        {
            List<DataParameter> param = new List<DataParameter>();
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTIONPAYMENT_SP_LIST]");
            List<GatewayInsuranceList> list = (from p in dt.AsEnumerable()
                                               select new GatewayInsuranceList()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   PaymentName = p.Field<string>("PAYMENTNAME"),
                                                   GateWayType = p.Field<int>("GATEWAYTYPE"),
                                                   IsActive = p.Field<int>("ISACTIVE")
                                               }).ToList();
            return list;
        }

        public object DBQueryAPI(string qry)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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

        public AppointmentTimeZone getTimeZoneMasterId(string Name)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@NAME", Name));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLTIMEZONEMATCHING]",param);
            AppointmentTimeZone list = (from p in dt.AsEnumerable()
                                               select new AppointmentTimeZone()
                                               {
                                                   TimeZoneId = p.Field<long>("TIMEZONEID"),
                                                   TimeZoneDisplayName = p.Field<string>("DISPLAYNAME")
                                               }).FirstOrDefault();
            return list;
        }

        public MyAppointmentSettingsModel getMyAppointmentSettings(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[MYAPPOINTMENTSSETTING_SP_GET]", param);
            MyAppointmentSettingsModel list = (from p in dt.AsEnumerable()
                                               select new MyAppointmentSettingsModel()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                   NewAppointmentDuration = p.Field<int>("NEWAPPOINTMENT_DURATION"),
                                                   FollowupDuration = p.Field<int>("FOLLOWUP_DURATION"),
                                                   Interval = p.Field<int>("APPOINTMENT_INTERVAL"),
                                                   MaxScheduleDays = p.Field<int>("MAX_SCHEDULE_DAYS"),
                                                   IsDirectAppointment = p.Field<bool>("IS_DIRECTAPPOINTMENT"),
                                                   IsCC = p.Field<bool>("IS_CC"),
                                                   IsCG = p.Field<bool>("IS_CG"),
                                                   IsCL = p.Field<bool>("IS_CL"),
                                                   IsSC = p.Field<bool>("IS_SC"),
                                                   IsPatient = p.Field<bool>("IS_PATIENT"),
                                                   MinRescheduleDays = p.Field<int>("MIN_RESCHEDULE_DAYS"),
                                                   MinRescheduleMinutes = p.Field<int>("MIN_RESCHEDULE_MINUTES"),
                                                   IsAutoReschedule = p.Field<bool>("IS_AUTORESCHEDULE"),
                                                   TimeZoneId = p.Field<int>("TIMEZONE_ID"),
                                                   TimeZoneName = p.Field<string>("TIMEZONE_NAME"),
                                                   Appointment_Module = p.Field<int>("APPOINTMENT_MODULE_ID"),
                                                   DefaultPaymentId = p.Field<long>("DEFAULTPAYMENT_ID"),
                                                   DefaultInsuranceId = p.Field<long>("DEFAULTINSURANCE_ID"),
                                                   Telephonic_Settings = p.Field<int>("TELEPHONIC_SETTINGS"),
                                               }).FirstOrDefault();
            param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            dt = ClsDataBase.GetDataTable("[MYCORTEX].[MYAPPOINTMENTSGATEWAYSETTING_SP_GET]", param);
            if (dt.Rows.Count > 0) {
                list.GatewayDetails = (from p in dt.AsEnumerable()
                                       select new MyAppointmentGatewayModel()
                                       {
                                           GatewayId = p.Field<long>("PAYMENT_ID"),
                                           GatewayName = p.Field<string>("PAYMENTNAME"),
                                           GatewayType = p.Field<int>("GATEWAYTYPE"),
                                           GatewayKey = p.Field<string>("GATEWAY_KEY"),
                                           GatewayValue = p.Field<string>("GATEWAY_VALUE"),
                                       }).ToList();
            }
            return list;
        }
    }
}



