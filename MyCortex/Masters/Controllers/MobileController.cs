using MyCortex.Masters.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Masters;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using log4net;
using MyCortex.Repositories.Admin;
using MyCortex.Admin.Models;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    
    public class MobileController : ApiController
    {
        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        static readonly ILanguageSettingsRepository lngrepository = new LanguageSettingsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>      
        /// to get settings configuration of a institution
        /// </summary>          
        /// <returns>settings configuration of a institution</returns>
        [Authorize]
        [CheckSessionOutFilter]
        [HttpGet]
        public HttpResponseMessage Settings(long Institution_Id)
        {
            MobileSettingsModel model = new MobileSettingsModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model.Status = "True";
                model.Error_Code = "";
                model.Message = "Success";
                model.ReturnFlag = 1;
                model.PasswordData = pwdrepository.PasswordPolicy_View(Institution_Id);
                model.Languages = lngrepository.InstituteLanguage_List(Institution_Id);
                return Request.CreateResponse(HttpStatusCode.OK, model); ;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error occured";
                model.Error_Code = "1";
                model.ReturnFlag = 0;
                model.PasswordData = null;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

    }
}
