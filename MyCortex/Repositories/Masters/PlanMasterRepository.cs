using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
  
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Masters
{
    public class PlanMasterRepository : IPlanMasterRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        public PlanMasterRepository()
        {

            db = new ClsDataBase();
        }

        public IList<PlanMasterModel> PlanMaster_AddEdit(Guid Login_Session_Id, PlanMasterModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
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
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
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
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        public IList<PlanMasterModel> PlanMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PLANMASTER_SP_LIST]", param);
                List<PlanMasterModel> lst = (from p in dt.AsEnumerable()
                                              select new PlanMasterModel()
                                              {
                                                  TotalRecord = p.Field<string>("TotalRecords"),
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
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        public PlanMasterModel PlanMasterView(Guid Login_Session_Id, int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
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
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
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
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PLANMASTER_SP_DELETE]", param);
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
            }
        }
        /// <summary>
        /// to activate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of activate</returns>
        public void PlanMaster_Active(int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PLANMASTER_SP_ACTIVE]", param);
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
            }
        }

        public IList<PlanMasterModel> PayorBasedPlanList(int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@SELECTEDPAYOR", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
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
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
    }
}