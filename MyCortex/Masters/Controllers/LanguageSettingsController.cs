using log4net;
using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;
using MyCortex.Provider;
using System.Text;
using Newtonsoft.Json;

namespace MyCortex.Masters.Controllers
{
    [System.Web.Http.Authorize]
    [CheckSessionOutFilter]
    public class LanguageSettingsController : ApiController
    {
        static readonly ILanguageSettingsRepository repository = new LanguageSettingsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public IList<LanguageSettingsModel> LanguageSettings_List(int Institution_Id, Guid Login_Session_Id)
        {
            IList<LanguageSettingsModel> model;
            try
            {
                model = repository.LanguageSettings_List(Institution_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpPost]
        public HttpResponseMessage LanguageSettings_AddEdit(List<LanguageSettingsModel> model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        int id = repository.LanguageSettings_InsertUpdate(model);
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
        [ActionName("List")]
        public IList<LanguageKeyValueModel> LanguageKeyValue_List(int Institution_Id, Guid Login_Session_Id)
        {
            IList<LanguageKeyValueModel> model;
            try
            {
                model = repository.LanguageKeyValue_List(Institution_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpGet]
        [ActionName("ListIOS")]
        public HttpResponseMessage LanguageKeyValue_ListIOS(int Institution_Id, Guid Login_Session_Id)
        {
            IList<LanguageKeyValueModel> model;
            StringBuilder jsonOutput = new StringBuilder();
            try
            {
                model = repository.LanguageKeyValue_List(Institution_Id, Login_Session_Id);
                var filter = model.Where(x => x.LANGUAGE_NAME == "en").Select(s => s);

                foreach (LanguageKeyValueModel item in filter)
                {
                    if (jsonOutput.Length > 0)
                        jsonOutput.Append(",");

                    jsonOutput.Append("\"" + item.LANGUAGE_KEY + "\":\"" + item.LANGUAGE_VALUE + "\"");
                }
                var response = JsonConvert.DeserializeObject("{\"lng\":{" + jsonOutput + "}}");

                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

    }
}