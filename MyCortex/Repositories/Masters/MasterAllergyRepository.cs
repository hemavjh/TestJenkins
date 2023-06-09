﻿using MyCortex.Admin.Controllers;
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
    public class MasterAllergyRepository : IMasterAllergyReposistory
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public MasterAllergyRepository()
        {

            db = new ClsDataBase();
        }


        //For Allergy
        /// <summary>
        /// to get allergy type name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        public IList<MasterAllergyTypeModel> MasterAllergyTypeList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALERGYTYPE_SP_LIST", param);
            List<MasterAllergyTypeModel> list = (from p in dt.AsEnumerable()
                                                 select new MasterAllergyTypeModel()
                                                 {
                                                     Id = p.Field<long>("Id"),
                                                     AllergyTypeName = p.Field<string>("NAME"),
                                                     IsActive = p.Field<int>("ISACTIVE")

                                                 }).ToList();
            return list;
        }


        /// <summary>
        /// to get allergen name list of a Allergy Type and Institution
        /// </summary>
        /// <param name="ALLERGYTYPE_ID"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<MasterAllergyenModel> MasterAllergenList(long ALLERGYTYPE_ID, long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ALLERGYTYPEID", ALLERGYTYPE_ID));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALLERGEN_SP_LIST", param);
            List<MasterAllergyenModel> list = (from p in dt.AsEnumerable()
                                               select new MasterAllergyenModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   AllergenName = p.Field<string>("ALLERGENNAME"),
                                                   IsActive = p.Field<int>("ISACTIVE"),
                                                   AllergyTypeId = p.Field<long>("ALLERGYTYPE_ID")

                                               }).ToList();
            return list;
        }

        /// <summary>
        /// to insert/update a Allergy Master list
        /// </summary>
        /// <param name="obj">a Allergy Master detail</param>
        /// <returns>inserted/updated Allergy Master list</returns>

        public IList<MasterAllergyModel> MasterAllergy_AddEdit(MasterAllergyModel obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@ALLERGEN_ID", obj.AllergenId));
            param.Add(new DataParameter("@ALLERGYTYPE_ID", obj.AllergyTypeId));
            param.Add(new DataParameter("@ALLERGE_NAME", obj.AllergenName));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.InstitutionId));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[AllergyMASTER_SP_INSERTUPDATE]", param);
                IList<MasterAllergyModel> lst = (from p in dt.AsEnumerable()
                                                 select
                                                 new MasterAllergyModel()
                                                 {
                                                     Id = p.Field<Int64>("ID"),
                                                     AllergyTypeName = p.Field<string>("NAME"),
                                                     AllergenName = p.Field<string>("ALLERGENNAME"),
                                                     InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                     flag = p.Field<int>("flag"),
                                                     Patient_Id = p.Field<Int64>("CREATED_BY"),
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
        /// a Master's allergy details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public MasterAllergyModel MasterAllergyView(long Id, Guid Login_Session_Id)
        {
            //long ViewId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ADMIN_ALLERGYDETAILS_SP_VIEW", param);
            MasterAllergyModel ViewAllergy = (from p in dt.AsEnumerable()
                                              select
                                              new MasterAllergyModel()
                                              {
                                                  Id = p.Field<long>("ID"),
                                                  AllergenId = p.Field<long>("ID"),
                                                  AllergenName = p.Field<string>("ALLERGENNAME"),
                                                  AllergyTypeId = p.Field<long>("ALLERGYTYPE_ID"),
                                                  AllergyTypeName = p.Field<string>("ALLERGYTYPE"),
                                                  //AllergySeverityId = p.Field<long?>("SEVERITY_ID"),
                                                  //AllergySeverityName = p.Field<string>("SEVERITY"),
                                                  //AllergyOnsetId = p.Field<long?>("ONSET_ID"),
                                                  //AllergyOnsetName = p.Field<string>("ONSETNAME"),
                                                  //AllergyReactionName = p.Field<string>("ALLERGYREACTIONNAME"),
                                                  //OnSetDate = p.Field<DateTime?>("ONSETDATE"),
                                                  //Remarks = p.Field<string>("REMARKS"),
                                                  //Created_By = p.Field<long>("CREATEDBY"),
                                                  //Patient_Id = p.Field<long>("PATIENT_ID")
                                              }).FirstOrDefault();

            //if (ViewAllergy != null)
            //{
            //    if (ViewAllergy.Id > 0)
            //    {
            //        ViewAllergy.AllergyReaction_List = PatientAllergyReactionView(ViewAllergy.Id);

            //    }
            //    else
            //    {
            //        ViewAllergy = new AllergyModel();
            //    }
            //    return ViewAllergy;

            //}
            return ViewAllergy;
        }

        public List<MasterAllergyModel> Search_Allergy_List(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber, String SearchQuery = null)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
            param.Add(new DataParameter("@STARTNO", StartRowNumber));
            param.Add(new DataParameter("@ENDNO", EndRowNumber));
            param.Add(new DataParameter("@SEARCHQUERY", SearchQuery));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[SEARCH_ALLERGY_SP_ALL_LIST]", param);
            List<MasterAllergyModel> list = (from p in dt.AsEnumerable()
                                            select new MasterAllergyModel()
                                            {
                                                TotalRecord = p.Field<string>("TotalRecords"),
                                                Id = p.Field<long>("ID"),
                                                AllergyTypeName = p.Field<string>("ALLERGYTYPE"),
                                                AllergenName = p.Field<string>("ALLERGENNAME"),
                                                IsActive = p.Field<int>("IsActive"),
                                            }).ToList();
            return list;
        }

        /// <summary>
        /// to deactivate a Allergy
        /// </summary>
        /// <param name="Id">id of Allergy Master</param>
        /// <returns>success response of deactivate</returns>
        public void AllergyMaster_Delete(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].[ALLERGYMASTER_SP_DELETE]", param);
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }


        /// <summary>
        /// to activated a allergy
        /// </summary>
        /// <param name="noteobj">allergy detail id</param>
        /// <returns>activated patient allergy</returns>
        public IList<MasterAllergyModel> AllergyMaster_Active(MasterAllergyModel noteobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALLERGYMASTER_SP_ACTIVE]", param);
                IList<MasterAllergyModel> list = (from p in dt.AsEnumerable()
                                            select new MasterAllergyModel()
                                            {
                                                flag = p.Field<int>("flag")
                                            }).ToList();
                return list;

            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
    }
}