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

namespace MyCortex.Masters.Controllers
{

    [Authorize]
    public class ParameterSettingsController : ApiController
    {
        static readonly IParameterSettingsRepository repository = new ParameterSettingsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// protocol parameter name list
        /// </summary>
        /// <returns>protocol parameter name list</returns>
        [HttpGet]
        public IList<ProtocolParameterMasterModel> ProtocolParameterMasterList()
        {
            IList<ProtocolParameterMasterModel> model;
            model = repository.ProtocolParameterMasterList();
            return model;
        }

        /* This is for list function*/
        [HttpGet]
        public IList<UnitsMasterModel> UnitMasterList()
        {
            IList<UnitsMasterModel> model;
            model = repository.UnitMasterList();
            return model;
        }

        
        /// <summary>
        /// to Insert/Update the entered Parameter Settings details of institution
        /// </summary>
        /// <param name="obj">Parameter Settings details model</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]
        public HttpResponseMessage ParameterSettings_AddEdit(List<ParamaterSettingsModel> model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        int id = repository.ParameterSettings_AddEdit(model);
                        return Request.CreateResponse(HttpStatusCode.OK, id);
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(ex.Message, ex);
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                    }
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>      
        /// to get the details of a std Parameter Settings
        /// </summary>        
        /// <param name="Id">Id of a Parameter Settings</param>    
        /// <returns>details of Parameter settings</returns>
        [HttpGet]
        public IList<ParamaterSettingsModel> ViewEditProtocolParameters(int Id)
        {
            IList<ParamaterSettingsModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ViewEditProtocolParameters(Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }            
        }
        /// <summary>
        /// Parameter mapping unit list of a parameter
        /// </summary>
        /// <param name="Parameter_Id">Parameter Id</param>
        /// <returns> unit list of a parameter</returns>
        [HttpGet]
        public IList<ParamaterSettingsModel> ParameterMappingList(int? Parameter_Id)
        {
            IList<ParamaterSettingsModel> model;
            model = repository.ParameterMappingList(Parameter_Id);
            return model;
        }

    
     }
  }