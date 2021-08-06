using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using log4net;
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
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

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
                                         CityName = p.Field<string>("LOCATIONNAME")
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
            param.Add(new DataParameter("@CONTRACT_PERIODFROM", obj.Contract_PeriodFrom));
            param.Add(new DataParameter("@CONTRACT_PERIODTO", obj.Contract_PeriodTo));
            param.Add(new DataParameter("@SUBSCRIPTION_TYPE", obj.Subscription_Type));
            param.Add(new DataParameter("@SESSION_ID", LoginSession));
            param.Add(new DataParameter("@Created_by", HttpContext.Current.Session["UserId"]));
            param.Add(new DataParameter("@TIMEZONE_ID", obj.TimeZone_ID));
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
                                                               Contract_PeriodTo = p.Field<DateTime>("CONTRACT_PERIODTO"),
                                                               Subscription_Type = p.Field<int>("SUBSCRIPTION_TYPE"),
                                                               TimeZone_ID = p.Field<int>("TIMEZONE_ID"),
                                                               flag = p.Field<int>("flag"),
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

            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<LanguageMasterModel> LanguageNameList()
        {
            List<DataParameter> param = new List<DataParameter>();

            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
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

                                                    Contract_PeriodFrom = p.Field<DateTime>("CONTRACT_PERIODFROM"),
                                                    Health_Care_Professionals = p.Field<int>("NOOF_HEALTHCARE"),
                                                    No_Of_Patients = p.Field<int>("NOOF_PATIENT"),
                                                    Contract_PeriodTo = p.Field<DateTime>("CONTRACT_PERIODTO"),
                                                    Subscription_Type = p.Field<int>("SUBSCRIPTION_TYPE"),
                                                    TimeZone_ID = p.IsNull("TIMEZONE_ID") ? 0 : p.Field<int>("TIMEZONE_ID"),
                                                    //SubscriptionId = p.Field<int>("SubScription_Id"),
                                                }).FirstOrDefault();
            //ViewId = INS.Id;
            INS.Module_List = ModuleNameList();
            INS.ChildModuleList = InstitutionSubscriptionModuleDetails_View(INS.Id);
            INS.Language_List = LanguageNameList();
            INS.ChildLanguageList = InstitutionSubscriptionLanguageDetails_View(INS.Id);

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