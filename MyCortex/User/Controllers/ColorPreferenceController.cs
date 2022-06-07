  
using MyCortex.Provider;
using MyCortex.Repositories;
using MyCortex.Repositories.User;
using MyCortex.User.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyCortex.User.Controllers
{
    [CheckSessionOutFilter]
    public class ColorPreferenceController : ApiController
    {
        static readonly IColorPreferenceRepository repository = new ColorPreferenceRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        [HttpGet]
        [ActionName("List")]
        public HttpResponseMessage ListColorPreference(long UserId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ColorPreferenceModel model = new ColorPreferenceModel();
            ColorPreferenceReturnModel result = new ColorPreferenceReturnModel();
            
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.ColorPreference_List(UserId);
                if (model != null)
                {
                    result.Status = true;
                    result.Message = "Success";
                    result.ReturnFlag = 1;
                    result.ColorPreferences = model;
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                }
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateResponse(HttpStatusCode.BadRequest, result);
            }
        }

        [HttpPost]
        [ActionName("Save")]
        public HttpResponseMessage SaveColorPreference([FromBody] ColorPreferenceModel insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ColorPreferenceModel ModelData = new ColorPreferenceModel();
            ColorPreferenceReturnModel model = new ColorPreferenceReturnModel();
            
            if (!ModelState.IsValid)
            {
                model.Message = "Invalid data";
                model.ColorPreferences = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            if(insobj.UserId == 0)
            {
                model.Message = "UserId is missing";
                model.ColorPreferences = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            if (insobj.InstitutionId == 0)
            {
                model.Message = "Institution is missing";
                model.ColorPreferences = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            try
            {
                model = repository.ColorPreference_InsertUpdate(insobj);
                if ((model.ReturnFlag == 1) == true)
                {
                    model.Message = "Color preference created successfully";
                    model.ReturnFlag = 1;
                    model.Status = true;
                }
                else if ((model.ReturnFlag == 2) == true)
                {
                    model.Message = "Color preference updated Successfully";
                    model.ReturnFlag = 1;
                    model.Status = true;
                }
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Message = "Error in creating Configuration";
                model.ColorPreferences = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

    }
}
