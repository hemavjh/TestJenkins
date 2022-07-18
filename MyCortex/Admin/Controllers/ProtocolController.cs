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

namespace MyCortex.Admin.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class ProtocolController : ApiController
    {
        static readonly IProtocolRepository repository = new ProtocolRepository();
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
        _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>
        /// To insert/update monitoring protocol
        /// </summary>
        /// <param name="insobj">Monitoring protocol details model object</param>
        /// <returns>inserted/updated monitoring protocol detail model</returns>
        [HttpPost]
        public HttpResponseMessage ProtocolMonitoring_AddEdit([FromBody] MonitoringProtocolModel insobj)
        {

            IList<MonitoringProtocolModel> ModelData = new List<MonitoringProtocolModel>();
            MonitoringProtocolReturnModels model = new MonitoringProtocolReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Protocol = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            try
            {
                ModelData = repository.ProtocolMonitoring_AddEdit(insobj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Protocol Name already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Protocol created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "Protocol updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.Protocol = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Protocol";
                model.Protocol = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


        [HttpPost]
        public HttpResponseMessage ProtocolMonitoring_AddEditNew([FromBody] MonitoringProtocolNewModel insobj)
        {

            IList<MonitoringProtocolModel> ModelData = new List<MonitoringProtocolModel>();
            MonitoringProtocolReturnModels model = new MonitoringProtocolReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Protocol = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            try
            {
                ModelData = repository.ProtocolMonitoring_AddEditNew(insobj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Protocol Name already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Protocol created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "Protocol updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.Protocol = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Protocol";
                model.Protocol = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// To insert/update standard protocol
        /// </summary>
        /// <param name="insobj">standard protocol details model object</param>
        /// <returns>inserted/updated standard protocol detail model</returns>
        [HttpPost]
        public HttpResponseMessage StandardProtocol_AddEdit([FromBody] ProtocolModel insobj)
        {

            IList<ProtocolModel> ModelData = new List<ProtocolModel>();
            ProtocolReturnModels model = new ProtocolReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Protocol = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            try
            {
                ModelData = repository.StandardProtocol_AddEdit(insobj);
                //if (ModelData.Any(item => item.flag == 1) == true)
                //{
                //    messagestr = "Institution Name already exists, cannot be Duplicated";
                //    model.ReturnFlag = 0;
                //}
                //else if (ModelData.Any(item => item.flag == 2) == true)
                //{
                //    messagestr = "Institution created successfully";
                //    model.ReturnFlag = 1;
                //}
                //else if (ModelData.Any(item => item.flag == 3) == true)
                //{
                //    messagestr = "Institution updated Successfully";
                //    model.ReturnFlag = 1;
                //}
                model.Protocol = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Monitoring protocol";
                model.Protocol = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// get the list of Standard protocol list
        /// </summary>
        /// <param name="IsActive">Active/Inactive flag</param>
        /// <param name="InstitutionId">Instition Id</param>
        /// <returns>Standard Protocol details list for the given filter</returns>
        [HttpGet]
        public IList<ProtocolModel> StandardProtocol_List(int IsActive,long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ProtocolModel> model;
             try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.StandardProtocol_List(IsActive, InstitutionId);
            return model;
            }
             catch (Exception ex)
             {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
             }
        }


        /// <summary>      
        /// to get the details selected Standared  Protocol
        /// </summary>        
        /// <param name="Id">Id of a Standared  Protocol</param>    
        /// <returns>Standared Protocol Details </returns>
        [HttpGet]
        public IList<ProtocolModel> StandardProtocol_View(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ProtocolModel> model;
             try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.StandardProtocol_View(Id);
            return model;
            }
             catch (Exception ex)
             {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
             }
        }


        /// <summary>
        /// to get details of Standared  Protocol for the given Id
        /// </summary>      
        /// <param name="Id">Id of a Protocol</param>        
        /// <returns>Standared  Protocol Details </returns>
        [HttpGet]
        public MonitoringProtocolModel ProtocolMonitoring_View(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            MonitoringProtocolModel model = new MonitoringProtocolModel();
             try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ProtocolMonitoring_View(Id);
            }
             catch (Exception ex)
             {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
            return model;
        }

        [HttpGet]
        public MonitoringProtocolNewModel ProtocolMonitoringNewView(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            MonitoringProtocolNewModel model = new MonitoringProtocolNewModel();
            try
            {
                _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ProtocolMonitoringNewView(Id);
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
            return model;
        }
        /// <summary>
        /// to get duration type list (daily, weekly, monthly, quarterly, half yearly, yearly)
        /// </summary>
        /// <returns>duration type list model</returns>
        [HttpGet]
        public IList<DurationModel> DurationTypeDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DurationModel> model;
            try
            {
               
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.DurationTypeDetails();
                 return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
           
        }

        /// <summary>
        /// to deactivate a Standared Protocol
        /// </summary>
        /// <param name="Id">Id of the Standard protocol</param>
        /// <returns>deactivated protocol status</returns>
        [HttpGet]
        public HttpResponseMessage ProtocolMonitoring_InActive(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            if (Id > 0)
            {
                try
                {
                repository.ProtocolMonitoring_InActive(Id);
                return Request.CreateResponse(HttpStatusCode.OK);
                }
                catch (Exception ex)
                {
                    _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }
        /// <summary>
        /// activate a monitoring protocol
        /// </summary>
        /// <param name="Id">Id of a monitoring protocol</param>
        /// <returns>activated monitoring protocol status</returns>
        [HttpGet]
        public HttpResponseMessage ProtocolMonitoring_Active(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            if (Id > 0)
            {
                 try
                {
                repository.ProtocolMonitoring_Active(Id);
                return Request.CreateResponse(HttpStatusCode.OK);
                }
                 catch (Exception ex)
                 {
                    _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                 }

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// <summary>
        /// to deactivate a Standared Protocol
        /// </summary>
        /// <param name="Id">Id of the Standard protocol</param>
        /// <returns>deactivated protocol status</returns>
        [HttpGet]
        public HttpResponseMessage ProtocolMonitoring_Delete(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            if (Id > 0)
            {
                try
                {
                    repository.ProtocolMonitoring_Delete(Id);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                    return response;
                }

                catch (Exception ex)
                {
                    _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// <summary>
        /// protocol name list
        /// </summary>
        /// <param name="InstitutionId">protocol name list of a institution from parameter settings</param>
        /// <returns>returns the protocol name list model</returns>
        [HttpGet]
        public IList<MonitoringProtocolModel> ProtocolNameDetails(long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<MonitoringProtocolModel> model;
            try
            {
               
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ProtocolNameDetails(InstitutionId);
                return model;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// protocol name list
        /// </summary>
        /// <param name="InstitutionId">protocol name list of a institution from parameter settings</param>
        /// <returns>returns the protocol name list model</returns>
        [HttpGet]
        public IList<MonitoringProtocolModel> ParameterNameList(long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<MonitoringProtocolModel> model;
            try
            {
               
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ParameterNameList(InstitutionId);
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