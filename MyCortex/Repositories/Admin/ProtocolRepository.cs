using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;
namespace MyCortex.Repositories.Admin
{
    public class ProtocolRepository :IProtocolRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public ProtocolRepository()
        {
            db = new ClsDataBase();

        }

        /// <summary>
        /// To insert/update standard protocol
        /// </summary>
        /// <param name="insobj">standard protocol details model object</param>
        /// <returns>inserted/updated standard protocol detail model</returns>
        public IList<ProtocolModel> StandardProtocol_AddEdit(ProtocolModel obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@PROTOCOL_ID", obj.Protocol_Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@PARAMETER_ID", obj.Parameter_Id));
            param.Add(new DataParameter("@UNITS_ID", obj.Units_Id));
            param.Add(new DataParameter("@DIAG_HIGHMAX", obj.Diag_HighMax_One));
            param.Add(new DataParameter("@DIAG_HIGHMIN", obj.Diag_HighMin_One));
            param.Add(new DataParameter("@DIAG_MEDIUMMAX", obj.Diag_MediumMax_One));
            param.Add(new DataParameter("@DIAG_MEDIUMMIN", obj.Diag_MediumMin_One));
            param.Add(new DataParameter("@DIAG_LOWMAX", obj.Diag_LowMax_One));
            param.Add(new DataParameter("@DIAG_LOWMIN", obj.Diag_LowMin_One));
            param.Add(new DataParameter("@DIAG_HIGHMAX", obj.Diag_HighMax_Two));
            param.Add(new DataParameter("@DIAG_HIGHMIN", obj.Diag_HighMin_Two));
            param.Add(new DataParameter("@DIAG_MEDIUMMAX", obj.Diag_MediumMax_Two));
            param.Add(new DataParameter("@DIAG_MEDIUMMIN", obj.Diag_MediumMin_Two));
            param.Add(new DataParameter("@DIAG_LOWMAX", obj.Diag_LowMax_Two));
            param.Add(new DataParameter("@DIAG_LOWMIN", obj.Diag_LowMin_Two));
            param.Add(new DataParameter("@COM_DURATIONTYPE", obj.Com_DurationType));
            param.Add(new DataParameter("@COMP_DURATION", obj.Comp_Duration));
            param.Add(new DataParameter("@COMP_HIGH", obj.Comp_High));
            param.Add(new DataParameter("@COMP_MEDIUM", obj.Comp_Medium));
            param.Add(new DataParameter("@COMP_LOW", obj.Comp_Low));
            param.Add(new DataParameter("@ISACTIVE", obj.Isactive));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOL_MONITORING_SETTINGS_SP_INSERTUPDATE", param);

            IList<ProtocolModel> INS = (from p in dt.AsEnumerable()
                                           select
                                           new ProtocolModel()
                                           {
                                               Id = p.Field<int>("Id"),
                                               Protocol_Id = p.Field<long?>("PROTOCOL_ID"),
                                               Institution_Id = p.Field<int>("INSTITUTION_ID"),
                                               Parameter_Id = p.Field<long>("PARAMETER_ID"),
                                               Units_Id = p.Field<long>("UNITS_ID"),
                                               Diag_HighMax_One = p.Field<decimal?>("DIAG_HIGHMAX_ONE"),
                                               Diag_HighMin_One = p.Field<decimal?>("DIAG_HIGHMIN_ONE"),
                                               Diag_MediumMax_One = p.Field<decimal?>("DIAG_MEDIUMMAX_ONE"),
                                               Diag_MediumMin_One = p.Field<decimal?>("DIAG_MEDIUMMIN_ONE"),
                                               Diag_LowMax_One = p.Field<decimal?>("DIAG_LOWMAX_ONE"),
                                               Diag_LowMin_One = p.Field<decimal?>("DIAG_LOWMIN_ONE"),
                                               Diag_HighMax_Two = p.Field<decimal?>("DIAG_HIGHMAX_TWO"),
                                               Diag_HighMin_Two = p.Field<decimal?>("DIAG_HIGHMIN_TWO"),
                                               Diag_MediumMax_Two = p.Field<decimal?>("DIAG_MEDIUMMAX_TWO"),
                                               Diag_MediumMin_Two = p.Field<decimal?>("DIAG_MEDIUMMIN_TWO"),
                                               Diag_LowMax_Two = p.Field<decimal?>("DIAG_LOWMAX_TWO"),
                                               Diag_LowMin_Two = p.Field<decimal?>("DIAG_LOWMIN_TWO"),
                                               Com_DurationType = p.Field<long>("COM_DURATIONTYPE"),
                                               Comp_Duration = p.Field<int?>("COMP_DURATION"),
                                               Comp_High = p.Field<int?>("COMP_HIGH"),
                                               Comp_Medium = p.Field<int?>("COMP_LOW"),
                                               Comp_Low = p.Field<int?>("ISACTIVE"),
                                               Created_By = p.Field<int>("CREATED_BY"),
                                               flag = p.Field<int>("flag"),
                                           }).ToList();
            return INS;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// get the list of Standard protocol list
        /// </summary>
        /// <param name="IsActive">Active/Inactive flag</param>
        /// <param name="InstitutionId">Instition Id</param>
        /// <returns>Standard Protocol details list for the given filter</returns>
        public IList<ProtocolModel> StandardProtocol_List(int IsActive,long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOL_MONITORING_SP_LIST", param);
            List<ProtocolModel> list = (from p in dt.AsEnumerable()
                                        select new ProtocolModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               ProtocolName = p.Field<string>("PROTOCOLNAME"),
                                               Isactive = p.Field<int?>("ISACTIVE")
                                           }).ToList();
            return list;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// to get the details selected Standared  Protocol
        /// </summary>        
        /// <param name="Id">Id of a Standared  Protocol</param>    
        /// <returns>Standared Protocol Details </returns>
        public IList<ProtocolModel> StandardProtocol_View(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOL_MONITORING_SP_VIEW", param);
            List<ProtocolModel> INS = (from p in dt.AsEnumerable()
                                    select
                                    new ProtocolModel()
                                    {
                                        Id = p.Field<long>("Id"),
                                        Protocol_Id = p.Field<long?>("PROTOCOL_ID"),
                                        ProtocolName = p.Field<string>("PROTOCOLNAME"),
                                        Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                        Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                        Parameter_Id = p.Field<long?>("PARAMETER_ID"),
                                        ParameterName = p.Field<string>("PARAMETERNAME"),
                                        Units_Id = p.Field<long?>("UNITS_ID"),
                                        UnitsName = p.Field<string>("UNITSNAME"),
                                        Com_DurationType = p.Field<long?>("COM_DURATIONTYPE"),
                                        DurationName = p.Field<string>("DURATIONNAME"),
                                        Diag_HighMax_One = p.Field<decimal?>("DIAG_HIGHMAX_ONE"),
                                        Diag_HighMin_One = p.Field<decimal?>("DIAG_HIGHMIN_ONE"),
                                        Diag_MediumMax_One = p.Field<decimal?>("DIAG_MEDIUMMAX_ONE"),
                                        Diag_MediumMin_One = p.Field<decimal?>("DIAG_MEDIUMMIN_ONE"),
                                        Diag_LowMax_One = p.Field<decimal?>("DIAG_LOWMAX_ONE"),
                                        Diag_LowMin_One = p.Field<decimal?>("DIAG_LOWMIN_ONE"),
                                        Diag_HighMax_Two = p.Field<decimal?>("DIAG_HIGHMAX_TWO"),
                                        Diag_HighMin_Two = p.Field<decimal?>("DIAG_HIGHMIN_TWO"),
                                        Diag_MediumMax_Two = p.Field<decimal?>("DIAG_MEDIUMMAX_TWO"),
                                        Diag_MediumMin_Two = p.Field<decimal?>("DIAG_MEDIUMMIN_TWO"),
                                        Diag_LowMax_Two = p.Field<decimal?>("DIAG_LOWMAX_TWO"),
                                        Diag_LowMin_Two = p.Field<decimal?>("DIAG_LOWMIN_TWO"),
                                        Comp_Duration = p.Field<int?>("COMP_DURATION"),
                                        Comp_High = p.Field<int?>("COMP_HIGH"),
                                        Comp_Medium = p.Field<int?>("COMP_MEDIUM"),
                                        Comp_Low = p.Field<int?>("COMP_LOW"),
                                        //  ISACTIVE = p.Field<int?>("ISACTIVE"),
                                        Created_By = p.Field<long>("CREATED_BY"),
                                        NormalRange_High = p.Field<decimal?>("NORMALRANGE_HIGH"),
                                        NormalRange_Low = p.Field<decimal?>("NORMALRANGE_LOW"),
                                    }).ToList();
            return INS;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<DiagCompMonitoringProtocol> StandardProtocol_View_NEW(long pId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", pId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                List<DiagCompMonitoringProtocol> lm = new List<DiagCompMonitoringProtocol>();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOL_MONITORING_SP_VIEW", param);
                DataTable dtco = ClsDataBase.GetDataTable("[MYCORTEX].[COMP_ALERT_MONITORING_PROTOCOL_SP_VIEW]", param);
                DataTable dtdu = ClsDataBase.GetDataTable("[MYCORTEX].[COMP_ALERT_MONITORING_PROTOCOL_DURATION_DATETIME_SP_VIEW]", param);
                List<Diag_ProtocolModel> INS = (from p in dt.AsEnumerable()
                                           select
                                           new Diag_ProtocolModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               Protocol_Id = p.Field<long?>("PROTOCOL_ID"),
                                               ProtocolName = p.Field<string>("PROTOCOLNAME"),
                                               Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                               Parameter_Id = p.Field<long?>("PARAMETER_ID"),
                                               ParameterName = p.Field<string>("PARAMETERNAME"),
                                               Units_Id = p.Field<long?>("UNITS_ID"),
                                               UnitsName = p.Field<string>("UNITSNAME"),
                                               Diag_HighMax_One = p.Field<decimal?>("DIAG_HIGHMAX_ONE"),
                                               Diag_HighMin_One = p.Field<decimal?>("DIAG_HIGHMIN_ONE"),
                                               Diag_MediumMax_One = p.Field<decimal?>("DIAG_MEDIUMMAX_ONE"),
                                               Diag_MediumMin_One = p.Field<decimal?>("DIAG_MEDIUMMIN_ONE"),
                                               Diag_LowMax_One = p.Field<decimal?>("DIAG_LOWMAX_ONE"),
                                               Diag_LowMin_One = p.Field<decimal?>("DIAG_LOWMIN_ONE"),
                                               Diag_HighMax_Two = p.Field<decimal?>("DIAG_HIGHMAX_TWO"),
                                               Diag_HighMin_Two = p.Field<decimal?>("DIAG_HIGHMIN_TWO"),
                                               Diag_MediumMax_Two = p.Field<decimal?>("DIAG_MEDIUMMAX_TWO"),
                                               Diag_MediumMin_Two = p.Field<decimal?>("DIAG_MEDIUMMIN_TWO"),
                                               Diag_LowMax_Two = p.Field<decimal?>("DIAG_LOWMAX_TWO"),
                                               Diag_LowMin_Two = p.Field<decimal?>("DIAG_LOWMIN_TWO"),
                                               Created_By = p.Field<long>("CREATED_BY"),
                                               NormalRange_High = p.Field<decimal?>("NORMALRANGE_HIGH"),
                                               NormalRange_Low = p.Field<decimal?>("NORMALRANGE_LOW"),
                                           }).ToList();
                //List<Comp_ProtocolModel> lcomp = (from p in dtco.AsEnumerable()
                //                                select
                //                                new Comp_ProtocolModel()
                //                                {
                //                                    Id = p.Field<long>("ID"),
                //                                    Parameter_Id = p.Field<long>("PARAMETER_ID"),
                //                                    Created_By = p.Field<long>("CREATED_BY"),
                //                                    Com_DurationType = p.Field<long>("DURATIONTYPE"),
                //                                    occur_inter = p.Field<int>("ISINTERVAL") == 1 ? true : false,
                //                                    occur_inter_val = p.Field<int>("NO_OF_INPUT"),
                //                                    starttime = p.Field<DateTime>("STARTDATETIME"),
                //                                    endtime = p.Field<DateTime>("ENDDATETIME"),
                //                                    selectedDays = p.Field<string>("SELECTED_DAYS"),
                //                                    Isactive = p.Field<int>("ISACTIVE")
                //                                }).ToList();

                List<Comp_ProtocolModel> lcomp = new List<Comp_ProtocolModel>();
                for(int i = 0; i < dtco.Rows.Count; i++)
                {
                    Comp_ProtocolModel comp = new Comp_ProtocolModel();
                    comp.Id = Convert.ToInt64(dtco.Rows[i][0].ToString());
                    comp.Parameter_Id = Convert.ToInt64(dtco.Rows[i][3].ToString());
                    comp.Created_By = Convert.ToInt64(dtco.Rows[i][11].ToString());
                    comp.Com_DurationType = Convert.ToInt64(dtco.Rows[i][4].ToString());
                    comp.DurationName = dtco.Rows[i][13].ToString();
                    comp.occur_inter = (Convert.ToInt32(dtco.Rows[i][5].ToString()) == 1)? true: false;
                    comp.occur_inter_val = Convert.ToInt32(dtco.Rows[i][6].ToString());
                    comp.starttime = Convert.ToDateTime(dtco.Rows[i][7].ToString());
                    comp.endtime = Convert.ToDateTime(dtco.Rows[i][8].ToString());
                    comp.selectedDays = dtco.Rows[i][9].ToString();
                    comp.Isactive = Convert.ToInt32(dtco.Rows[i][10].ToString());
                    comp.ParameterName = dtco.Rows[i][12].ToString();
                    lcomp.Add(comp);
                }

                List <MonitorDateTime> dur = (from p in dtdu.AsEnumerable()
                                             select
                                             new MonitorDateTime()
                                             {
                                                 id = p.Field<long>("ID"),
                                                 time = p.Field<DateTime>("MONITORING_DT"),
                                             }).ToList();

                for(int i = 0; i < lcomp.Count; i++)
                {
                    List<MonitorDateTime> mo = new List<MonitorDateTime>();
                    for (int j = 0; j < dur.Count; j++)
                    {
                        if (dur[j].id == lcomp[i].Id)
                        {
                            mo.Add(dur[j]);
                            lcomp[i].duration_list = mo;
                        }
                    }
                }

                DiagCompMonitoringProtocol mp = new DiagCompMonitoringProtocol();
                mp.Comp_ParameterSettingslist = lcomp;
                mp.Diag_ParameterSettingslist = INS;
                lm.Add(mp);
                return lm;
            }
            catch (Exception ex)
            {

                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /* THIS IS FOR ADD EDIT FUNCTION */
        /// <summary>
        /// StandardProtocol  --> Standard Protocol Details --> Add/Edit Page
        /// to Insert/Update the entered Standard Protocol Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of Standard Protocol Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public IList<MonitoringProtocolModel> ProtocolMonitoring_AddEdit(MonitoringProtocolModel obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            int InsSubModId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@NAME", obj.Protocol_Name));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOLDETAILS_MONITORING_SP_INSERTUPDATE", param);
                DataRow dr = dt.Rows[0];
                var InsertId = (dr["Id"].ToString());
                var Insflag = (dr["flag"].ToString());
                IList<MonitoringProtocolModel> INS = (from p in dt.AsEnumerable()
                                                      select
                                                      new MonitoringProtocolModel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                                          Protocol_Name = p.Field<string>("NAME"),
                                                          IsActive = p.Field<int>("ISACTIVE"),
                                                          Created_By = p.Field<long>("CREATED_BY"),
                                                          flag = p.Field<int>("flag"),
                                                      }).ToList();

                if (Insflag!= "1")
                {
                    foreach (ProtocolModel item in obj.ChildModuleList)
                    {
                        List<DataParameter> param1 = new List<DataParameter>();

                        param1.Add(new DataParameter("@Id", item.Id));
                        param1.Add(new DataParameter("@PROTOCOL_ID", InsertId));
                        param1.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                        param1.Add(new DataParameter("@PARAMETER_ID", item.Parameter_Id));
                        param1.Add(new DataParameter("@UNITS_ID", item.Units_Id));
                        param1.Add(new DataParameter("@DIAG_HIGHMAX_ONE", item.Diag_HighMax_One));
                        param1.Add(new DataParameter("@DIAG_HIGHMIN_ONE", item.Diag_HighMin_One));
                        param1.Add(new DataParameter("@DIAG_MEDIUMMAX_ONE", item.Diag_MediumMax_One));
                        param1.Add(new DataParameter("@DIAG_MEDIUMMIN_ONE", item.Diag_MediumMin_One));
                        param1.Add(new DataParameter("@DIAG_LOWMAX_ONE", item.Diag_LowMax_One));
                        param1.Add(new DataParameter("@DIAG_LOWMIN_ONE", item.Diag_LowMin_One));
                        param1.Add(new DataParameter("@DIAG_HIGHMAX_TWO", item.Diag_HighMax_Two));
                        param1.Add(new DataParameter("@DIAG_HIGHMIN_TWO", item.Diag_HighMin_Two));
                        param1.Add(new DataParameter("@DIAG_MEDIUMMAX_TWO", item.Diag_MediumMax_Two));
                        param1.Add(new DataParameter("@DIAG_MEDIUMMIN_TWO", item.Diag_MediumMin_Two));
                        param1.Add(new DataParameter("@DIAG_LOWMAX_TWO", item.Diag_LowMax_Two));
                        param1.Add(new DataParameter("@DIAG_LOWMIN_TWO", item.Diag_LowMin_Two));
                        param1.Add(new DataParameter("@COMP_DURATIONTYPE", item.Com_DurationType));
                        param1.Add(new DataParameter("@COMP_DURATION", item.Comp_Duration));
                        param1.Add(new DataParameter("@COMP_HIGH", item.Comp_High));
                        param1.Add(new DataParameter("@COMP_MEDIUM", item.Comp_Medium));
                        param1.Add(new DataParameter("@COMP_LOW", item.Comp_Low));
                        //  param1.Add(new DataParameter("@ISACTIVE", item.ISACTIVE));
                        param1.Add(new DataParameter("@CREATED_BY", item.Created_By));
                        param1.Add(new DataParameter("@NORMALRANGE_HIGH", item.NormalRange_High));
                        param1.Add(new DataParameter("@NORMALRANGE_LOW", item.NormalRange_Low));
                        InsSubModId = ClsDataBase.Insert("[MYCORTEX].PROTOCOL_MONITORING_SETTINGS_SP_INSERTUPDATE", param1, true);
                    }

                    List<DataParameter> param2 = new List<DataParameter>();
                    param2.Add(new DataParameter("@Id", InsertId));
                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLPROTOCOLMONITORING_HISTORY_SP_INSERTUPDATE", param2, true);
                        
                }
                
                return INS;
            }
             catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<MonitoringProtocolModel> ProtocolMonitoring_AddEditNew(MonitoringProtocolNewModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            int InsSubModId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@NAME", obj.Protocol_Name));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOLDETAILS_MONITORING_SP_INSERTUPDATE", param);
                DataRow dr = dt.Rows[0];
                var InsertId = (dr["Id"].ToString());
                var Insflag = (dr["flag"].ToString());
                IList<MonitoringProtocolModel> INS = (from p in dt.AsEnumerable()
                                                      select
                                                      new MonitoringProtocolModel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                                          Protocol_Name = p.Field<string>("NAME"),
                                                          IsActive = p.Field<int>("ISACTIVE"),
                                                          Created_By = p.Field<long>("CREATED_BY"),
                                                          flag = p.Field<int>("flag"),
                                                      }).ToList();

                if (Insflag != "1")
                {
                    foreach (DiagCompMonitoringProtocol item2 in obj.ChildModuleList)
                    {
                        foreach (Comp_ProtocolModel item in item2.Comp_ParameterSettingslist)
                        {
                            DataTable dur = new DataTable();
                            dur.Columns.Add("SNO", typeof(int));
                            dur.Columns.Add("MONITORING_DT", typeof(DateTime));
                            int i = 0;
                            foreach(MonitorDateTime mor in item.duration_list)
                            {
                                i = i + 1;
                                dur.Rows.Add(i, mor.time);
                            }

                            List<DataParameter> param1 = new List<DataParameter>();

                            param1.Add(new DataParameter("@Id", item.Id));
                            param1.Add(new DataParameter("@PROTOCOL_ID", InsertId));
                            param1.Add(new DataParameter("@PARAMETER_ID", item.Parameter_Id));
                            param1.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
                            param1.Add(new DataParameter("@DURATIONTYPE", item.Com_DurationType));
                            param1.Add(new DataParameter("@ISACTIVE", item.Isactive));
                            param1.Add(new DataParameter("@CREATED_BY", item.Created_By));
                            param1.Add(new DataParameter("@ISINTERVAL", item.occur_inter));
                            param1.Add(new DataParameter("@NO_OF_INPUT", item.occur_inter_val));
                            param1.Add(new DataParameter("@MONITORING_DT", dur));
                            param1.Add(new DataParameter("@STARTDATETIME", item.starttime));
                            param1.Add(new DataParameter("@ENDDATETIME", item.endtime));
                            param1.Add(new DataParameter("@SELECTED_DAYS", item.selectedDays));
                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].PROTOCOL_COMP_ALERT_MONITORING_SETTINGS_SP_INSERTUPDATE", param1, true);
                        }

                        foreach (Diag_ProtocolModel item in item2.Diag_ParameterSettingslist)
                        {
                            if (item.Parameter_Id > 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@Id", item.Id));
                                param1.Add(new DataParameter("@PROTOCOL_ID", InsertId));
                                param1.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                                param1.Add(new DataParameter("@PARAMETER_ID", item.Parameter_Id));
                                param1.Add(new DataParameter("@UNITS_ID", item.Units_Id));
                                param1.Add(new DataParameter("@DIAG_HIGHMAX_ONE", item.Diag_HighMax_One));
                                param1.Add(new DataParameter("@DIAG_HIGHMIN_ONE", item.Diag_HighMin_One));
                                param1.Add(new DataParameter("@DIAG_MEDIUMMAX_ONE", item.Diag_MediumMax_One));
                                param1.Add(new DataParameter("@DIAG_MEDIUMMIN_ONE", item.Diag_MediumMin_One));
                                param1.Add(new DataParameter("@DIAG_LOWMAX_ONE", item.Diag_LowMax_One));
                                param1.Add(new DataParameter("@DIAG_LOWMIN_ONE", item.Diag_LowMin_One));
                                param1.Add(new DataParameter("@DIAG_HIGHMAX_TWO", item.Diag_HighMax_Two));
                                param1.Add(new DataParameter("@DIAG_HIGHMIN_TWO", item.Diag_HighMin_Two));
                                param1.Add(new DataParameter("@DIAG_MEDIUMMAX_TWO", item.Diag_MediumMax_Two));
                                param1.Add(new DataParameter("@DIAG_MEDIUMMIN_TWO", item.Diag_MediumMin_Two));
                                param1.Add(new DataParameter("@DIAG_LOWMAX_TWO", item.Diag_LowMax_Two));
                                param1.Add(new DataParameter("@DIAG_LOWMIN_TWO", item.Diag_LowMin_Two));
                                //param1.Add(new DataParameter("@COMP_DURATIONTYPE", item.Com_DurationType));
                                //param1.Add(new DataParameter("@COMP_DURATION", item.Comp_Duration));
                                //param1.Add(new DataParameter("@COMP_HIGH", item.Comp_High));
                                //param1.Add(new DataParameter("@COMP_MEDIUM", item.Comp_Medium));
                                //param1.Add(new DataParameter("@COMP_LOW", item.Comp_Low));
                                //  param1.Add(new DataParameter("@ISACTIVE", item.ISACTIVE));
                                param1.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                param1.Add(new DataParameter("@NORMALRANGE_HIGH", item.NormalRange_High));
                                param1.Add(new DataParameter("@NORMALRANGE_LOW", item.NormalRange_Low));
                                InsSubModId = ClsDataBase.Insert("[MYCORTEX].PROTOCOL_MONITORING_SETTINGS_SP_INSERTUPDATE", param1, true);
                            }
                        }
                    }

                    List<DataParameter> param2 = new List<DataParameter>();
                    param2.Add(new DataParameter("@Id", InsertId));
                    InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLPROTOCOLMONITORING_HISTORY_SP_INSERTUPDATE", param2, true);

                }

                return INS;
            }
            catch (Exception ex)
            {

                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get details of Standared  Protocol for the given Id
        /// </summary>      
        /// <param name="Id">Id of a Protocol</param>        
        /// <returns>Standared  Protocol Details </returns>
        public MonitoringProtocolModel ProtocolMonitoring_View(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOLDETAILS_MONITORING_SP_VIEW", param);
            MonitoringProtocolModel INS = (from p in dt.AsEnumerable()
                                         select
                                         new MonitoringProtocolModel()
                                         {
                                             Id = p.Field<long>("Id"),
                                             Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                             Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                             Protocol_Name = p.Field<string>("PROTOCOL_NAME"),
                                             IsActive = p.Field<int>("ISACTIVE"),
                                             Created_By = p.Field<long>("CREATED_BY"),                                            
                                         }).FirstOrDefault();
                INS.ChildModuleList = StandardProtocol_View(INS.Id);
                return INS;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public MonitoringProtocolNewModel ProtocolMonitoringNewView(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOLDETAILS_MONITORING_SP_VIEW", param);
                MonitoringProtocolNewModel INS = (from p in dt.AsEnumerable()
                                                  select
                                                  new MonitoringProtocolNewModel()
                                                  {
                                                      Id = p.Field<long>("Id"),
                                                      Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                                      Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                      Protocol_Name = p.Field<string>("PROTOCOL_NAME"),
                                                      IsActive = p.Field<int>("ISACTIVE"),
                                                      Created_By = p.Field<long>("CREATED_BY"),
                                                  }).FirstOrDefault();
                //INS.ChildModuleList = StandardProtocol_View(INS.Id);
                INS.ChildModuleList = StandardProtocol_View_NEW(INS.Id);
                return INS;
            }
            catch (Exception ex)
            {

                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get duration type list (daily, weekly, monthly, quarterly, half yearly, yearly)
        /// </summary>
        /// <returns>duration type list model</returns>
        public IList<DurationModel> DurationTypeDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DURATIONDETAILS_SP_LIST");
                List<DurationModel> lst = (from p in dt.AsEnumerable()
                                           select new DurationModel()
                                                          {
                                                              Id = p.Field<long>("ID"),
                                                              Name = p.Field<string>("NAME"),
                                                              IsActive = p.Field<int>("IsActive")
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
        /// to deactivate a Standared Protocol
        /// </summary>
        /// <param name="Id">Id of the Standard protocol</param>
        /// <returns>deactivated protocol status</returns>
        public void ProtocolMonitoring_InActive(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            ClsDataBase.Update("[MYCORTEX].PROTOCOL_MONITORING_SP_INACTIVE", param);
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }

        /// <summary>
        /// activate a monitoring protocol
        /// </summary>
        /// <param name="Id">Id of a monitoring protocol</param>
        /// <returns>activated monitoring protocol status</returns>
        public void ProtocolMonitoring_Active(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
            ClsDataBase.Update("[MYCORTEX].PROTOCOL_MONITORING_SP_ACTIVE", param);
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
 
            }

        }

        /// <summary>
        /// to deactivate a Standared Protocol
        /// </summary>
        /// <param name="Id">Id of the Standard protocol</param>
        /// <returns>deactivated protocol status</returns>
        public void ProtocolMonitoring_Delete(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].PROTOCOL_MONITORING_SP_DELETE", param);
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }

        /// <summary>
        /// protocol name list
        /// </summary>
        /// <param name="InstitutionId">protocol name list of a institution from parameter settings</param>
        /// <returns>returns the protocol name list model</returns>
        public IList<MonitoringProtocolModel> ProtocolNameDetails(long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOLNAME_SP_LIST", param);
                List<MonitoringProtocolModel> lst = (from p in dt.AsEnumerable()
                                                     select new MonitoringProtocolModel()
                                           {
                                               Id = p.Field<long>("ID"),
                                               Protocol_Name = p.Field<string>("NAME"),
                                               IsActive = p.Field<int>("IsActive")
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
        /// protocol name list
        /// </summary>
        /// <param name="InstitutionId">protocol name list of a institution from parameter settings</param>
        /// <returns>returns the protocol name list model</returns>
        public IList<MonitoringProtocolModel> ParameterNameList(long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].STANDARDPARAMETERNAME_SP_LIST", param);
                List<MonitoringProtocolModel> lst = (from p in dt.AsEnumerable()
                                                     select new MonitoringProtocolModel()
                                                     {
                                                         Id = p.Field<long>("PARAMETER_ID"),
                                                         Name = p.Field<string>("NAME"),
                                                         IsActive = p.Field<int>("IsActive")
                                                     }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }      
            
    }
}   