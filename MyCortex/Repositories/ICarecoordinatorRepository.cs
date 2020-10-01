using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.User.Model;

namespace MyCortex.Repositories
{
    interface ICarecoordinatorRepository
    {
        IList<CareCoordinatorModel> CareCoordinator_PatientList(long Coordinator_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int TypeId, long UserTypeId);
        IList<CareGiverListModel> CareGiver_List(long Id);
        List<AssignCareGiverModel> Assign_CareGiver(AssignCareGiverModel obj);
        IList<GetParameterValueModel> Get_ParameterValue(long PatientId, long UserTypeId, Guid Login_Session_Id);
        IList<AssignCareGiverModel> Care_Coordinatorhistory(long CareGiverId,Guid Login_Session_Id);
        IList<CareCoordinatorModel> Diagnostic_GetPatientList_Count(long Coordinator_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int TypeId, long UserTypeId, Guid Login_Session_Id);
    }
}