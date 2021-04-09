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
using MyCortex.Utilities;
using MyCortex.Masters.Models;


namespace MyCortex.Repositories.Masters
{
    public class PatientReportDetailsRepository : IPatientReportDetailsRepositoy
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

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
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
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
        public IList<ReportDetailsModel> PatientReportDetails_List(DateTime Period_From, DateTime Period_To, string PeriodFromTime, string PeriodToTime, string ShortNameId, long UserNameId, Guid Login_Session_Id,int StartRowNumber,int EndRowNumber)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

    }
}