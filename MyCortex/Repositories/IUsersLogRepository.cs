using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IUsersLogRepository
    {
        IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id,long? User_Id);
        IList<All_UserList> GetAll_UserLists(long InstitutionId);
        IList<EligibilityLogsModel> Eligibility_Logs_List(long? Institution_Id);
        IList<EligibilityLogsModel> Eligibility_Logs_List_With_Patient(long? Institution_Id, long? Patient_Id);
        IList<EligibilityLogsModel> Eligibility_Logs_With_Patient_Filters(long? Institution_Id, long? Patient_Id, DateTime sDate, DateTime eDate, int EligibilityStatus, Guid Login_Session_Id);
        IList<PatientModel> Get_Patient_List(long InstitutionId);
    }        
}