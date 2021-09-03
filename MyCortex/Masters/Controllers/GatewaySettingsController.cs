using log4net;
using MyCortex.Admin.Models;
using MyCortex.Provider;
using MyCortex.Repositories;
using MyCortex.Repositories.Masters;
using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace MyCortex.Masters.Controllers
{
    [Authorize]
    public class GatewaySettingsController : ApiController
    {
        static readonly IGatewaySettingsRepository repository = new GatewaySettingsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        
        [HttpGet]
        public IList<GatewaySettingsModel> GatewaySettings_List(long Institution_Id, Guid Login_Session_Id)
        {
            IList<GatewaySettingsModel> model;
            try
            {
                model = repository.GatewaySettings_List(Institution_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet]
        public string GatewaySettings_Details(long InstitutionId, long GatewayId, string GatewayKey)
        {
            IList<GatewaySettingsModel> model;
            try
            {
                model = repository.GatewaySettings_Details(InstitutionId, GatewayId, GatewayKey);
                return model[0].GatewayValue;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpPost]
        [CheckSessionOutFilter]
        public HttpResponseMessage GatewaySettings_Edit(List<GatewaySettingsModel> model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        int id = repository.GatewaySettings_Update(model);
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

        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage GatewayDefault_Save(long InstitutionId, long GatewayTypeId, long GatewayId)
        {
            try
            {
                int id = repository.GatewayDefault_Save(InstitutionId, GatewayTypeId, GatewayId);
                return Request.CreateResponse(HttpStatusCode.OK, id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
    }
}