  
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
    public class LanguageSettingsController : ApiController
    {
        static readonly ILanguageSettingsRepository repository = new LanguageSettingsRepository();
 
        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/

        [AllowAnonymous]
        [HttpGet]
        public IList<LanguageSettingsModel> LanguageSettings_List(long Institution_Id, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<LanguageSettingsModel> model;
            try
            {
                model = repository.LanguageSettings_List(Institution_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
               /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        [HttpPost]
        [CheckSessionOutFilter]
        public HttpResponseMessage LanguageSettings_AddEdit(List<LanguageSettingsModel> model)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
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
                      /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
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
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage LanguageDefault_Save(long Institution_Id, int Language_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                int id = repository.LanguageDefault_Save(Institution_Id, Language_Id);
                return Request.CreateResponse(HttpStatusCode.OK, id);
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [ActionName("InstituteLanguages")]
        public IList<InstituteLanguageModel> InstituteLanguage_List(long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            try
            {
                IList<InstituteLanguageModel> model;
                model = repository.InstituteLanguage_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [ActionName("List")]
        public HttpResponseMessage LanguageKeyValue_List(int Language_Id = 1, long Institution_Id = 0)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            StringBuilder jsonOutput = new StringBuilder();
            try
            {
                var response = repository.LanguageKeyValue_List(Language_Id, Institution_Id);

                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

    }
}