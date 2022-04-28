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
using MyCortex.Notification;
using MyCortex.Notification.Models;

namespace MyCortex.Admin.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class InstitutionSubscriptionController : ApiController
    {
        static readonly IInstitutionSubscriptionRepository repository = new InstitutionSubscriptionRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        /// <summary>
        /// Institution subscription details of a institution subscription
        /// </summary>
        /// <param name="Id">Id of the Institution subscription</param>
        /// <returns>Institution Subscription details object</returns>
        [HttpGet]
        public InstitutionModel InstitutionDetailList(long Id)
        {
            InstitutionModel model = new InstitutionModel();
            model = repository.InstitutionDetailList(Id);
            return model;
        }
        /// <summary>
        /// To insert/update a institution subscription details
        /// </summary>
        /// <param name="insobj"></param>
        /// <returns></returns>
        public HttpResponseMessage InstitutionSubscription_AddEdit(Guid Login_Session_Id, [FromBody] InstitutionSubscriptionModel insobj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<InstitutionSubscriptionModel> ModelData = new List<InstitutionSubscriptionModel>();
            InstitutionSubscriptionReturnModels model = new InstitutionSubscriptionReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Institute = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.InstitutionSubscription_AddEdit(Login_Session_Id,insobj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    model.ReturnFlag = 0;
                    messagestr = "Subscription already exists for this Contract Period, cannot create";
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    model.ReturnFlag = 1;
                    messagestr = "Subscription created Successfully";
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    model.ReturnFlag = 1;
                    messagestr = "Subscription updated Successfully";
                }
                if (model.ReturnFlag == 1)
                {
                    string Event_Code = "SUBSCRIPTION_CREATION";
                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    if (Event_Code == "SUBSCRIPTION_CREATION")
                    {
                        EmailList = AlertEventReturn.InstitutionEvent((long)insobj.Institution_Id, (long)insobj.Id);
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, insobj.Institution_Id, -1, EmailList);
                    }
                }
                model.Institute = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch(Exception ex)
            {
 
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Subscription";
                model.Institute = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        
        /// <summary>t
        /// to get the Module master list 
        /// </summary>
        /// <returns>module module list object</returns>
        [HttpGet]
        public IList<ModuleMasterModel> ModuleNameList()
        {
            IList<ModuleMasterModel> model;
            model = repository.ModuleNameList();
            return model;
        }

        [HttpGet]
        public IList<LanguageMasterModel> LanguageNameList()
        {
            IList<LanguageMasterModel> model;
            model = repository.LanguageNameList();
            return model;
        }
        [HttpGet]
        public IList<GatewayMasterModel> PaymentModule_List()
        {
            IList<GatewayMasterModel> model;
            model = repository.PaymentModule_List();
            return model;
        }

        /// <summary>
        /// list of institution subscription details for the given filter
        /// </summary>
        /// <param name="Id">Subscription Id</param>
        /// <returns>institution subscription details list object</returns>
        [HttpGet]
        public IList<InstitutionSubscriptionModel> InstitutionSubscription_List(long? Id, Guid Login_Session_Id)
        {
            IList<InstitutionSubscriptionModel> model;
            model = repository.InstitutionSubscription_List(Id, Login_Session_Id);
            return model;
        }

        /// <summary>
        /// details of a selected Institution Subscription
        /// </summary>
        /// <param name="Id">Id of a Institution Subscription</param>
        /// <returns>Subscription details object</returns>
        [HttpGet]
        public InstitutionSubscriptionModel InstitutionSubscriptionDetails_View(long Id, Guid Login_Session_Id)
        {
            InstitutionSubscriptionModel model = new InstitutionSubscriptionModel();
            model = repository.InstitutionSubscriptionDetails_View(Id, Login_Session_Id);
            return model;
        }
        /// <summary>
        /// to get the current subscription details of a Institution
        /// </summary>
        /// <param name="Id">Institution Id</param>
        /// <returns>Subscription details object</returns>
        [HttpGet]
        public InstitutionSubscriptionModel InstitutionSubscriptionActiveDetails_View(long Id, Guid Login_Session_Id)
        {
            InstitutionSubscriptionModel model = new InstitutionSubscriptionModel();
            model = repository.InstitutionSubscriptionActiveDetails_View(Id, Login_Session_Id);
            return model;
        }
    }
}