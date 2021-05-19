
using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IPatientReportDetailsRepositoy
    {
        IList<ReportDetailsModel> TableShortName_List();
        IList<ReportDetailsModel> PatientReportDetails_List(DateTime Period_From, DateTime Period_To, string PeriodFromTime, string PeriodToTime, string ShortNameId, long UserNameId, Guid Login_Session_Id,int StartRowNumber, int EndRowNumber);
        IList<AutomatedTestReportDetails> AutomatedTestReport_InsertUpdate(long ROWID, long TEST_ID, DateTime? TEST_START_DTTM, DateTime? TEST_END_DTTM, bool TEST_RESULT, string TEST_RESULT_REASON, string TEST_REPORT, string TEST_SESSION = "", string TEST_REF = "");
        AutomatedTestReportDetails AutomatedTestReport_View(long rowid);
    }
}