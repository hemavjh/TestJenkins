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
    public class DrugDBMasterRepository : IDrugDBMasterRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/

        public DrugDBMasterRepository()
        {

            db = new ClsDataBase();
        }

        /// <summary>
        /// drug strength name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        ///  <param name="StartRowNumber">StartRowNumber</param>
        /// <param name="EndRowNumber">EndRowNumber</param>
        /// <returns>drug strength name list of a institution</returns>

        public IList<DrugStrengthMasterModel> DrugStrengthList(long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>(); 
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DRUG_STRENGTHMASTER_SP_LIST", param);
                List<DrugStrengthMasterModel> lst = (from p in dt.AsEnumerable()
                                                     select new DrugStrengthMasterModel()
                                                     {
                                                       
                                                         Id = p.Field<long>("ID"),
                                                         Name = p.Field<string>("NAME"),
                                                         IsActive = p.Field<int>("IsActive")
                                                     }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }

        }
        /// <summary>
        /// dosage form name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>dosge form name list of a institution</returns>

        public IList<DosageFormMasterModel> DosageFormList(long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DOSAGEFORM_MASTER_SP_LIST", param);
                List<DosageFormMasterModel> lst = (from p in dt.AsEnumerable()
                                                   select new DosageFormMasterModel()
                                                   {
                                                       Id = p.Field<long>("ID"),
                                                       Name = p.Field<string>("NAME"),
                                                       IsActive = p.Field<int>("IsActive")
                                                   }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }

        }


        /// <summary>
        /// drug db master list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>drug db master list of a institution</returns>

        public IList<DrugDBMasterModel> DrugDBMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/

            try
            {//DRUGDBMASTER_SP_LIST
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DRUGDBMASTER_SP_LIST", param);
                List<DrugDBMasterModel> lst = (from p in dt.AsEnumerable()
                                               select new DrugDBMasterModel()
                                               {
                                                   TotalRecord = p.Field<string>("TotalRecords"),
                                                   Id = p.Field<long>("ID"),
                                                   Generic_name = p.Field<string>("GENERIC_NAME"),
                                                   Strength_ID = p.Field<long>("STRENGTH_ID"),
                                                   StrengthName = p.Field<string>("STRENGTHNAME"),
                                                   Dosage_From_ID = p.Field<long>("DOSAGEFORM_ID"),
                                                   Dosage_FromName = p.Field<string>("DOSAGEFORMNAME"),
                                                   Item_Code = p.Field<string>("ITEMCODE"),
                                                   Drug_Code = p.Field<string>("DRUGCODE"),
                                                   IsActive = p.Field<int>("IsActive"),
                                                   InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                   Institution_Name = p.Field<string>("INSTITUTION_NAME")
                                               }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>
        /// details of a DrugDB note
        /// </summary>
        /// <param name="Id">DrugDB Id</param>
        /// <returns>details of a DrugDB</returns>

        public DrugDBMasterModel DrugDBMasterView(int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DRUGDBMASTER_SP_VIEW", param);
                DrugDBMasterModel DM = (from p in dt.AsEnumerable()
                                        select new DrugDBMasterModel()
                                        {
                                            Id = p.Field<long>("ID"),
                                            Generic_name = p.Field<string>("GENERIC_NAME"),
                                            Strength_ID = p.Field<long>("STRENGTH_ID"),
                                            StrengthName = p.Field<string>("STRENGTHNAME"),
                                            Dosage_From_ID = p.Field<long>("DOSAGEFORM_ID"),
                                            Dosage_FromName = p.Field<string>("DOSAGEFORMNAME"),
                                            Item_Code = p.Field<string>("ITEMCODE"),
                                            Drug_Code = p.Field<string>("DRUGCODE"),
                                            InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                            Institution_Name = p.Field<string>("INSTITUTION_NAME")

                                        }).FirstOrDefault();
                return DM;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>
        /// to insert/update drug db master 
        /// </summary>
        /// <param name="obj">details of drug db master</param>
        /// <returns>inserted/updated drug db master</returns>

        public IList<DrugDBMasterModel> DrugDBMaster_AddEdit(DrugDBMasterModel obj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@GENERIC_NAME", obj.Generic_name));
            param.Add(new DataParameter("@STRENGTH_ID", obj.Strength_ID));
            param.Add(new DataParameter("@DOSAGEFORM_ID", obj.Dosage_From_ID));
            param.Add(new DataParameter("@ITEMCODE", obj.Item_Code));
            param.Add(new DataParameter("@DRUGCODE", obj.Drug_Code));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.InstitutionId));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DRUGDBMASTER_SP_INSERTUPDATE", param);


                IList<DrugDBMasterModel> lst = (from p in dt.AsEnumerable()
                                                select
                                                new DrugDBMasterModel()
                                                {
                                                    Id = p.Field<long>("ID"),
                                                    Generic_name = p.Field<string>("GENERIC_NAME"),
                                                    Strength_ID = p.Field<long>("STRENGTH_ID"),
                                                    Dosage_From_ID = p.Field<long>("DOSAGEFORM_ID"),
                                                    Item_Code = p.Field<string>("ITEMCODE"),
                                                    Drug_Code = p.Field<string>("DRUGCODE"),
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


        /// <summary>
        /// to deactivate a drug db master
        /// </summary>
        /// <param name="Id">Id of a drug db master</param>
        /// <returns>success response of deactivation</returns>

        public void DrugDBMaster_Delete(int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                ClsDataBase.Update("[MYCORTEX].DRUGDBMASTER_SP_Delete", param);
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
            }
        }
        /// <summary>
        /// to activate a drug db master 
        /// </summary>
        /// <param name="Id">id drug db master </param>
        /// <returns>success/failure response of activation</returns>
        public void DrugDBMaster_Active(int Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                ClsDataBase.Update("[MYCORTEX].DRUGDBMASTER_SP_ACTIVE", param);
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
            }
        }


    }
}