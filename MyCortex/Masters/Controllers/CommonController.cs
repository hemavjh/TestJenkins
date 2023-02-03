using MyCortex.Masters.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Masters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using Microsoft.Win32;
using System.Threading.Tasks;
using System.Data;
using System.Data.OleDb;
  
using MyCortex.User.Model;
using MyCortex.Repositories.Admin;
using MyCortex.Admin.Models;
using MyCortex.Utilities;
using System.Configuration;
using MyCortex.Login.Model;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    public class CommonController : ApiController
    {
        static readonly ICommonRepository repository = new CommonRepository();
        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        static readonly ILanguageSettingsRepository lngrepository = new LanguageSettingsRepository();
 
        IList<AppConfigurationModel> model;
        private Int64 InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);
        private string CCAppId;
        private string CCAPIKey;
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>      
        /// Getting Country to populate dropdown
        /// </summary>          
        /// <returns>Populated List of Country </returns>
        [Authorize]
        [HttpGet]
        public IList<CountryMasterModel> CountryList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<CountryMasterModel> model;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CountryList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<CountryMasterModel> CloneCountryList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<CountryMasterModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneCountryList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<StateMasterModel> StateList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<StateMasterModel> model;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.StateList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LocationMasterModel> GetLocationList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<LocationMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.GetLocationList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<StateMasterModel> Get_StateList(long CountryId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<StateMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Get_StateList(CountryId);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<StateMasterModel> Clone_Get_StateList(long CountryId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<StateMasterModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                    if (String.IsNullOrWhiteSpace(search_string))
                    {
                        search_string = "";
                    }
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Clone_Get_StateList(CountryId, search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LocationMasterModel> Get_LocationList(long CountryId, long StateId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<LocationMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Get_LocationList(CountryId, StateId);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LocationMasterModel>Clone_Get_LocationList(long CountryId, long StateId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<LocationMasterModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                    if (String.IsNullOrWhiteSpace(search_string))
                    {
                        search_string = "";
                    }
                }

                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Clone_Get_LocationList(CountryId, StateId, search_string);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Getting the list of country, state and city
        /// </summary>          
        /// <returns>list of country, state and city </returns>
        [Authorize]
        [HttpGet]
        public CountryStateLocationModel Get_CountryStateLocation_List()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            CountryStateLocationModel modellist = new CountryStateLocationModel();
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);

                modellist.CountryList = repository.CountryList();
              modellist.StateList = repository.StateList();
               modellist.LocationList = repository.GetLocationList();
               
                return modellist;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>      
        /// getting list of country, state and city for a country and state
        /// </summary>          
        /// <returns>country list, state list of a country, city list of a state</returns>
        /// 
        [Authorize]
        [HttpGet]
        public CountryStateLocationModel Get_CountryStateBasedLocation_List(long CountryId, long StateId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            CountryStateLocationModel modellist = new CountryStateLocationModel();
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);

                modellist.CountryList = repository.CountryList();               
                modellist.StateList = repository.Get_StateList(CountryId);
                modellist.LocationList = repository.Get_LocationList(CountryId, StateId);
                return modellist;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to insert/update a document/photo into local drive
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public List<string> AttachFile()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            HttpResponseMessage result = null;
            string filePath = "";
            string returnPath = "";
            var docfiles = new List<string>();
            try
            {
                //if (fileName != null)
                {
                    var httpRequest = HttpContext.Current.Request;
                    if (httpRequest.Files.Count > 0)
                    {
                        foreach (string file in httpRequest.Files)
                        {
                            var postedFile = httpRequest.Files[file];
                            string extension = ConvertMimeTypeToExtension(postedFile.ContentType);
                            var fileid = "{" + System.Guid.NewGuid() + "}"; //Storage Name
                            returnPath = "Documents/" + fileid + extension;
                            filePath = System.Web.HttpContext.Current.Server.MapPath("~/" + returnPath);
                            postedFile.SaveAs(filePath);
                            docfiles.Add(returnPath);
                        }
                        result = Request.CreateResponse(HttpStatusCode.OK, docfiles);
                    }
                    else
                    {
                        result = Request.CreateResponse(HttpStatusCode.BadRequest);
                    }
                }
            }
            catch(Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
            return docfiles;
        }
        private static System.Collections.Concurrent.ConcurrentDictionary<string, string> MimeTypeToExtension = new System.Collections.Concurrent.ConcurrentDictionary<string, string>();
        private static System.Collections.Concurrent.ConcurrentDictionary<string, string> ExtensionToMimeType = new System.Collections.Concurrent.ConcurrentDictionary<string, string>();
        public static string ConvertMimeTypeToExtension(string mimeType)
        {
            if (string.IsNullOrWhiteSpace(mimeType))
                throw new ArgumentNullException("mimeType");
            string key = string.Format(@"MIME\Database\Content Type\{0}", mimeType);
            string result;
            if (MimeTypeToExtension.TryGetValue(key, out result))
                return result;
            RegistryKey regKey;
            object value;
            regKey = Registry.ClassesRoot.OpenSubKey(key, false);
            value = regKey != null ? regKey.GetValue("Extension", null) : null;
            result = value != null ? value.ToString() : string.Empty;
            MimeTypeToExtension[key] = result;
            return result;
        }

        /// <summary>
        /// user group list
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>users group list of a institution</returns>
        [Authorize]
        [HttpGet]
        public IList<GroupTypeModel> GroupTypeList(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<GroupTypeModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.GroupTypeList(Institution_Id);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<GroupTypeModel> CloneGroupTypeList(long Institution_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<GroupTypeModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                    if (String.IsNullOrWhiteSpace(search_string))
                    {
                        search_string = "";
                    }
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Clone_GroupTypeList(Institution_Id, search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public HttpResponseMessage GenderAPIList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            GenderMasterReturnModel returnModel = new GenderMasterReturnModel();
            IList<GenderMasterModel> model = new List<GenderMasterModel>() ;
            try
            {
                model = GenderList();
                returnModel.Status = "True";
                returnModel.Message = "Gender Master";
                returnModel.GenderMaster = model;
                returnModel.ReturnFlag = 1;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, returnModel);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                returnModel.Status = "False";
                returnModel.Message = "Error in Gender Master";
                returnModel.GenderMaster = model;
                returnModel.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, returnModel);
            }
        }
        /// <summary>
        /// gender name list
        /// </summary>
        /// <returns>gender name list</returns>
        [AllowAnonymous]
        [HttpGet]
        public IList<GenderMasterModel> GenderList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<GenderMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.GenderList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<GenderMasterModel> CloneGenderList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<GenderMasterModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneGenderList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public HttpResponseMessage NationalityAPIList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            NationalityReturnModel returnModel = new NationalityReturnModel();
            IList<NationalityModel> model = new List<NationalityModel>();
            try
            {
                model = NationalityList();
                returnModel.Status = "True";
                returnModel.Message = "Nationality Master";
                returnModel.Nationality = model;
                returnModel.ReturnFlag = 1;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, returnModel);
                return response;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                returnModel.Status = "False";
                returnModel.Message = "Error in Nationality Master";
                returnModel.Nationality = model;
                returnModel.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, returnModel);
            }
        }
        /// <summary>
        /// nationality name list
        /// </summary>
        /// <returns>nationality name list</returns>
        [AllowAnonymous]
        [HttpGet]
        public IList<NationalityModel> NationalityList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<NationalityModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.NationalityList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<NationalityModel> CloneNationalityList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<NationalityModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneNationalityList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LanguageProficiencyModel> LanguageList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<LanguageProficiencyModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.LanguageList();
                return model;
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
        [AllowAnonymous]
        [HttpGet]
        public IList<MaritalStatusModel> MaritalStatusList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<MaritalStatusModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.MaritalStatusList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<MaritalStatusModel> CloneMaritalStatusList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<MaritalStatusModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneMaritalStatusList(search_string);
                return model;
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
        [AllowAnonymous]
        [HttpGet]
        public IList<EthinnicGroupModel> EthnicGroupList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EthinnicGroupModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.EthnicGroupList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<EthinnicGroupModel> CloneEthnicGroupList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EthinnicGroupModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneEthnicGroupList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<ChronicConditionModel> ChronicConditionList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ChronicConditionModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ChronicConditionList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<ChronicConditionModel> CloneChronicConditionList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ChronicConditionModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneChronicConditionList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<RelationshipMasterModel> RelationshipList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<RelationshipMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.RelationshipList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<RelationshipMasterModel> CloneRelationshipList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<RelationshipMasterModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneRelationshipList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<DietTypeModel> DietTypeList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DietTypeModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.DietTypeList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<ScheduleMasterModel> ScheduleList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ScheduleMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ScheduleList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<AlergySubstanceModel> AlergySubstanceList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<AlergySubstanceModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.AlergySubstanceList();
                return model;
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
        [AllowAnonymous]
        [HttpGet]
        public IList<BloodGroupModel> BloodGroupList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<BloodGroupModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.BloodGroupList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<BloodGroupModel> CloneBloodGroupList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<BloodGroupModel> model;
            try
            {
                string search_string = "";
                var queryString = this.Request.RequestUri.Query;
                if (!String.IsNullOrWhiteSpace(queryString))
                {
                    search_string = HttpUtility.ParseQueryString(
                                         queryString.Substring(1))["q"];
                }
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CloneBloodGroupList(search_string);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<TabDevicesList> Deviceslist()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabDevicesList> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Deviceslist();
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        [Authorize]
        [HttpGet]
        public IList<TabUserList> UserList(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<TabUserList> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.UserList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        [Authorize]
        [HttpGet]
        public TabUserList USERPINDETAILS(long ID)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            TabUserList model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.USERPINDETAILS(ID);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to get affiliation name list
        /// </summary>
        /// <returns>affiliation name list</returns>
        [Authorize]
        [HttpGet]
        public IList<ddItemList> InstitutionNameList(long status)
        {
            IList<ddItemList> model;
            model = repository.InstitutionNameList(status);
            return model;
        }

        /// <summary>
        /// to get option type name list
        /// </summary>
        /// <returns>option type name list</returns>
        [Authorize]
        [HttpGet]
        public IList<OptionTypeModel> OptionTypeList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<OptionTypeModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.OptionTypeList();
                return model;
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
        [HttpGet]
        public IList<AppConfigurationModel> AppConfigurationDetails(long Institution_Id, string ConfigCode="")
        {
            IList<AppConfigurationModel> model;
            model = repository.AppConfigurationDetails(ConfigCode, Institution_Id);
            return model;
        }
        /// <summary>      
        /// to get password policy configuration of a institution
        /// </summary>          
        /// <returns>password policy configuration of a institution</returns>
        //[Authorize]
        [HttpGet]
        public PasswordPolicyModel PasswordPolicyDetails_View(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            PasswordPolicyModel modellist = new PasswordPolicyModel();
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                modellist = pwdrepository.PasswordPolicy_View(Institution_Id);
                return modellist;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// to insert/update a password policy
        /// </summary>
        /// <param name="obj">password policy details with institution id</param>
        /// <returns>inserted/updated password policy</returns>
        [Authorize]
        [HttpPost]
        public HttpResponseMessage PasswordPolicy_InsertUpdate([FromBody] PasswordPolicyModel obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<PasswordPolicyModel> ModelData = new List<PasswordPolicyModel>();

            PasswordPolicyReturnModel model = new PasswordPolicyReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PasswordData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            model.ReturnFlag = 1;
            model.ReturnFlag = 2;
            try
            {
                ModelData = pwdrepository.PasswordPolicy_InsertUpdate(obj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Password created successfully";
                    model.ReturnFlag = 1;

                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Password updated Successfully";
                    model.ReturnFlag = 2;

                }
                model.PasswordData = ModelData;
                model.Message = messagestr;// "Password data created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;

            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Password Policy";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.PasswordData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


        /// <summary>      
        /// to get password policy configuration of a institution
        /// </summary>          
        /// <returns>password policy configuration of a institution</returns>
        //[Authorize]
        [HttpGet]
        public PasswordPolicyModel PasswordPolicy_View(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            PasswordPolicyModel modellist = new PasswordPolicyModel();
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                modellist = pwdrepository.PasswordPolicy_View(Institution_Id);
                return modellist;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        [HttpGet]
        public string getCometchatAppId()
        {
            model = repository.AppConfigurationDetails("COMETCHAT_APPID", InstitutionId);
            if (model.Count > 0)
            {
                CCAppId = model[0].ConfigValue;
            }
            model = repository.AppConfigurationDetails("COMETCHAT_APPKEY", InstitutionId);
            if (model.Count > 0)
            {
                CCAPIKey = model[0].ConfigValue;
            }
            return CCAppId + "," + CCAPIKey;
        }

        /// <summary>      
        /// Encrypt/Decrypt page - get encrypted/decrypted value of the input value
        /// </summary>          
        /// <returns>encrypted/decrypted value</returns>
        [Authorize]
        [HttpPost]
        public HttpResponseMessage EncryptDecrypt(LoginModel obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            string ResultValue = "";
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                DataEncryption EncryptPassword = new DataEncryption();
                DataEncryption Decrypt = new DataEncryption();
                if (obj.InputType == 1)
                {
                    ResultValue = EncryptPassword.Encrypt(obj.DecryptInput);
                }
                else if (obj.InputType == 2)
                {
                    ResultValue = EncryptPassword.Decrypt(obj.DecryptInput);
                }
                else
                {
                    ResultValue = "";
                }
                return Request.CreateResponse(HttpStatusCode.OK, ResultValue);
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "");
            }

        }

        [HttpGet]
        public IList<UnitGroupTypeModel> getUnitGroupType()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<UnitGroupTypeModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.UnitGroupTypeList();
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<LanguageMasterModel> getInstitutionLanguages(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<LanguageMasterModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.InstitutionLanguages(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<GatewayMaster> getInstitutionPayment(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<GatewayMaster> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.InstitutionPayments(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<GatewayMaster> getInstitutionInsurance(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<GatewayMaster> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.InstitutionInsurances(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [Authorize]
        [HttpGet]
        public IList<GatewayInsuranceList> InstitutionInsurance()
        {
            IList<GatewayInsuranceList> model;
            model = repository.InstitutionInsurance();
            return model;
        }
        [Authorize]
        [HttpGet]
        public IList<GatewayInsuranceList> InstitutionPayment()
        {
            IList<GatewayInsuranceList> model;
            model = repository.InstitutionPayment();
            return model;
        }

        [Authorize]
        [HttpGet]
        public AppointmentTimeZone getTimeZoneMasterId(string name)
        {
            AppointmentTimeZone model;
            model = repository.getTimeZoneMasterId(name);
            return model;
        }

        /// <summary>      
        /// to get password policy configuration of a institution
        /// </summary>          
        /// <returns>password policy configuration of a institution</returns>
        [Authorize]
        [HttpGet]
        public HttpResponseMessage MobileAppSettings(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            MobileSettingsModel model = new MobileSettingsModel();
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model.Status = "True";
                model.Message = "Success";
                model.ReturnFlag = 1;
                model.PasswordData = pwdrepository.PasswordPolicy_View(Institution_Id);
                model.Languages = lngrepository.InstituteLanguage_List(Institution_Id);
                //model.LanguageText = lngrepository.LanguageKeyValue_List(Language_Id, Institution_Id);
                //model.AppConfigurations = repository.AppConfigurationDetails(string.Empty, Institution_Id);
                return Request.CreateResponse(HttpStatusCode.OK, model); 
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error occured";
                model.ReturnFlag = 0;
                model.PasswordData = null;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpGet]
        public HttpResponseMessage DBQueryAPI(string qry)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            MobileSettingsModel model = new MobileSettingsModel();
            try
            {
                var result = repository.DBQueryAPI(qry);
                return Request.CreateResponse(HttpStatusCode.OK, result); ;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error occured";
                model.ReturnFlag = 0;
                model.PasswordData = null;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [Authorize]
        [HttpPost]
        public HttpResponseMessage DefaultConfig_InsertUpdate(int Step,[FromBody]long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            PasswordPolicyReturnModel model = new PasswordPolicyReturnModel();
            if (Institution_Id <= 0)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                //model.PasswordData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            try
            {
                model.ReturnFlag = repository.DefaultConfig_InsertUpdate(Institution_Id, Step);
                //ModelData = pwdrepository.PasswordPolicy_InsertUpdate(obj);
                //if (ModelData.Any(item => item.flag == 1) == true)
                //{
                //    messagestr = "Password created successfully";
                //    model.ReturnFlag = 1;

                //}
                //else if (ModelData.Any(item => item.flag == 2) == true)
                //{
                //    messagestr = "Password updated Successfully";
                //    model.ReturnFlag = 2;

                //}
                //model.PasswordData = ModelData;
                model.Message = "";// "Password data created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;

            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Password Policy";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                //model.PasswordData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        [CheckSessionOutFilter]
        public MyAppointmentSettingsModel getMyAppointmentSettings(long Institution_Id, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            MyAppointmentSettingsModel ModelData = new MyAppointmentSettingsModel();
            MyAppointmentSettingsModel model = new MyAppointmentSettingsModel();
            try
            {
                model = repository.getMyAppointmentSettings(Institution_Id);
                if(model == null)
                {
                    ModelData.flag = 2;
                    ModelData.Status = "False";
                } else
                {
                    ModelData = model;
                    ModelData.flag = 1;
                    ModelData.Status = "True";
                }
                return ModelData;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return ModelData;
            }
        }

        [HttpGet]
        [Authorize]
        [CheckSessionOutFilter]
        public AppConfigurationsModel getAppConfigurations(long Institution_Id, string ConfigCode = "")
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            AppConfigurationsModel ModelData = new AppConfigurationsModel();
            MyAppointmentSettingsModel AppointmentSettingsModel = new MyAppointmentSettingsModel();
            IList<AppConfigurationModel> AppConfigurationModel;
            try
            {
                AppointmentSettingsModel = repository.getMyAppointmentSettings(Institution_Id);
                AppConfigurationModel= repository.AppConfigurationDetails(ConfigCode, Institution_Id);

                ModelData.AppointmentSettings = AppointmentSettingsModel;
                ModelData.AppConfigurations = AppConfigurationModel;
                ModelData.flag = 1;
                ModelData.Status = "True";
                return ModelData;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return ModelData;
            }
        }
    }
}
