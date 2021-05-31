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
        public IList<ReportDetailsModel> PatientReportDetails_List(DateTime Period_From, DateTime Period_To,string PeriodFromTime, string PeriodToTime, int StartRowNumber,int EndRowNumber, string ShortNameId, long UserNameId, Guid Login_Session_Id)
        {
            IList<ReportDetailsModel> model;
            try
            {
                model = repository.PatientReportDetails_List(Period_From, Period_To, PeriodFromTime, PeriodToTime,ShortNameId, UserNameId, Login_Session_Id, StartRowNumber, EndRowNumber);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }



        [AllowAnonymous]
        [HttpPost]
        public HttpResponseMessage AutomatedTestReport_InsertUpdate([FromBody] AutomatedTestReportDetails AutomatedObject)
        {

            AutomatedTestReportDetails ModelData = new  AutomatedTestReportDetails();
            AutomatedTestReportReturnModels model = new AutomatedTestReportReturnModels();
            
             

            string messagestr = "";
            try
            {

                ModelData = repository.AutomatedTestReport_InsertUpdate(AutomatedObject);
                if ((ModelData.Flag == 1) == true)
                {
                    messagestr = "AutomatedReport Id already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if ((ModelData.Flag == 2) == true)
                {
                    messagestr = "AutomatedReport created successfully";
                    model.ReturnFlag = 1;
                }
                else if ((ModelData.Flag == 3) == true)
                {
                    messagestr = "AutomatedReport updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.AutomatedTestReportDetails1 = ModelData;
                model.Message = messagestr;// "Report created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating AutomatedReport";
                model.AutomatedTestReportDetails1 = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }



        [HttpGet]
        public IList<AutomatedTestReportDetails> AutomatedTestReport_View(long rowid = 0)
        {
            try
            {
                IList<AutomatedTestReportDetails> model; 
                model = repository.AutomatedTestReport_View(rowid); 
                return model;
            }catch (Exception ex)
            {
                _logger.Error(ex.Message, ex); 
                return null;
            }
        }


    }
}