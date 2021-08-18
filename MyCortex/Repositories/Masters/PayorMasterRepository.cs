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
    public class PayorMasterRepository : IPayorMasterRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public PayorMasterRepository()
        {

            db = new ClsDataBase();
        }

        public IList<PayorMasterModel> PayorMaster_AddEdit(PayorMasterModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@PAYORNAME", obj.PayorName));
            param.Add(new DataParameter("@DESCRIPTION", obj.Description));
            param.Add(new DataParameter("@SHORTCODE", obj.ShortCode));
            param.Add(new DataParameter("@REFERCODE", obj.ReferCode));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.InstitutionId));
            param.Add(new DataParameter("@CREATED_BY", obj.CreatedBy));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<PayorMasterModel> PayorMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PAYORMASTER_SP_LIST]", param);
                List<PayorMasterModel> lst = (from p in dt.AsEnumerable()
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
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public PayorMasterModel PayorMasterView(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
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
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PAYORMASTER_SP_DELETE]", param);
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
        public void PayorMaster_Active(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[PAYORMASTER_SP_ACTIVE]", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }
    }
}