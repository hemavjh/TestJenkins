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
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]

    public class PlanMasterController : ApiController
    {
        static readonly IPlanMasterRepository repository = new PlanMasterRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// to insert/update a Plan Master list
        /// </summary>
        /// <param name="obj">a Plan Master detail</param>
        /// <returns>inserted/updated Plan Master list</returns>
        public HttpResponseMessage PlanMasterAddEdit(Guid Login_Session_Id, [FromBody] PlanMasterModel obj)
        {

            IList<PlanMasterModel> ModelData = new List<PlanMasterModel>();
            PlanMasterReturnModels model = new PlanMasterReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PlanMasterDetail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.PlanMaster_AddEdit(Login_Session_Id, obj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Plan Master already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Plan Master created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "Plan Master updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.PlanMasterDetail = ModelData;
                model.Message = messagestr;// "";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Plan";
                model.PlanMasterDetail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public IList<PlanMasterModel> PlanList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber, Guid Login_Session_Id)
        {
            IList<PlanMasterModel> model;
            model = repository.PlanMasterList(IsActive, InstitutionId, StartRowNumber, EndRowNumber, Login_Session_Id);
            return model;
        }

        /// <summary>
        /// to get Plan master details of a Plan master
        /// </summary>
        /// <param name="Id">Id of a Plan Master</param>
        /// <returns>Plan master details of a Plan master</returns>
        [HttpGet]
        public PlanMasterModel PlanMasterView(Guid Login_Session_Id, int Id)
        {
            PlanMasterModel model = new PlanMasterModel();
            model = repository.PlanMasterView(Login_Session_Id, Id);
            return model;
        }



        /// <summary>
        /// to deactivate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of deactivate</returns>
        [HttpGet]
        public HttpResponseMessage PlanMaster_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.PlanMaster_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to activate a Plan Master
        /// </summary>
        /// <param name="Id">id of Plan Master</param>
        /// <returns>success response of activate</returns>
        [HttpGet]
        public HttpResponseMessage PlanMaster_Active(int Id)
        {
            if (Id > 0)
            {
                repository.PlanMaster_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpGet]
        public IList<PlanMasterModel> PayorBasedPlan(int Id)
        {
            IList<PlanMasterModel> model;
            model = repository.PayorBasedPlanList(Id);
            return model;
        }

    }
}