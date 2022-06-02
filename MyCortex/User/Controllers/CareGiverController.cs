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
using MyCortex.Repositories;
using MyCortex.Repositories.User;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class CareGiverController : ApiController
    {
        static readonly ICareGiverRepository repository = new CareGiverRepository();
 

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/

        /// <summary>     
        /// to get assigned patient list to a caregiver on CG login     
        /// </summary>
        /// <returns>assigned patient list to a caregiver</returns>
        [HttpGet]
        public IList<CareGiverModel> CareGiver_AssignedPatientList(long CareGiver_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                IList<CareGiverModel> model;
                model = repository.CareGiver_AssignedPatientList(CareGiver_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>
        /// to clear assign CG alert 
        /// </summary>
        /// <param name="obj">CG assigned alert Id</param>
        /// <returns></returns>
        public HttpResponseMessage CG_Update_ClearAlerts(CareGiverModel obj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                long retflag = repository.CG_Update_ClearAlerts(obj);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, retflag);
                return response;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to get CG assigned patient history list
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns>CG assigned patient history list</returns>
        [HttpGet]
        public IList<CG_Patient_NotesModel> AlertHistory_View(long Patient_Id, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                IList<CG_Patient_NotesModel> model;
                model = repository.GetClearAlertHistory_View(Patient_Id, Login_Session_Id);
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