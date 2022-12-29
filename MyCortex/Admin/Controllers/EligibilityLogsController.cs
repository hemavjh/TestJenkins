using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Web.Http;
using Newtonsoft.Json;
using MyCortex.Masters.Models;
using MyCortex.Provider;
using MyCortex.Utilities;

namespace MyCortex.Admin.Controllers
{
    public class EligibilityLogsController : ApiController
    {
        static readonly IUsersLogRepository repository = new UsersLogRepository();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
        _AppLogger = string.Empty, _AppMethod = string.Empty;
        [HttpGet]
        public IList<EligibilityLogsModel>Eligibility_Logs_List(long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EligibilityLogsModel> model;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Eligibility_Logs_List(InstitutionId);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<EligibilityLogsModel>Eligibility_Logs_List_With_Patient(long InstitutionId, long Patient_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EligibilityLogsModel> model;
            try
            {
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Eligibility_Logs_List_With_Patient(InstitutionId, Patient_Id);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<EligibilityLogsModel> Eligibility_Logs_With_Patient_Filters(long InstitutionId, long Patient_Id, DateTime sDate, DateTime eDate, int EligibilityStatus, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EligibilityLogsModel> model;
            try
            {
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Eligibility_Logs_With_Patient_Filters(InstitutionId, Patient_Id, sDate, eDate, EligibilityStatus, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        [HttpGet]
        public IList<PatientModel>GetPatientList(long InstitutionId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<PatientModel> model;
            try
            {
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Get_Patient_List(InstitutionId);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
    }
}
