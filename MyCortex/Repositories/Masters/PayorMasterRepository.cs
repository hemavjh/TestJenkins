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
    public class PayorMasterRepository : IPayorMasterRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public PayorMasterRepository()
        {

            db = new ClsDataBase();
        }

        public IList<PayorMasterModel> PayorMaster_AddEdit(PayorMasterModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@PAYORNAME", obj.PayorName));
            param.Add(new DataParameter("@DESCRIPTION", obj.Description));
            param.Add(new DataParameter("@SHORTCODE", obj.ShortCode));
            param.Add(new DataParameter("@REFERCODE", obj.ReferCode));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.InstitutionId));
            param.Add(new DataParameter("@CREATED_BY", obj.CreatedBy));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PayorMaster_SP_INSERTUPDATE]", param);
                IList<PayorMasterModel> lst = (from p in dt.AsEnumerable()
                                               select
                                               new PayorMasterModel()
                                               {
                                                   Id = p.Field<long>("PayorId"),
                                                   PayorName = p.Field<string>("PayorName"),
                                                   ShortCode = p.Field<string>("ShortCode"),
                                                   ReferCode = p.Field<string>("ReferCode"),
                                                   Description = p.Field<string>("Description"),
                                                   IsActive = p.Field<int>("IsActive"),
                                                   CreatedBy = p.Field<long>("Created_By"),
                                                   InstitutionId = p.Field<long>("Institution_Id"),
                                                   flag = p.Field<int>("flag"),
                                               }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<PayorMasterModel> PayorMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PAYORMASTER_SP_LIST]", param);
                List<PayorMasterModel> lst = (from p in dt.AsEnumerable()
                                            select new PayorMasterModel()
                                            {
                                                TotalRecord = p.Field<string>("TotalRecords"),
                                                Id = p.Field<long>("PayorId"),
                                                PayorName = p.Field<string>("PayorName"),
                                                ShortCode = p.Field<string>("ShortCode"),
                                                ReferCode = p.Field<string>("ReferCode"),
                                                Description = p.Field<string>("Description"),
                                                IsActive = p.Field<int>("IsActive"),
                                                CreatedBy = p.Field<long>("Created_By"),
                                                InstitutionId = p.Field<long>("Institution_Id"),
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public PayorMasterModel PayorMasterView(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PAYORMASTER_SP_VIEW]", param);
                PayorMasterModel IM = (from p in dt.AsEnumerable()
                                       select new PayorMasterModel()
                                       {
                                           Id = p.Field<long>("PayorId"),
                                           PayorName = p.Field<string>("PayorName"),
                                           ShortCode = p.Field<string>("ShortCode"),
                                           ReferCode = p.Field<string>("ReferCode"),
                                           Description = p.Field<string>("Description"),
                                           IsActive = p.Field<int>("IsActive"),
                                           CreatedBy = p.Field<long>("Created_By"),
                                           InstitutionId = p.Field<long>("Institution_Id"),
                                       }).FirstOrDefault();
                return IM;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// to deactivate a Payor Master
        /// </summary>
        /// <param name="Id">id of Payor Master</param>
        /// <returns>success response of deactivate</returns>
        public void PayorMaster_Delete(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PAYORMASTER_SP_DELETE]", param);
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }
        /// <summary>
        /// to activate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of activate</returns>
        public void PayorMaster_Active(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PAYORMASTER_SP_ACTIVE]", param);
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }
    }
}