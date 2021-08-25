using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using log4net;
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Masters
{
    public class PlanMasterRepository : IPlanMasterRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public PlanMasterRepository()
        {

            db = new ClsDataBase();
        }

        public IList<PlanMasterModel> PlanMaster_AddEdit(PlanMasterModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@SELECTEDPAYOR", obj.SelectPayor));
            param.Add(new DataParameter("@PLANNAME", obj.PlanName));
            param.Add(new DataParameter("@SHORTCODE", obj.ShortCode));
            param.Add(new DataParameter("@DESCRIPTION", obj.Description));
            param.Add(new DataParameter("@FINANCIALCLASS", obj.FinancialClass)); 
            param.Add(new DataParameter("@PACKAGENAME", obj.PackageName));
            param.Add(new DataParameter("@PRICECODE", obj.PriceCode));
            param.Add(new DataParameter("@REFERCODE", obj.ReferCode));
            param.Add(new DataParameter("@VALIDFROMDATE", obj.ValidFromDate));
            param.Add(new DataParameter("@VALIDTODATE", obj.ValidToDate));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.InstitutionId));
            param.Add(new DataParameter("@CREATED_BY", obj.CreatedBy));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PlanMaster_SP_INSERTUPDATE]", param);
                IList<PlanMasterModel> lst = (from p in dt.AsEnumerable()
                                               select
                                               new PlanMasterModel()
                                               {
                                                   Id = p.Field<long>("PLANID"),
                                                   SelectPayor = p.Field<long>("SELECTEDPAYOR"),
                                                   //PayorName = p.Field<string>("PAYORNAME"),
                                                   PlanName = p.Field<string>("PLANNAME"),
                                                   ShortCode = p.Field<string>("SHORTCODE"),
                                                   Description = p.Field<string>("DESCRIPTION"),
                                                   FinancialClass = p.Field<string>("FINANCIALCLASS"),
                                                   PackageName = p.Field<string>("PACKAGENAME"),
                                                   PriceCode = p.Field<string>("PRICECODE"),
                                                   ReferCode = p.Field<string>("REFERCODE"),
                                                   ValidFromDate = p.Field<DateTime>("VALIDFROMDATE"),
                                                   ValidToDate = p.Field<DateTime>("VALIDTODATE"),
                                                   IsActive = p.Field<int>("ISACTIVE"),
                                                   CreatedBy = p.Field<long>("CREATED_BY"),
                                                   InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                   flag = p.Field<int>("flag"),
                                               }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<PlanMasterModel> PlanMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PLANMASTER_SP_LIST]", param);
                List<PlanMasterModel> lst = (from p in dt.AsEnumerable()
                                              select new PlanMasterModel()
                                              {
                                                  Id = p.Field<long>("PLANID"),
                                                  SelectPayor = p.Field<long>("SELECTEDPAYOR"),
                                                  PayorName = p.Field<string>("PAYORNAME"),
                                                  PlanName = p.Field<string>("PLANNAME"),
                                                  ShortCode = p.Field<string>("SHORTCODE"),
                                                  Description = p.Field<string>("DESCRIPTION"),
                                                  FinancialClass = p.Field<string>("FINANCIALCLASS"),
                                                  PackageName = p.Field<string>("PACKAGENAME"),
                                                  PriceCode = p.Field<string>("PRICECODE"),
                                                  ReferCode = p.Field<string>("REFERCODE"),
                                                  ValidFromDate = p.Field<DateTime>("VALIDFROMDATE"),
                                                  ValidToDate = p.Field<DateTime>("VALIDTODATE"),
                                                  IsActive = p.Field<int>("ISACTIVE"),
                                                  CreatedBy = p.Field<long>("CREATED_BY"),
                                                  InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                              }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public PlanMasterModel PlanMasterView(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PLANMASTER_SP_VIEW]", param);
                PlanMasterModel IM = (from p in dt.AsEnumerable()
                                       select new PlanMasterModel()
                                       {
                                           Id = p.Field<long>("PLANID"),
                                           SelectPayor = p.Field<long>("SELECTEDPAYOR"),
                                           //PayorName = p.Field<string>("PAYORNAME"),
                                           PlanName = p.Field<string>("PLANNAME"),
                                           ShortCode = p.Field<string>("SHORTCODE"),
                                           Description = p.Field<string>("DESCRIPTION"),
                                           FinancialClass = p.Field<string>("FINANCIALCLASS"),
                                           PackageName = p.Field<string>("PACKAGENAME"),
                                           PriceCode = p.Field<string>("PRICECODE"),
                                           ReferCode = p.Field<string>("REFERCODE"),
                                           ValidFromDate = p.Field<DateTime>("VALIDFROMDATE"),
                                           ValidToDate = p.Field<DateTime>("VALIDTODATE"),
                                           IsActive = p.Field<int>("ISACTIVE"),
                                           CreatedBy = p.Field<long>("CREATED_BY"),
                                           InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                       }).FirstOrDefault();
                return IM;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        /// <summary>
        /// to deactivate a Plan Master
        /// </summary>
        /// <param name="Id">id of Plan Master</param>
        /// <returns>success response of deactivate</returns>
        public void PlanMaster_Delete(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PLANMASTER_SP_DELETE]", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }
        /// <summary>
        /// to activate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of activate</returns>
        public void PlanMaster_Active(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PLANMASTER_SP_ACTIVE]", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }

        public IList<PlanMasterModel> PayorBasedPlanList(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@SELECTEDPAYOR", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PAYORBASEDPLAN_SP_LIST]", param);
                List<PlanMasterModel> lst = (from p in dt.AsEnumerable()
                                             select new PlanMasterModel()
                                             {
                                                 Id = p.Field<long>("PLANID"),
                                                 SelectPayor = p.Field<long>("SELECTEDPAYOR"),
                                                 //PayorName = p.Field<string>("PAYORNAME"),
                                                 PlanName = p.Field<string>("PLANNAME"),
                                                 //ShortCode = p.Field<string>("SHORTCODE"),
                                                 //Description = p.Field<string>("DESCRIPTION"),
                                                 //FinancialClass = p.Field<string>("FINANCIALCLASS"),
                                                 //PackageName = p.Field<string>("PACKAGENAME"),
                                                 //PriceCode = p.Field<string>("PRICECODE"),
                                                 //ReferCode = p.Field<string>("REFERCODE"),
                                                 //ValidFromDate = p.Field<DateTime>("VALIDFROMDATE"),
                                                 //ValidToDate = p.Field<DateTime>("VALIDTODATE"),
                                                 IsActive = p.Field<int>("ISACTIVE"),
                                                 //CreatedBy = p.Field<long>("CREATED_BY"),
                                                 //InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
    }
}