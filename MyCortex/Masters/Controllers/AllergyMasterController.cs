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
    public class MasterAllergyController : ApiController
    {
        static readonly IMasterAllergyReposistory repository = new MasterAllergyRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);



        /// <summary>
        /// to get allergy type name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        [HttpGet]
        public IList<MasterAllergyTypeModel> MasterAllergyTypeList(long Institution_Id)
        {
            IList<MasterAllergyTypeModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.MasterAllergyTypeList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }


        }

        /// <summary>
        /// to get allergen name list of a Allergy Type and Institution
        /// </summary>
        /// <param name="ALLERGYTYPE_ID"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<MasterAllergyenModel> MasterAllergenList(long ALLERGYTYPE_ID, long Institution_Id)
        {
            IList<MasterAllergyenModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.MasterAllergenList(ALLERGYTYPE_ID, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }
        /// <summary>
        /// to insert/update a Allergy Master list
        /// </summary>
        /// <param name="obj">a Allergy Master detail</param>
        /// <returns>inserted/updated Allergy Master list</returns>
        public HttpResponseMessage MasterAllergy_AddEdit([FromBody] MasterAllergyModel obj)
        {

            IList<MasterAllergyModel> ModelData = new List<MasterAllergyModel>();
            MasterAllergyReturnModels model = new MasterAllergyReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientAllergyDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);

            }

            string messagestr = "";
            try
            {
                ModelData = repository.MasterAllergy_AddEdit(obj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Allergy Code already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Allergy created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    messagestr = "Allergy updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.PatientAllergyDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch
            {
                model.Status = "False";
                model.Message = "Error in creating Allergy";
                model.PatientAllergyDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// a Patient's allergy details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public MasterAllergyModel MasterAllergyView(long Id, Guid Login_Session_Id)
        {
            MasterAllergyModel model = new MasterAllergyModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.MasterAllergyView(Id, Login_Session_Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return model;
        }
    }
}