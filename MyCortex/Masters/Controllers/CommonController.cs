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
using log4net;
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
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        IList<AppConfigurationModel> model;
        private Int64 InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);
        private string CCAppId;
        private string CCAPIKey;

        /// <summary>      
        /// Getting Country to populate dropdown
        /// </summary>          
        /// <returns>Populated List of Country </returns>
        [Authorize]
        [HttpGet]
        public IList<CountryMasterModel> CountryList()
        {
            IList<CountryMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.CountryList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<StateMasterModel> StateList()
        {
            IList<StateMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.StateList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LocationMasterModel> GetLocationList()
        {
            IList<LocationMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GetLocationList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<StateMasterModel> Get_StateList(long CountryId)
        {
            IList<StateMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Get_StateList(CountryId);
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LocationMasterModel> Get_LocationList(long CountryId, long StateId)
        {
            IList<LocationMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Get_LocationList(CountryId, StateId);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            CountryStateLocationModel modellist = new CountryStateLocationModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");

                modellist.CountryList = repository.CountryList();
              modellist.StateList = repository.StateList();
               modellist.LocationList = repository.GetLocationList();
               
                return modellist;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            CountryStateLocationModel modellist = new CountryStateLocationModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");

                modellist.CountryList = repository.CountryList();               
                modellist.StateList = repository.Get_StateList(CountryId);
                modellist.LocationList = repository.Get_LocationList(CountryId, StateId);
                return modellist;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
            IList<GroupTypeModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GroupTypeList(Institution_Id);
                return model;
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
        [Authorize]
        [HttpGet]
        public HttpResponseMessage GenderAPIList()
        {
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
            IList<GenderMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GenderList();
                return model;
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
        [Authorize]
        [HttpGet]
        public HttpResponseMessage NationalityAPIList()
        {
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
            IList<NationalityModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.NationalityList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<LanguageProficiencyModel> LanguageList()
        {
            IList<LanguageProficiencyModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.LanguageList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<MaritalStatusModel> MaritalStatusList()
        {
            IList<MaritalStatusModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.MaritalStatusList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<EthinnicGroupModel> EthnicGroupList()
        {
            IList<EthinnicGroupModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.EthnicGroupList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<ChronicConditionModel> ChronicConditionList()
        {
            IList<ChronicConditionModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ChronicConditionList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<RelationshipMasterModel> RelationshipList()
        {
            IList<RelationshipMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.RelationshipList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<DietTypeModel> DietTypeList()
        {
            IList<DietTypeModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DietTypeList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<ScheduleMasterModel> ScheduleList()
        {
            IList<ScheduleMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ScheduleList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<AlergySubstanceModel> AlergySubstanceList()
        {
            IList<AlergySubstanceModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AlergySubstanceList();
                return model;
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
        [Authorize]
        [HttpGet]
        public IList<BloodGroupModel> BloodGroupList()
        {
            IList<BloodGroupModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.BloodGroupList();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to get affiliation name list
        /// </summary>
        /// <returns>affiliation name list</returns>
        [Authorize]
        [HttpGet]
        public IList<ddItemList> InstitutionNameList()
        {
            IList<ddItemList> model;
            model = repository.InstitutionNameList();
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
            IList<OptionTypeModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.OptionTypeList();
                return model;
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
        [HttpGet]
        public IList<AppConfigurationModel> AppConfigurationDetails(string ConfigCode, long Institution_Id)
        {
            IList<AppConfigurationModel> model;
            model = repository.AppConfigurationDetails(ConfigCode, Institution_Id);
            return model;
        }
        /// <summary>      
        /// to get password policy configuration of a institution
        /// </summary>          
        /// <returns>password policy configuration of a institution</returns>
        [Authorize]
        [HttpGet]
        public PasswordPolicyModel PasswordPolicyDetails_View(long Institution_Id)
        {
            PasswordPolicyModel modellist = new PasswordPolicyModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                modellist = pwdrepository.PasswordPolicy_View(Institution_Id);
                return modellist;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
        [Authorize]
        [HttpGet]
        public PasswordPolicyModel PasswordPolicy_View(long Institution_Id)
        {
            PasswordPolicyModel modellist = new PasswordPolicyModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                modellist = pwdrepository.PasswordPolicy_View(Institution_Id);
                return modellist;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            string ResultValue = "";
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
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
                _logger.Error(ex.Message, ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "");
            }

        }

        [HttpGet]
        public IList<UnitGroupTypeModel> getUnitGroupType()
        {
            IList<UnitGroupTypeModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.UnitGroupTypeList();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

    }
}
