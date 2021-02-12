using MyCortex.Masters.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Masters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using Microsoft.Win32;
using System.Threading.Tasks;
using System.Data;
using System.Data.OleDb;
using log4net;
using MyCortex.User.Model;
using MyCortex.Repositories.Admin;
using MyCortex.Admin.Models;
using MyCortex.Utilities;
using System.Configuration;
using MyCortex.Login.Model;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class MobileController : ApiController
    {
        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        static readonly ILanguageSettingsRepository lngrepository = new LanguageSettingsRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        IList<AppConfigurationModel> model;

        /// <summary>      
        /// to get password policy configuration of a institution
        /// </summary>          
        /// <returns>password policy configuration of a institution</returns>
        [HttpGet]
        public HttpResponseMessage Settings(long Institution_Id)
        {
            MobileSettingsModel model = new MobileSettingsModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model.Status = "True";
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
                model.ReturnFlag = 0;
                model.PasswordData = null;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

    }
}
