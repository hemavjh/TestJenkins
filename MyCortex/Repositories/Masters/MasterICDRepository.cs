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
    public class MasterICDRepository : IMasterICDReposistory
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public MasterICDRepository()
        {

            db = new ClsDataBase();
        }

        /// <summary>
        /// ICD category master name list
        /// </summary>
        /// <param name="Institution_Id">Institution_Id</param>
        /// <returns>ICD category master name list</returns>

        public IList<CategoryMasterModel> CategoryMasterList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ICD10_CATEGORYMASTER_SP_LIST]", param);
                List<CategoryMasterModel> lst = (from p in dt.AsEnumerable()
                                                 select new CategoryMasterModel()
                                                 {
                                                     Id = p.Field<long>("ID"),
                                                     Name = p.Field<string>("NAME"),
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


        /// <summary>
        /// to get ICD master list of a institution
        /// </summary>
        /// <param name="IsActive">active flag</param>
        /// <param name="InstitutionId">Institution Id</param>
        /// <param name="StartRowNumber">StartRowNumber</param>
        /// <param name="EndRowNumber">EndRowNumber</param>
        /// <returns>ICD master list of a institution</returns>
        public IList<MasterICDModel> ICDMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ICD10MASTER_SP_LIST]", param);
                List<MasterICDModel> lst = (from p in dt.AsEnumerable()
                                            select new MasterICDModel()
                                            {
                                                TotalRecord = p.Field<string>("TotalRecords"),
                                                Id = p.Field<long>("ID"),
                                                ICD_Code = p.Field<string>("ICDCODE"),
                                                Description = p.Field<string>("ICDDESC"),
                                                Category_ID = p.Field<long?>("CATEGORY_ID"),
                                                CategoryName = p.Field<string>("CATEGORYNAME") ?? "",
                                                IsActive = p.Field<int>("IsActive"),
                                                InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                Institution_Name = p.Field<string>("INSTITUTION_NAME")
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
        /// to get ICD master details of a ICD master
        /// </summary>
        /// <param name="Id">Id of a ICD Master</param>
        /// <returns>ICD master details of a ICD master</returns>

        public MasterICDModel ICDMasterView(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ICD10MASTER_SP_VIEW]", param);
                MasterICDModel IM = (from p in dt.AsEnumerable()
                                     select new MasterICDModel()
                                     {
                                         Id = p.Field<long>("ID"),
                                         ICD_Code = p.Field<string>("ICDCODE"),
                                         Description = p.Field<string>("ICDDESC"),
                                         Category_ID = p.IsNull("CATEGORY_ID") ? 0 : p.Field<long?>("CATEGORY_ID"),
                                         CategoryName = p.IsNull("CATEGORYNAME") ? null : p.Field<string>("CATEGORYNAME"),
                                         InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                         Institution_Name = p.Field<string>("INSTITUTION_NAME")

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
        /// to insert/update a ICD Master list
        /// </summary>
        /// <param name="obj">a ICD Master detail</param>
        /// <returns>inserted/updated ICD Master list</returns>

        public IList<MasterICDModel> MasterICD_AddEdit(MasterICDModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@ICDCODE", obj.ICD_Code));
            param.Add(new DataParameter("@ICDDESC", obj.Description));
            param.Add(new DataParameter("@CATEGORY_ID", obj.Category_ID));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.InstitutionId));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ICD10MASTER_SP_INSERTUPDATE]", param);
                IList<MasterICDModel> lst = (from p in dt.AsEnumerable()
                                             select
                                             new MasterICDModel()
                                             {
                                                 Id = p.Field<Int64>("ID"),
                                                 ICD_Code = p.Field<string>("ICDCODE"),
                                                 Description = p.Field<string>("ICDDESC"),
                                                 Category_ID = p.Field<Int64?>("CATEGORY_ID"),
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

        /// <summary>
        /// to deactivate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of deactivate</returns>
        public void ICDMaster_Delete(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[ICD10MASTER_SP_DELETE]", param);
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
        public void ICDMaster_Active(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[ICD10MASTER_SP_ACTIVE]", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }
    }
}