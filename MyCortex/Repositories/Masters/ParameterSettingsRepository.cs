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
    public class ParameterSettingsRepository : IParameterSettingsRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public ParameterSettingsRepository()
        {
            db = new ClsDataBase();
        }

        /// <summary>
        /// protocol parameter name list
        /// </summary>
        /// <returns>protocol parameter name list</returns>

        public IList<ProtocolParameterMasterModel> ProtocolParameterMasterList()
        {
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PARAMETERMASTER_SP_LIST");
                List<ProtocolParameterMasterModel> lst = (from p in dt.AsEnumerable()
                                                          select new ProtocolParameterMasterModel()
                                                          {
                                                              Id = p.Field<Int64>("ID"),
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


        /* THIS IS FOR UNIT MASTER LIST FUNCTION */

        public IList<UnitsMasterModel> UnitMasterList()
        {
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].UNITSMASTER_SP_LIST");
                List<UnitsMasterModel> lst = (from p in dt.AsEnumerable()
                                              select new UnitsMasterModel()
                                              {
                                                  Id = p.Field<Int64>("ID"),
                                                  Name = p.Field<string>("NAME"),
                                                  Remarks = p.Field<string>("REMARKS"),
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
        /// Master  -->  Parameter Settings --> Add/Edit Page
        /// to Insert/Update the entered Parameter Settings Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of  Parameter Settings Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        
        public int ParameterSettings_AddEdit(List<ParamaterSettingsModel> obj)
        {
            try
            {
                int retid = 0;
                int executedOnce = 0; 

                foreach (ParamaterSettingsModel item in obj)
                {
                    //if (item.Units_ID != null)
                    {
                        List<DataParameter> param = new List<DataParameter>();
                        param.Add(new DataParameter("@Id", item.Id));
                        param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_ID));
                        // param.Add(new DataParameter("@USER_ID", item.User_Id));
                        param.Add(new DataParameter("@PARAMETER_ID", item.Parameter_ID));
                        param.Add(new DataParameter("@UNITS_ID", item.Units_ID));
                        param.Add(new DataParameter("@DIAGNOSTIC_FLAG", item.Diagnostic_Flag));
                        param.Add(new DataParameter("@MAX_POSSIBLE", item.Max_Possible));
                        param.Add(new DataParameter("@MIN_POSSIBLE", item.Min_Possible));
                        param.Add(new DataParameter("@NORMALRANGE_HIGH", item.NormalRange_High));
                        param.Add(new DataParameter("@NORMALRANGE_LOW", item.NormalRange_low));
                        param.Add(new DataParameter("@AVERAGE", item.Average));
                        param.Add(new DataParameter("@REMARKS", item.Remarks));
                        param.Add(new DataParameter("@Created_by", HttpContext.Current.Session["UserId"]));
                        retid = ClsDataBase.Insert("[MYCORTEX].PARAMETER_UNITSETTINGS_SP_INSERTUPDATE", param, true);


                    }

                }
                foreach (ParamaterSettingsModel item in obj)
                {
                    // execute only once for thie institution
                    if(executedOnce==0)
                    { 
                        List<DataParameter> param = new List<DataParameter>();
                        param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_ID));
                        retid = ClsDataBase.Insert("[MYCORTEX].STANDARD_PARAMETER_PARENT_INSERTUPDATE", param, true);
                        executedOnce = 1;
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



        /// <summary>      
        /// to get the details of a std Parameter Settings
        /// </summary>        
        /// <param name="Id">Id of a Parameter Settings</param>    
        /// <returns>details of Parameter settings</returns>
        
        public IList<ParamaterSettingsModel> ViewEditProtocolParameters(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PARAMETER_UNITSETTINGS_SP_VIEWEDIT", param);
                List<ParamaterSettingsModel> obj = (from p in dt.AsEnumerable()
                                                    select new ParamaterSettingsModel()

                                                    {
                                                        Id = p.Field<long>("Id"),
                                                        Institution_ID = p.Field<long?>("INSTITUTION_ID"),
                                                        Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                        Parameter_ID = p.Field<long?>("PARAMETER_ID"),
                                                        Parameter_Name = p.Field<string>("PARAMETER_NAME"),
                                                        Units_ID = p.Field<long?>("UNITS_ID"),
                                                        Units_Name = p.Field<string>("UNITS_NAME"),
                                                        Diagnostic_Flag = p.Field<bool>("DIAGNOSTIC_FLAG"),
                                                        Max_Possible = p.Field<decimal?>("MAX_POSSIBLE"),
                                                        Min_Possible = p.Field<decimal?>("MIN_POSSIBLE"),
                                                        NormalRange_High = p.Field<decimal?>("NORMALRANGE_HIGH"),
                                                        NormalRange_low = p.Field<decimal?>("NORMALRANGE_LOW"),
                                                        Average = p.Field<decimal?>("AVERAGE"),
                                                        Remarks = p.Field<string>("REMARKS"),
                                                        IsActive = p.Field<int>("ISACTIVE"),
                                                        Created_By = p.Field<int?>("CREATED_BY")
                                                    }).ToList();
                return obj;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Parameter mapping unit list of a parameter
        /// </summary>
        /// <param name="Parameter_Id">Parameter Id</param>
        /// <returns> unit list of a parameter</returns>
        public IList<ParamaterSettingsModel> ParameterMappingList(int? Parameter_Id)
        {
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Parameter_Id", Parameter_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PARAMETERMAPPING_SP_LIST", param);
                List<ParamaterSettingsModel> lst = (from p in dt.AsEnumerable()
                                                    select new ParamaterSettingsModel()
                                                    {
                                                        Id = p.Field<long>("ID"),
                                                        Parameter_ID = p.Field<long>("PARAMETER_ID"),
                                                        Units_ID = p.Field<long>("UNITS_ID"),
                                                        IsActive = p.Field<int>("ISACTIVE"),
                                                        Parameter_Name = p.Field<string>("PARAMETER_NAME"),
                                                        Units_Name = p.Field<string>("UNITS_NAME")
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