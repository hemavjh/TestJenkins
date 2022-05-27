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
    public class ShiftTmingsController : ApiController
    {

        static readonly IShiftTimingsRepository repository = new ShiftTimingsRepository();
 
        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/

        /// <summary>
        /// Admin  --> AV/Chat Settings --> Add/Edit Page
        /// to Insert/Update the entered AV/Chat Settings Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of AV/Chat Settings Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]
        public HttpResponseMessage ShiftTimings_InsertUpdate(Guid Login_Session_Id, [FromBody] ShiftTimingsModel insobj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<ShiftTimingsModel> ModelData = new List<ShiftTimingsModel>();
            ShiftTimingsReturnModels model = new ShiftTimingsReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.ShiftTiming = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.ShiftTimings_InsertUpdate(Login_Session_Id,insobj);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Shift Name already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "Shift Slot created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "Shift Slot updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.ShiftTiming = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                model.Status = "False";
                model.Message = "Error in creating Shift Slot";
                model.ShiftTiming = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>      
        /// Settings  --> AppoinmentSlot details (menu) -- > List Page (result)
        /// to get the list of AppoinmentSlot for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of AppoinmentSlot list Details DataTable</returns>
        [HttpGet]
        public IList<ShiftTimingsModel> ShiftTimings_List(int? IsActive, long InstituteId, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<ShiftTimingsModel> model;
            try
            {
                model = repository.ShiftTimings_List(IsActive, InstituteId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
               /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> AppoinmentSlot Details --> View Page
        /// to get the details in the view page of a selected AppoinmentSlot
        /// </summary>        
        /// <param name="Id">Id of a AppoinmentSlot</param>    
        /// <returns>Populated a AppoinmentSlot Details DataTable </returns>
        [HttpGet]
        public ShiftTimingsModel ShiftTimings_View(long Id, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            ShiftTimingsModel model=new ShiftTimingsModel();
            try
            {
                /*_MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);*/
                model = repository.ShiftTimings_View(Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>
        /// to deactivate a Shift Timings
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>deactivated a Shift Timings</returns>
        [HttpPost]

        public HttpResponseMessage ShiftTimings_InActive([FromBody] ShiftTimingsModel noteobj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<ShiftTimingsModel> ModelData = new List<ShiftTimingsModel>();
            ShiftTimingsReturnModels model = new ShiftTimingsReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.ShiftTiming = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.ShiftTimings_InActive(noteobj);

                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Shift Slot deactivated successfully";
                    model.ReturnFlag = 2;
                }

                model.ShiftTiming = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                model.Status = "False";
                model.Message = "Error in creating Patient Shift Slot";
                model.ReturnFlag = 0;
                model.ShiftTiming = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        /// <summary>
        /// to activated a Shift Timings
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>activated a Shift Timings</returns>
        [HttpPost]
        public HttpResponseMessage ShiftTimings_Active([FromBody] ShiftTimingsModel noteobj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            IList<ShiftTimingsModel> ModelData = new List<ShiftTimingsModel>();
            ShiftTimingsReturnModels model = new ShiftTimingsReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.ShiftTiming = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.ShiftTimings_Active(noteobj);

                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Shift Slot activated successfully";
                    model.ReturnFlag = 2;
                }

                model.ShiftTiming = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                model.Status = "False";
                model.Message = "Error in creating Patient Shift Slot";
                model.ReturnFlag = 0;
                model.ShiftTiming = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>      
        /// Settings  --> Active Appoinment Slot List details (menu) -- > List Page (result)
        /// to get the list of Appoinment Slot List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Appoinment slot</param> 
        /// <param name="Id">Id of a Institution Id</param> 
        /// <param name="Id">Id of a Doctor Id</param> 
        /// <returns>Populated List of Appoinment Slot list Details DataTable</returns>
        [HttpGet]
        public ShiftTimingsModel ActivateShiftTiming_List(long Id, long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            ShiftTimingsModel model = new ShiftTimingsModel();
            try
            {
                model = repository.ActivateShiftTiming_List(Id, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
               /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }

        }


    }
}