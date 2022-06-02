using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
  
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.Masters.Models;
 

namespace MyCortex.Repositories.Masters
{
    public class PatientReportDetailsRepository : IPatientReportDetailsRepositoy
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        public PatientReportDetailsRepository()
        {

            db = new ClsDataBase();
        }
        /// <summary>
        /// Audit Report - Table short name list
        /// </summary>
        /// <returns>Audit Report - Table short name list</returns>
        public IList<ReportDetailsModel> TableShortName_List()
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TABLESHORTNAME_REPORT_LIST");
                List<ReportDetailsModel> lst = (from p in dt.AsEnumerable()
                                                select new ReportDetailsModel()
                                                {
                                                    ShortNameId = p.Field<long>("ID"),
                                                    ShortName = p.Field<string>("SHORTNAME"),
                                                    IsActive = p.Field<int>("ISACTIVE")
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
        /// to get Audit Report detail for the selected filter by User action
        /// </summary>
        /// <param name="Period_From">Period From</param>
        /// <param name="Period_To">Period To</param>
        /// <param name="ShortNameId">Table Short Name</param>
        /// <param name="UserNameId">User</param>
        /// <returns></returns>
        public IList<ReportDetailsModel> PatientReportDetails_List(DateTime Period_From, DateTime Period_To, string PeriodFromTime, string PeriodToTime, string ShortNameId, long UserNameId, Guid Login_Session_Id, int StartRowNumber, int EndRowNumber)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                param.Add(new DataParameter("@CREATEDBY", UserNameId));
                param.Add(new DataParameter("@PERIODFROM", Period_From));
                param.Add(new DataParameter("@PERIODTO", Period_To));
                param.Add(new DataParameter("@PeriodFromTime", PeriodFromTime));
                param.Add(new DataParameter("@PeriodToTime", PeriodToTime));
                param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
                param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
                param.Add(new DataParameter("@TABLESHORTNAME", ShortNameId));
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].AUDITTRAIL_REPORTS_SP_LIST", param);

                List<ReportDetailsModel> lst = (from p in dt.AsEnumerable()
                                                select new ReportDetailsModel()
                                                {
                                                    TotalRecord = p.Field<string>("TotalRecords"),
                                                    ShortName = p.Field<string>("SHORTNAME"),
                                                    TableDisplayName = p.Field<string>("TABLE_DISPLAYNAME"),
                                                    NewValue = p.Field<string>("NEWVALUE"),
                                                    OldValue = p.Field<string>("OLDVALUE"),
                                                    Details = p.Field<string>("DETAILS"),
                                                    ColumnOrder = p.Field<string>("COLUMNORDER"),
                                                    Action = p.Field<string>("ACTION"),
                                                    ActionDateTime = p.Field<DateTime>("ACTIONDATETIME")

                                                }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        public  AutomatedTestReportDetails AutomatedTestReport_InsertUpdate(AutomatedTestReportDetails AutomatedObject)
        {
            string flag = "";
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ROWID", AutomatedObject.ROWID));
            param.Add(new DataParameter("@TEST_ID", AutomatedObject.TEST_ID));
            param.Add(new DataParameter("@TEST_START_DTTM", AutomatedObject.TEST_START_DTTM));
            param.Add(new DataParameter("@TEST_END_DTTM", AutomatedObject.TEST_END_DTTM));
            param.Add(new DataParameter("@TEST_RESULT", AutomatedObject.TEST_RESULT));
            param.Add(new DataParameter("@TEST_RESULT_REASON", AutomatedObject.TEST_RESULT_REASON));
            param.Add(new DataParameter("@TEST_REPORT", AutomatedObject.TEST_REPORT));
            param.Add(new DataParameter("@TEST_SESSION", AutomatedObject.TEST_SESSION));
            param.Add(new DataParameter("@TEST_REF", AutomatedObject.TEST_REF));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.AUTOMATEDTEST_REPORT_INSERTUPDATE", param);

                 AutomatedTestReportDetails  INS = (from p in dt.AsEnumerable()
                                                         select
                                                         new AutomatedTestReportDetails()
                                                         {
                                                             TEST_ID = p.Field<long>("TEST_ID"),
                                                             TEST_START_DTTM = p.Field<DateTime?>("TEST_START_DTTM"),
                                                             TEST_END_DTTM = p.Field<DateTime?>("TEST_END_DTTM"),
                                                             TEST_RESULT = p.Field<bool>("TEST_RESULT"),
                                                             TEST_RESULT_REASON = p.Field<string>("TEST_RESULT_REASON"),
                                                             TEST_REPORT = p.Field<string>("TEST_REPORT"),
                                                             Flag = p.Field<int>("flag")
                                                         }).FirstOrDefault();
                return INS;

            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }

        }

        public IList<AutomatedTestReportDetails> AutomatedTestReport_View(long Rowid)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            AutomatedTestReportReturnModels modal;

            int flag = 0;

            List<DataParameter> param = new List<DataParameter>(); 
            
             
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                DataTable dt;
                if (Rowid > 0)
                {
                    param.Add(new DataParameter("@ROWID", Rowid));
                    dt = ClsDataBase.GetDataTable("MYCORTEX.AUTOMATEDTEST_REPORT_VIEW", param);
                }
                else
                {
                      dt = ClsDataBase.GetDataTable("MYCORTEX.AUTOMATEDTEST_REPORT_VIEW");
                }

                IList<AutomatedTestReportDetails> INS = (from p in dt.AsEnumerable()
                                                         select
                                                         new AutomatedTestReportDetails()
                                                         {
                                                             ROWID = p.Field<long>("ROWID"),
                                                             TEST_ID = p.Field<long>("TEST_ID"),
                                                             TEST_START_DTTM = p.Field<DateTime?>("TEST_START_DTTM"),
                                                             TEST_END_DTTM = p.Field<DateTime?>("TEST_END_DTTM"),
                                                             TEST_RESULT = p.Field<bool>("TEST_RESULT"),
                                                             TEST_RESULT_REASON = p.Field<string>("TEST_RESULT_REASON"),
                                                             TEST_REPORT = p.Field<string>("TEST_REPORT"),
                                                             TEST_SESSION = p.Field<string>("TEST_SESSION"),
                                                             TEST_REF = p.Field<string>("TEST_REF"),
                                                             CREATED_DTTM = p.Field<DateTime?>("CREATED_DTTM")
                                                         }).ToList(); 

                return INS;

            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }

        }
    }
}