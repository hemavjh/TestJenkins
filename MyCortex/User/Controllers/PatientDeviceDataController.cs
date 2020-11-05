using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using MyCortex.User.Models;
using MyCortex.Repositories.User;
using MyCortex.Repositories;
using System.Net.Http;
using System.Net;

namespace MyCortex.User.Controllers
{
    public class PatientDeviceDataController : ApiController
    {
        static readonly IPatientDeviceDataRepository repository = new PatientDeviceDataRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpPost]
        public HttpResponseMessage PatientDeviceData_AddEdit([FromBody] List<PatientDeviceDataModel> insobj)
        {
            IList<PatientDeviceDataModel> ModelData = new List<PatientDeviceDataModel>();
            PatientDeviceDataReturnModels model = new PatientDeviceDataReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.DeviceData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            long retflag = 0;
            try
            {
                retflag = repository.PatientDeviceData_InsertUpdate(insobj);
                if ((retflag == 2) == true)
                {
                    messagestr = "Device Data Inserted successfully";
                    model.ReturnFlag = 1;
                }
                else if ((retflag == 3) == true)
                {
                    messagestr = "Device Data updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.DeviceData = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Appoinment slot";
                model.DeviceData = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
    }
}