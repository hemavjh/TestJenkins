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
  
using Newtonsoft.Json;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class MasterICDController : ApiController
    {
        static readonly IMasterICDReposistory repository = new MasterICDRepository();
 
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        /// <summary>
        /// ICD category master name list
        /// </summary>
        /// <param name="Institution_Id">Institution_Id</param>
        /// <returns>ICD category master name list</returns>
        [HttpGet]
        public IList<CategoryMasterModel> CategoryMasterList(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<CategoryMasterModel> model;
            try
            {
                model = repository.CategoryMasterList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get ICD master list of a institution
        /// </summary>
        /// <param name="IsActive">active flag</param>
        /// <param name="InstitutionId">Institution Id</param>
        ///  <param name="StartRowNumber">Institution Id</param>
        ///   <param name="EndRowNumber">Institution Id</param>
        /// <returns>ICD master list of a institution</returns>
        [HttpGet]
        public IList<MasterICDModel> ICDMasterList(int IsActive, long InstitutionId,int StartRowNumber, int EndRowNumber)
        {
            IList<MasterICDModel> model;
            model = repository.ICDMasterList(IsActive, InstitutionId, StartRowNumber, EndRowNumber);
            return model;
        }

        /// <summary>
        /// to get ICD master details of a ICD master
        /// </summary>
        /// <param name="Id">Id of a ICD Master</param>
        /// <returns>ICD master details of a ICD master</returns>
        [HttpGet]
        public MasterICDModel ICDMasterView(int Id)
        {
            MasterICDModel model = new MasterICDModel();
            model = repository.ICDMasterView(Id);
            return model;
        }

        /// <summary>
        /// to insert/update a ICD Master list
        /// </summary>
        /// <param name="obj">a ICD Master detail</param>
        /// <returns>inserted/updated ICD Master list</returns>
        public HttpResponseMessage MasterICD_AddEdit([FromBody] MasterICDModel obj)
        {

            IList<MasterICDModel> ModelData = new List<MasterICDModel>();
            MasterICDReturnModels model = new MasterICDReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.MasterICD = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.MasterICD_AddEdit(obj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "ICD Code already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "ICD 10 created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "ICD 10 updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.MasterICD = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating ICD 10";
                model.MasterICD = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to deactivate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of deactivate</returns>
        [HttpGet]
        public HttpResponseMessage ICDMaster_Delete(int Id)
        {
            if (Id > 0)
            {
                repository.ICDMaster_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// to activate a ICD Master
        /// </summary>
        /// <param name="Id">id of ICD Master</param>
        /// <returns>success response of activate</returns>
        [HttpGet]
        public HttpResponseMessage ICDMaster_Active(int Id)
        {
            if (Id > 0)
            {
                repository.ICDMaster_Active(Id);
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