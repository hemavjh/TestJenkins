using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.User.Model;

namespace MyCortex.Repositories
{
    interface ICareGiverRepository
    {
        IList<CareGiverModel> CareGiver_AssignedPatientList(long CareGiver_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, Guid Login_Session_Id);
        IList<CareGiverModel> GetCount_CareGiver_AssignedPatientList(long CareGiver_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id);
        long CG_Update_ClearAlerts(CareGiverModel obj);
        IList<CG_Patient_NotesModel> GetClearAlertHistory_View(long Patient_Id, Guid Login_Session_Id);
    }   
}