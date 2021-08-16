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

    public class PayorMasterController : ApiController
    {
        static readonly IPayorMasterRepository repository = new PayorMasterRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// to insert/update a Payor Master list
        /// </summary>
        /// <param name="obj">a Payor Master detail</param>
        /// <returns>inserted/updated Payor Master list</returns>
        public HttpResponseMessage PayorMaster_AddEdit([FromBody] PayorMasterModel obj)
        {

            IList<PayorMasterModel> ModelData = new List<PayorMasterModel>();
            PayorMasterReturnModels model = new PayorMasterReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PayorMasterDetail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.PayorMaster_AddEdit(obj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Payor Master already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Payor Master created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "Payor Master updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.PayorMasterDetail = ModelData;
                model.Message = messagestr;// "";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating ICD 10";
                model.PayorMasterDetail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public IList<PayorMasterModel> PayorList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber)
        {
            IList<PayorMasterModel> model;
            model = repository.PayorMasterList(IsActive, InstitutionId, StartRowNumber, EndRowNumber);
            return model;
        }

        /// <summary>
        /// to get Payor master details of a Payor master
        /// </summary>
        /// <param name="Id">Id of a Payor Master</param>
        /// <returns>Payor master details of a Payor master</returns>
        [HttpGet]
        public PayorMasterModel PayorMasterView(int Id)
        {
            PayorMasterModel model = new PayorMasterModel();
            model = repository.PayorMasterView(Id);
            return model;
        }



        /// <summary>
        /// to deactivate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of deactivate</returns>
        [HttpGet]
        public HttpResponseMessage PayorMaster_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.PayorMaster_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to activate a Payor Master
        /// </summary>
        /// <param name="Id">id of Payor Master</param>
        /// <returns>success response of activate</returns>
        [HttpGet]
        public HttpResponseMessage PayorMaster_Active(int Id)
        {
            if (Id > 0)
            {
                repository.PayorMaster_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

    }
}