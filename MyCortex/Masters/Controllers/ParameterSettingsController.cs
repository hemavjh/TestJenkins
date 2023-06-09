﻿using MyCortex.Repositories;
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
  
using Newtonsoft.Json;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;
using MyCortex.Provider;
using Newtonsoft.Json.Linq;
using System.Text;

namespace MyCortex.Masters.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class ParameterSettingsController : ApiController
    {
        static readonly IParameterSettingsRepository repository = new ParameterSettingsRepository();
 
        private MyCortexLogger _MyLogger = new MyCortexLogger();
       string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
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
                      _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>      
        /// to get the details of a std Parameter Settings
        /// </summary>        
        /// <param name="Id">Id of a Parameter Settings</param>    
        /// <returns>details of Parameter settings</returns>
        [HttpGet]
        public IList<ParamaterSettingsModel> ViewEditProtocolParameters(int Id, int Unitgroup_Type = 1)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<ParamaterSettingsModel> model;
            try
            {
                 
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ViewEditProtocolParameters(Id, Unitgroup_Type);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }            
        }
        /// <summary>
        /// Parameter mapping unit list of a parameter
        /// </summary>
        /// <param name="Parameter_Id">Parameter Id</param>
        /// <returns> unit list of a parameter</returns>
        [HttpGet]
        public IList<ParamaterSettingsModel> ParameterMappingList(int? Parameter_Id, int? Institution_Id = 0, int Unitgroup_Type = 0, int Language_Id=1)
        {
            IList<ParamaterSettingsModel> model;
            model = repository.ParameterMappingList(Parameter_Id, Institution_Id, Unitgroup_Type,Language_Id);
            return model;
        }

        [HttpGet]
        public IList<ParamaterSettingsModel> AllParameterMappingList()
        {
            IList<ParamaterSettingsModel> model;
            model = repository.AllParameterMappingList();
            return model;
        }

        [HttpGet]
        public bool UnitGroupPreferenceSave(Int64 institutionId, int preferenceType)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                return repository.UnitGroupPreferenceSave(institutionId, preferenceType);
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return false;
            }
        }

        [HttpGet]
        public HttpResponseMessage UnitGroupPreferenceGet(Int64 institutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                var prefType = repository.UnitGroupPreferenceGet(institutionId);
                string resp = "{\"PreferenceType\":  \'" + prefType + "\' }";
                var jObject = JObject.Parse(resp);
                var response = Request.CreateResponse(HttpStatusCode.OK);
                response.Content = new StringContent(jObject.ToString(), Encoding.UTF8, "application/json");
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }


    }
  }