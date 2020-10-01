using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Repositories;
using MyCortex.Repositories.User;
using MyCortex.User.Model;

namespace MyCortex.Repositories
{
    interface IPatientApprovalRepository
    {
        IList<PatientApprovalModel> PatientApproval_List(long? InstitutionId, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id);
        //PatientApprovalReturnModel PatientApproval_Active(long Id);
        PatientApprovalReturnModel Multiple_PatientApproval_Active(List<PatientApprovalModel> obj);
        long PatientApproval_History_Insert(PatientApprovalModel obj);
        IList<PatientApprovalModel> Get_PatientCount(long InstitutionId);
    }
}