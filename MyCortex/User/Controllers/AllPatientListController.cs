using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MyCortex.User.Model;
  
using System.Security.Cryptography;
using MyCortex.Repositories.Admin;
using MyCortex.Repositories;
using MyCortex.Repositories.User;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{

    [Authorize]
    public class AllPatientListController : ApiController
    {
        static readonly IAllPatientRepository repository = new AllPatientsListRepository();
 

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        /// <summary>
        /// to get All patient details based on the logged in user for the given filter
        /// </summary>
        /// <param name="Doctor_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="UserTypeId"></param>
        /// <returns>All patient details for the logged in user</returns>
        [HttpGet]
        [CheckSessionOutFilter]
        public IList<AllPatientListModel> PatientList(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId,int StartRowNumber,int EndRowNumber,string SearchQuery,string SearchEncryptedQuery)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                IList<AllPatientListModel> model;
                model = repository.PatientList(Doctor_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, UserTypeId, StartRowNumber,EndRowNumber,SearchQuery,SearchEncryptedQuery);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
        [HttpGet]
        [CheckSessionOutFilter]
        public IList<AllPatientListModel> SearchPatientList(long Doctor_Id, string PATIENTNO, string INSURANCEID, string NATIONALITY_ID, string MOBILE_NO, string EMAILID, string FIRSTNAME, string LASTNAME, string MRN, long? UserTypeId, int StartRowNumber, int EndRowNumber, int? AdvanceFilter = 0)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                IList<AllPatientListModel> model;
                model = repository.SearchPatientList(Doctor_Id, PATIENTNO, INSURANCEID, NATIONALITY_ID, MOBILE_NO, EMAILID, FIRSTNAME, LASTNAME, MRN, UserTypeId, StartRowNumber, EndRowNumber, AdvanceFilter);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
        /// <summary>
        /// to get All patient count based on the logged in user for the given filter
        /// </summary>
        /// <param name="Doctor_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        [CheckSessionOutFilter]
        public IList<AllPatientListModel> GetPatientList_Count(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                IList<AllPatientListModel> model;
                model = repository.GetPatientList_Count(Doctor_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, UserTypeId);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
    }
}