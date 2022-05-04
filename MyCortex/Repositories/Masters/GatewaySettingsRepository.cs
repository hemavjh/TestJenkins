  
using MyCortex.Admin.Models;
using MyCortex.Utilities;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace MyCortex.Repositories.Masters
{
    public class GatewaySettingsRepository : IGatewaySettingsRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public IList<GatewaySettingsModel> GatewaySettings_List(long Institution_Id, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLGATEWAY_VALUE_SP_LIST]", param);
                List<GatewaySettingsModel> list = (from p in dt.AsEnumerable()
                                                    select new GatewaySettingsModel()
                                                    {
                                                        Id = p.Field<long>("ID"),
                                                        InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                        GatewayKey = p.Field<string>("GATEWAY_KEY"),
                                                        GatewayValue = p.Field<string>("GATEWAY_VALUE"),
                                                        GatewayId = p.Field<long>("GATEWAY_ID"),
                                                    }).ToList();
                return list;
            }
            catch (Exception ex)
            {
 
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<GatewaySettingsModel> GatewaySettings_Details(long InstitutionId, long GatewayId, string GatewayKey)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            param.Add(new DataParameter("@GATEWAY_ID", GatewayId));
            param.Add(new DataParameter("@GATEWAY_KEY", GatewayKey));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLGATEWAY_VALUE_SP_DETAILS]", param);
                List<GatewaySettingsModel> list = (from p in dt.AsEnumerable()
                                                   select new GatewaySettingsModel()
                                                   {
                                                       Id = p.Field<long>("ID"),
                                                       InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                       GatewayKey = p.Field<string>("GATEWAY_KEY"),
                                                       GatewayValue = p.Field<string>("GATEWAY_VALUE"),
                                                       GatewayId = p.Field<long>("GATEWAY_ID"),
                                                   }).ToList();
                return list;
            }
            catch (Exception ex)
            {
 
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public int GatewaySettings_Update(List<GatewaySettingsModel> obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                int retid = 0;
                // int executedOnce = 0;

                foreach (GatewaySettingsModel item in obj)
                {
                    //if (item.Units_ID != null)
                    {
                        List<DataParameter> param = new List<DataParameter>();
                        param.Add(new DataParameter("@ID", item.Id));
                        param.Add(new DataParameter("@INSTITUTION_ID", item.InstitutionId));
                        param.Add(new DataParameter("@GATEWAY_VALUE", item.GatewayValue));
                        param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                        retid = ClsDataBase.Insert("[MYCORTEX].[TBLGATEWAY_VALUE_SP_UPDATE]", param, true);
                    }

                }
                return retid;
            }
            catch (Exception ex)
            {
 
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }

        public int GatewayDefault_Save(long InstitutionId, long GatewayTypeId, long GatewayId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
                param.Add(new DataParameter("@GATEWAYTYPE_ID", GatewayTypeId));
                param.Add(new DataParameter("@GATEWAY_ID", GatewayId));
                var retid = ClsDataBase.GetScalar("[MYCORTEX].[INSTITUTEGATEWAYDEFAULT_SAVE]", param).ToString();
                return Int32.Parse(retid);
            }
            catch (Exception ex)
            {
 
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }

        public string PatientAmount(long Institution_Id, long Department_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
                param.Add(new DataParameter("@Department_Id", Department_Id));
                var retid = ClsDataBase.GetScalar("[MYCORTEX].[GET_PATIENT_AMOUNT_SP]", param).ToString();
                return retid;
            }
            catch (Exception ex)
            {
 
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return "0";
            }
}
    }
}