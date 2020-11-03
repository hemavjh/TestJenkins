using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.User.Model;
namespace MyCortex.Repositories
{
    interface IAllPatientRepository
    {
        IList<AllPatientListModel> PatientList(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId,int StartRowNumber,int EndRowNumber);
        IList<AllPatientListModel> GetPatientList_Count(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId);
    }
}