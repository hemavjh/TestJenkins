using log4net;
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
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public IList<GatewaySettingsModel> GatewaySettings_List(long Institution_Id, Guid Login_Session_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLGATEWAY_VALUE_SP_LIST]", param);
                DataEncryption DecryptFields = new DataEncryption();
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<GatewaySettingsModel> GatewaySettings_Details(long InstitutionId, long GatewayId, string GatewayKey)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            param.Add(new DataParameter("@GATEWAY_ID", GatewayId));
            param.Add(new DataParameter("@GATEWAY_KEY", GatewayKey));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLGATEWAY_VALUE_SP_DETAILS]", param);
                DataEncryption DecryptFields = new DataEncryption();
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public int GatewaySettings_Update(List<GatewaySettingsModel> obj)
        {
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
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public int GatewayDefault_Save(long InstitutionId, long GatewayTypeId, long GatewayId)
        {
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
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public string PatientAmount(long Institution_Id, long Department_Id)
        {
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
                _logger.Error(ex.Message, ex);
                return "0";
            }
}
    }
}