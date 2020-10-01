using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using log4net;
using Newtonsoft.Json;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class ReportDetailsController : ApiController
    {
        static readonly IPatientReportDetailsRepositoy repository = new PatientReportDetailsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Audit Report - Table short name list
        /// </summary>
        /// <returns>Audit Report - Table short name list</returns>
        [HttpGet]
        public IList<ReportDetailsModel> TableShortName_List()
        {
            IList<ReportDetailsModel> model;
            try
            {
                model = repository.TableShortName_List();
                return model;
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
        [HttpGet]
        public IList<ReportDetailsModel> PatientReportDetails_List(DateTime Period_From, DateTime Period_To, string ShortNameId, long UserNameId, Guid Login_Session_Id)
        {
            IList<ReportDetailsModel> model;
            try
            {
                model = repository.PatientReportDetails_List(Period_From, Period_To, ShortNameId, UserNameId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        
    }
}