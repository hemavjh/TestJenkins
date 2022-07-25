using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Admin
{
    public class InstitutionSubscriptionRepository : IInstitutionSubscriptionRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public InstitutionSubscriptionRepository()
        {
            db = new ClsDataBase();

        }

        /// <summary>
        /// Institution subscription details of a institution subscription
        /// </summary>
        /// <param name="Id">Id of the Institution subscription</param>
        /// <returns>Institution Subscription details object</returns>
        public InstitutionModel InstitutionDetailList(long? Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_INSTITUTIONDETAILS", param);
            InstitutionModel list = (from p in dt.AsEnumerable()
                                     select new InstitutionModel()
                                     {
                                         Id = p.Field<long>("Id"),
                                         Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                         Email = p.IsNull("EMAILID") ? "" : p.Field<string>("EMAILID"),
                                         Institution_Address1 = p.Field<string>("ADDRESS1"),
                                         Institution_Address2 = p.Field<string>("ADDRESS2"),
                                         Institution_Address3 = p.Field<string>("ADDRESS3"),
                                         ZipCode = p.Field<string>("POSTEL_ZIPCODE"),
                                         CountryId = p.Field<long>("COUNTRYID"),
                                         StateId = p.Field<long>("STATEID"),
                                         CityId = p.Field<long>("CITYID"),
                                         CountryName = p.Field<string>("COUNTRY_NAME"),
                                         StateName = p.Field<string>("STATENAME"),
                                         CityName = p.Field<string>("LOCATIONNAME"),
                                         //CountryISO2= p.Field<string>("COUNTRY_ISO2"),
                                     }).FirstOrDefault();
            return list;
        }

        /// <summary>
        /// To insert/update a institution subscription details
        /// </summary>
        /// <param name="insobj"></param>
        /// <returns></returns>
        public IList<InstitutionSubscriptionModel> InstitutionSubscription_AddEdit(Guid Login_Session_Id, InstitutionSubscriptionModel obj)
        {

            long InsSubId;
            long InsSubModId;
            var LoginSession = Login_Session_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@NOOF_HEALTHCHAR", obj.Health_Care_Professionals));
            param.Add(new DataParameter("@NOOF_PATIENT", obj.No_Of_Patients));
            param.Add(new DataParameter("@NOOF_HIVE_USER", obj.No_Of_HiveUsers));
            param.Add(new DataParameter("@NOOF_HIVECHART_USER", obj.No_Of_HiveChartUsers));
            param.Add(new DataParameter("@NOOF_HIVE", obj.No_Of_Hive));
            param.Add(new DataParameter("@NOOF_HIVECHART", obj.No_Of_HiveChart));
            //param.Add(new DataParameter("@NOOF_HIVE_DEVICES", obj.No_Of_HiveDevices));
            //param.Add(new DataParameter("@NOOF_HIVECHART_DEVICES", obj.No_Of_HiveChartDevices));
            param.Add(new DataParameter("@CONTRACT_PERIODFROM", obj.Contract_PeriodFrom));
            param.Add(new DataParameter("@CONTRACT_PERIODTO", obj.Contract_PeriodTo));
            param.Add(new DataParameter("@SUBSCRIPTION_TYPE", obj.Subscription_Type));
            param.Add(new DataParameter("@TELEPHONE_USER", obj.TelePhone_User));
            param.Add(new DataParameter("@SESSION_ID", LoginSession));
            param.Add(new DataParameter("@Created_by", HttpContext.Current.Session["UserId"]));
            param.Add(new DataParameter("@TIMEZONE_ID", obj.TimeZone_ID));
            param.Add(new DataParameter("@APPOINTMENT_MODULE_ID", obj.Appointment_Module_Id));
            param.Add(new DataParameter("@CHRONICCC", obj.ChronicCc));
            param.Add(new DataParameter("@CHRONICCG", obj.ChronicCg));
            param.Add(new DataParameter("@CHRONICCL", obj.ChronicCl));
            param.Add(new DataParameter("@CHRONICSC", obj.ChronicSc));
            {
                // InsSubId = ClsDataBase.Insert("INS_SUb_EX", param, true);
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SUBSCRIPTION_SP_INSERTUPDATE", param);

                DataRow dr = dt.Rows[0];
                var InsertId = (dr["Id"].ToString());
                IList<InstitutionSubscriptionModel> INS = (from p in dt.AsEnumerable()
                                                           select
                                                           new InstitutionSubscriptionModel()
                                                           {
                                                               Id = p.Field<long>("Id"),
                                                               Institution_Id = p.Field<long>("Institution_Id"),
                                                               Contract_PeriodFrom = p.Field<DateTime>("CONTRACT_PERIODFROM"),
                                                               Health_Care_Professionals = p.Field<int>("NOOF_HEALTHCARE"),
                                                               No_Of_Patients = p.Field<int>("NOOF_PATIENT"),
                                                               No_Of_Hive = p.Field<int>("NOOF_HIVE"),
                                                               No_Of_HiveChart = p.Field<int>("NOOF_HIVECHART"),
                                                               No_Of_HiveUsers = p.Field<int>("NOOF_HIVE_USER"),
                                                               No_Of_HiveChartUsers = p.Field<int>("NOOF_HIVECHART_USER"),
                                                               //No_Of_HiveDevices = p.Field<int>("NOOF_HIVE_DEVICES"),
                                                               //No_Of_HiveChartDevices = p.Field<int>("NOOF_HIVECHART_DEVICES"),
                                                               Contract_PeriodTo = p.Field<DateTime>("CONTRACT_PERIODTO"),
                                                               Subscription_Type = p.Field<int>("SUBSCRIPTION_TYPE"),
                                                               TelePhone_User=p.Field<int>("TELEPHONE_USER"),
                                                               TimeZone_ID = p.Field<int>("TIMEZONE_ID"),
                                                               flag = p.Field<int>("flag"),
                                                               Appointment_Module_Id = p.Field<int>("APPOINTMENT_MODULE_ID")
                                                               //SubscriptionId = p.Field<int>("SubScription_Id"),
                                                           }).ToList();

                foreach (ModuleMasterModel item in obj.Module_List)
                {
                    List<DataParameter> param1 = new List<DataParameter>();
                    param1.Add(new DataParameter("@INSTITUTIONSUBSCRIPTION_ID", InsertId));
                    param1.Add(new DataParameter("@MODULE_ID", item.Id));
                    param1.Add(new DataParameter("@Created_by", HttpContext.Current.Session["UserId"]));
                    var objExist = obj.Institution_Modules.Where(ChildItem => ChildItem.ModuleId == item.Id);

                    if (objExist.ToList().Count > 0)
                        //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                        param1.Add(new DataParameter("@MODULE_SELECTED", "1"));
                    else
                        param1.Add(new DataParameter("@MODULE_SELECTED", "0"));

                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].INSTITUTION_SUBSCRIPTION_MODULE_SP_INSERTUPDATE", param1, true);
                }

                foreach (LanguageMasterModel item in obj.Language_List)
                {
                    List<DataParameter> param1 = new List<DataParameter>();
                    param1.Add(new DataParameter("@INSTITUTIONSUBSCRIPTION_ID", InsertId));
                    param1.Add(new DataParameter("@LANGUAGE_ID", item.Id));
                    param1.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                    var objExist = obj.Institution_Languages.Where(ChildItem => ChildItem.LanguageId == item.Id);

                    if (objExist.ToList().Count > 0)
                        //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                        param1.Add(new DataParameter("@LANGUAGE_SELECTED", "1"));
                    else
                        param1.Add(new DataParameter("@LANGUAGE_SELECTED", "0"));

                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].INSTITUTION_SUBSCRIPTION_LANGUAGE_SP_INSERTUPDATE", param1, true);
                }
                foreach (GatewayMasterModel item in obj.Payment_List)
                {
                    List<DataParameter> param1 = new List<DataParameter>();
                    param1.Add(new DataParameter("@INSTITUTIONSUBSCRIPTION_ID", InsertId));
                    param1.Add(new DataParameter("@PAYMENT_ID", item.Id));
                    param1.Add(new DataParameter("@GATEWAYTYPE", item.GateWayType));
                    var objExist = obj.Payment_Module_Id.Where(ChildItem => ChildItem.Id == item.Id);

                    if (objExist.ToList().Count > 0)
                        param1.Add(new DataParameter("@PAYMENT_SELECTED", "1"));
                    else
                        param1.Add(new DataParameter("@PAYMENT_SELECTED", "0"));

                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].[INSTITUTION_SUBSCRIPTION_PAYMENT_SP_INSERTUPDATE]", param1, true);
                }
                foreach (Institution_Device_list item in obj.Device_list)
                {
                    List<DataParameter> param1 = new List<DataParameter>();
                    param1.Add(new DataParameter("@INSTITUTIONSUBSCRIPTION_ID", InsertId));
                    param1.Add(new DataParameter("@DEVICE_ID", item.Id));
                    param1.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                    var objExist = obj.Institution_DeviceName_list.Where(ChildItem => ChildItem.DeviceId == item.Id);

                    if (objExist.ToList().Count > 0)
                        param1.Add(new DataParameter("@DEVICE_SELECTED", "1"));
                    else
                        param1.Add(new DataParameter("@DEVICE_SELECTED", "0"));

                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].[INSTITUTION_SUBSCRIPTION_DEVICENAME_SP_INSERTUPDATE]", param1, true);
                }
                return INS;
            }
            
        }

        /// <summary>t
        /// to get the Module master list 
        /// </summary>
        /// <returns>module module list object</returns>
        public IList<ModuleMasterModel> ModuleNameList()
        {
            List<DataParameter> param = new List<DataParameter>();

             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].MODULEMASTER_SP_MODULENAME");
                List<ModuleMasterModel> lst = (from p in dt.AsEnumerable()
                                               select new ModuleMasterModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   ModuleName = p.Field<string>("MODULENAME"),
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

        public IList<LanguageMasterModel> LanguageNameList()
        {
            List<DataParameter> param = new List<DataParameter>();
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].LANGUAGEMASTER_SP_LANGUAGENAME");
                List<LanguageMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new LanguageMasterModel()
                                                 {
                                                     Id = p.Field<long>("ID"),
                                                     LanguageName = p.Field<string>("LANGUAGE_NAME"),
                                                     IsActive = p.Field<bool>("ISACTIVE")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                //_MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<TelePhoningMasterModel> TelephoningNameList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TELEPHONINGMASTER_SP_NAME]");
                List<TelePhoningMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new TelePhoningMasterModel()
                                                 {
                                                     Id = p.Field<long>("Id"),
                                                     Name = p.Field<string>("Name"),
                                                     IsActive = p.Field<int>("ISACTIVE")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                //_MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<Institution_Device_list> Get_DeviceNameList()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@ISACTIVE", IsActive));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICE_SP_DEVICENAME]", param);
                List<Institution_Device_list> lst = (from p in dt.AsEnumerable()
                                             select new Institution_Device_list()
                                             {
                                                 Id = p.Field<long>("ID"),
                                                 DeviceName = p.Field<string>("NAME"),
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
        /// <summary>
        /// details of a selected Institution Subscription
        /// </summary>
        /// <param name="Id">Id of a Institution Subscription</param>
        /// <returns>Subscription details object</returns>
        public IList<InstitutionSubscriptionModuleModels> InstitutionSubscriptionModuleDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SUBSCRIPTIONMODULE_SP_VIEW", param);
            List<InstitutionSubscriptionModuleModels> INS = (from p in dt.AsEnumerable()
                                                             select new InstitutionSubscriptionModuleModels()
                                                             {
                                                                 Id = p.Field<long>("Id"),
                                                                 ChildId = p.Field<long>("MId"),
                                                                 ModuleId = p.Field<long>("MODULE_ID"),
                                                                 ModuleName = p.Field<string>("ModuleName")
                                                             }).ToList();
            return INS;
        }
        public IList<Institution_Device_list> InstitutionSubscriptionDeviceDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTION_SUBSCRIPTIONDEVICE_SP_VIEW]", param);
            List<Institution_Device_list> INS = (from p in dt.AsEnumerable()
                                                 select new Institution_Device_list()
                                                 {
                                                     Id = p.Field<long>("ID"),
                                                     ChildId = p.Field<long>("DID"),
                                                     DeviceId = p.Field<int>("Device_Id"),
                                                     DeviceName = p.Field<string>("NAME")
                                                 }).ToList();
            return INS;
        }
        public IList<GatewayMasterModel> PaymentModule_List()
        {
            List<DataParameter> param = new List<DataParameter>();
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTIONPAYMENTMETHODS_SP_LIST]");
                List<GatewayMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new GatewayMasterModel()
                                                 {
                                                     Id = p.Field<long>("ID"),
                                                     PaymentName = p.Field<string>("PAYMENTNAME"),
                                                     GateWayType = p.Field<int>("GATEWAYTYPE"),
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
        /// details of a selected Institution Subscription
        /// </summary>
        /// <param name="Id">Id of a Institution Subscription</param>
        /// <returns>Language Subscription details object</returns>
        public IList<InstitutionSubscriptionLanguageModels> InstitutionSubscriptionLanguageDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SUBSCRIPTIONLANGUAGE_SP_VIEW", param);
            List<InstitutionSubscriptionLanguageModels> INS = (from p in dt.AsEnumerable()
                                                             select new InstitutionSubscriptionLanguageModels()
                                                             {
                                                                 Id = p.Field<long>("ID"),
                                                                 ChildId = p.Field<long>("LID"),
                                                                 LanguageId = p.Field<long>("LANGUAGE_ID"),
                                                                 LanguageName = p.Field<string>("LANGUAGE_NAME")
                                                             }).ToList();
            return INS;
        }

        public IList<GatewayMasterModel> InstitutionSubscriptionPaymentDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTION_SUBSCRIPTIONPAYMENT_SP_VIEW]", param);
            List<GatewayMasterModel> INS = (from p in dt.AsEnumerable()
                                                               select new GatewayMasterModel()
                                                               {
                                                                   Id = p.Field<long>("PAYMENT_ID"),
                                                                   GateWayType = p.Field<int>("GATEWAYTYPE"),
                                                               }).ToList();
            return INS;
        }
        public IList<GatewayMasterModel> InstitutionSubscriptionInsuranceDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTION_SUBSCRIPTIONINSURANCE_SP_VIEW]", param);
            List<GatewayMasterModel> INS = (from p in dt.AsEnumerable()
                                            select new GatewayMasterModel()
                                            {
                                                Id = p.Field<long>("PAYMENT_ID"),
                                                GateWayType = p.Field<int>("GATEWAYTYPE"),
                                            }).ToList();
            return INS;
        }
        /// <summary>
        /// to get the current subscription details of a Institution
        /// </summary>
        /// <param name="Id">Institution Id</param>
        /// <returns>Subscription details object</returns>
        public InstitutionSubscriptionModel InstitutionSubscriptionDetails_View(long Id, Guid Login_Session_Id)
        {
            long ViewId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SUBSCRIPTION_SP_VIEW", param);
            InstitutionSubscriptionModel INS = (from p in dt.AsEnumerable()
                                                select
                                                new InstitutionSubscriptionModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    Institution_Id = p.Field<long>("Institution_Id"),
                                                    Institution = new InstitutionModel()
                                                   {

                                                        Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                        Email = p.Field<string>("EMAILID"),
                                                        Institution_Address1 = p.Field<string>("ADDRESS1"),
                                                        Institution_Address2 = p.Field<string>("ADDRESS2"),
                                                        Institution_Address3 = p.Field<string>("ADDRESS3"),
                                                        ZipCode = p.Field<string>("POSTEL_ZIPCODE"),
                                                        CountryId = p.Field<long>("COUNTRYID"),
                                                        StateId = p.Field<long>("STATEID"),
                                                        CityId = p.Field<long>("CITYID"),
                                                        CountryName = p.Field<string>("COUNTRY_NAME"),
                                                        StateName = p.Field<string>("STATENAME"),
                                                        CityName = p.Field<string>("LOCATIONNAME"),
                                                        IsActive = p.Field<int>("ISACTIVE")
                                                    },
                                                    ChronicCc = p.Field<bool>("CHRONIC_CC"),
                                                    ChronicCg = p.Field<bool>("CHRONIC_CG"),
                                                    ChronicCl = p.Field<bool>("CHRONIC_CL"),
                                                    ChronicSc = p.Field<bool>("CHRONIC_SC"),
                                                    Contract_PeriodFrom = p.Field<DateTime>("CONTRACT_PERIODFROM"),
                                                    Health_Care_Professionals = p.Field<int>("NOOF_HEALTHCARE"),
                                                    No_Of_Patients = p.Field<int>("NOOF_PATIENT"),
                                                    No_Of_Hive = p.IsNull("NOOF_HIVE") ? 0 : p.Field<int?>("NOOF_HIVE"),
                                                    No_Of_HiveChart = p.IsNull("NOOF_HIVECHART") ? 0 : p.Field<int?>("NOOF_HIVECHART"),
                                                    No_Of_HiveUsers = p.IsNull("NOOF_HIVE_USER") ? 0 : p.Field<int?>("NOOF_HIVE_USER"),
                                                    No_Of_HiveChartUsers = p.IsNull("NOOF_HIVECHART_USER") ? 0 : p.Field<int?>("NOOF_HIVECHART_USER"),
                                                    //No_Of_HiveDevices = p.IsNull("NOOF_HIVE_DEVICES") ? 0 : p.Field<int?>("NOOF_HIVE_DEVICES"),
                                                    //No_Of_HiveChartDevices = p.IsNull("NOOF_HIVECHART_DEVICES") ? 0 : p.Field<int?>("NOOF_HIVECHART_DEVICES"),
                                                    Contract_PeriodTo = p.Field<DateTime>("CONTRACT_PERIODTO"),
                                                    Subscription_Type = p.Field<int>("SUBSCRIPTION_TYPE"),
                                                    TelePhone_User=p.IsNull("TELEPHONE_USER")?0 : p.Field<int>("TELEPHONE_USER"),
                                                    TimeZone_ID = p.IsNull("TIMEZONE_ID") ? 0 : p.Field<int>("TIMEZONE_ID"),
                                                    Appointment_Module_Id = p.IsNull("APPOINTMENT_MODULE_ID") ? 0 : p.Field<int>("APPOINTMENT_MODULE_ID"),
                                                    Created_No_Of_Patient = p.Field<int>("CREATED_NO_OF_PAT"),
                                                    Created_No_Of_HealthCareProf = p.Field<int>("CREATED_NO_OF_HCP"),
                                                    Remaining_No_Of_Patient = p.Field<int>("REMAIND_NO_OF_PAT"),
                                                    Remaining_No_Of_HealthCareProf = p.Field<int>("REMAIND_NO_OF_HCP"),
                                                    Created_No_Of_Hive = p.Field<int?>("CREATED_NO_OF_HIVE"),
                                                    Created_No_Of_Hivechart = p.Field<int?>("CREATED_NO_OF_HIVECHART"),
                                                    Remaining_No_Of_Hive = p.Field<int?>("REMAIND_NO_OF_HIVE"),
                                                    Remaining_No_Of_Hivechart = p.Field<int?>("REMAIND_NO_OF_HIVECHART"),
                                                    Created_No_Of_Hive_Users = p.Field<int?>("CREATED_NO_OF_HIVE_USER"),
                                                    Created_No_Of_Hivechart_Users = p.Field<int?>("CREATED_NO_OF_HIVECHART_USER"),
                                                    Remaining_No_Of_Hive_Users = p.Field<int?>("REMAIND_NO_OF_HIVE_USER"),
                                                    Remaining_No_Of_Hivechart_Users = p.Field<int?>("REMAIND_NO_OF_HIVECHART_USER"),
                                                    //Created_No_Of_Hive_Devices = p.Field<int?>("CREATED_NO_OF_HIVE_DEVICES"),
                                                    //Created_No_Of_Hivechart_Devices = p.Field<int?>("CREATED_NO_OF_HIVECHART_DEVICES"),
                                                    //Remaining_No_Of_Hive_Devices = p.Field<int?>("REMAIND_NO_OF_HIVE_DEVICES"),
                                                    //Remaining_No_Of_Hivechart_Devices = p.Field<int?>("REMAIND_NO_OF_HIVECHART_DEVICES"),
                                                    //SubscriptionId = p.Field<int>("SubScription_Id"),
                                                }).FirstOrDefault();
            //ViewId = INS.Id;
            INS.Module_List = ModuleNameList();
            INS.ChildModuleList = InstitutionSubscriptionModuleDetails_View(INS.Id);
            INS.Language_List = LanguageNameList();
            INS.ChildLanguageList = InstitutionSubscriptionLanguageDetails_View(INS.Id);
            INS.Payment_List = PaymentModule_List();
            INS.ChildPaymentList = InstitutionSubscriptionPaymentDetails_View(INS.Id);
            INS.ChildInsuranceList = InstitutionSubscriptionInsuranceDetails_View(INS.Id);
            INS.Device_list = Get_DeviceNameList();
            INS.ChildDeviceList = InstitutionSubscriptionDeviceDetails_View(INS.Id);
            return INS;
            //INS.ToList=
            //INS.InstitutionSubscriptionModuleModels            
        }

        /// <summary>
        /// list of institution subscription details for the given filter
        /// </summary>
        /// <param name="Id">Subscription Id</param>
        /// <returns>institution subscription details list object</returns>
        public IList<InstitutionSubscriptionModel> InstitutionSubscription_List(long? Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTION_SUBSCRIPTION_SP_LIST]", param);
            List<InstitutionSubscriptionModel> list = (from p in dt.AsEnumerable()
                                                       select new InstitutionSubscriptionModel()
                                                       {
                                                           Id = p.Field<long>("Id"),
                                                           Institution = new InstitutionModel()
                                                           {
                                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                               INSTITUTION_SHORTNAME = p.Field<string>("INSTITUTION_SHORTNAME"),
                                                               IsActive = p.Field<int>("ISACTIVE")
                                                           },
                                                           Contract_PeriodFrom = p.Field<DateTime>("CONTRACT_PERIODFROM"),
                                                           Health_Care_Professionals = p.Field<int>("NOOF_HEALTHCARE"),
                                                           No_Of_Patients = p.Field<int>("NOOF_PATIENT"),
                                                           Contract_PeriodTo = p.Field<DateTime>("CONTRACT_PERIODTO"),
                                                           Subscription_Type = p.Field<int>("SUBSCRIPTION_TYPE"),
                                                           Created_No_Of_Patient = p.Field<int>("CREATED_NO_OF_PAT"),
                                                           Created_No_Of_HealthCareProf = p.Field<int>("CREATED_NO_OF_HCP"),
                                                           Remaining_No_Of_Patient = p.Field<int>("REMAIND_NO_OF_PAT"),
                                                           Remaining_No_Of_HealthCareProf = p.Field<int>("REMAIND_NO_OF_HCP"),

                                                       }).ToList();
            return list;
        }

        /// <summary>
        /// to get the current subscription details of a Institution
        /// </summary>
        /// <param name="Id">Institution Id</param>
        /// <returns>Subscription details object</returns>
        public InstitutionSubscriptionModel InstitutionSubscriptionActiveDetails_View(long Id, Guid Login_Session_Id)
        {
            var ViewId = "";
            var LoginSession = Login_Session_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ACTIVEINSTITUTEDETAILS_SP_LIST", param);
            DataRow dr = dt.Rows[0];
            ViewId = (dr["Id"].ToString());
            var data = InstitutionSubscriptionDetails_View(Convert.ToInt32(ViewId), LoginSession);

            return data;

        }

    }
}