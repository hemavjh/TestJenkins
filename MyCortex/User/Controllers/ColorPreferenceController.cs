using log4net;
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
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        [ActionName("List")]
        public ColorPreferenceModel ListColorPreference(long UserId)
        {
            ColorPreferenceModel model = new ColorPreferenceModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ColorPreference_List(UserId);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [HttpPost]
        [ActionName("Save")]
        public HttpResponseMessage SaveColorPreference([FromBody] ColorPreferenceModel insobj)
        {
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
                _logger.Error(ex.Message, ex);
                model.Message = "Error in creating Configuration";
                model.ColorPreferences = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

    }
}
