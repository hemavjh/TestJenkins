using MyCortex.Admin.Models;
using MyCortex.Repositories;
  
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Web.Http;
using Newtonsoft.Json;
using MyCortex.User.Models;
using MyCortex.Repositories.User;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{
    // [Authorize]
    [CheckSessionOutFilter]
    public class AppoinmentSlotController : ApiController
    {
        static readonly IAppoinmentSlotRepository repository = new AppoinmentSlotRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>
        /// Settings -->AppoinmentSlot Details --> Add/Edit Page
        /// to Insert/Update the entered AppoinmentSlot Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of AppoinmentSlot Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]
        public HttpResponseMessage AppoinmentSlot_AddEdit([FromBody] List<AppoinmentSlotModel> insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<AppoinmentSlotModel> ModelData = new List<AppoinmentSlotModel>();
            AppoinmentSlotReturnModels model = new AppoinmentSlotReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Appoinment = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
           
            string messagestr = "";
            long retflag = 0;
            try
            {
                retflag = repository.AppoinmentSlot_AddEdit(insobj);
                if ((retflag == 1) == true)
                {
                    messagestr = "Appointment slot already created, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if ((retflag == 2) == true)
                {
                    messagestr = "Appointment slot created successfully";
                    model.ReturnFlag = 1;
                }
                else if ((retflag == 3) == true)
                {
                    messagestr = "Appointment slot updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.Appoinment = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Appoinment slot";
                model.Appoinment = ModelData;
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
        public IList<AppoinmentSlotModel> AppoinmentSlot_List(int? IsActive, long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<AppoinmentSlotModel> model;
            try
            {
                model = repository.AppoinmentSlot_List(IsActive, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
        public AppoinmentSlotModel AppoinmentSlot_View(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            AppoinmentSlotModel model = new AppoinmentSlotModel();
            try
            {
                model = repository.AppoinmentSlot_View(Id);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// Settings - AppoinmentSlot Details List - Action - Inactive
        /// Selected AppoinmentSlot details to be deactivated  by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related AppoinmentSlot details to inactivate from AppoinmentSlot database</returns>
      
                    [HttpPost]
        public HttpResponseMessage AppoinmentSlot_Delete([FromBody] AppoinmentSlotModel noteobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<AppoinmentSlotModel> ModelData = new List<AppoinmentSlotModel>();
            AppoinmentSlotReturnModels model = new AppoinmentSlotReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Appoinment = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.AppoinmentSlot_Delete(noteobj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Appointment Slot deactivated successfully";
                    model.ReturnFlag = 2;
                }
                model.Appoinment = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Patient Shift Slot";
                model.ReturnFlag = 0;
                model.Appoinment = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

                    /// <summary>
                    /// Settings - AppoinmentSlot Details List - Action - Active
                    /// Selected AppoinmentSlot details to be activated again by Id
                    /// </summary>
                    /// <param name="Id">Id</param>
                    /// <returns>Selected ID related AppoinmentSlot details to activate again from AppoinmentSlot database</returns>

                [HttpPost]
                public HttpResponseMessage AppoinmentSlot_Active([FromBody] AppoinmentSlotModel noteobj)
                {
                     _AppLogger = this.GetType().FullName;
                    _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
                    IList<AppoinmentSlotModel> ModelData = new List<AppoinmentSlotModel>();
                    AppoinmentSlotReturnModels model = new AppoinmentSlotReturnModels();
                    if (!ModelState.IsValid)
                    {
                        model.Status = "False";
                        model.Message = "Invalid data";
                        model.Appoinment = ModelData;
                        return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                    }
                    string messagestr = "";
                    try
                    {
                        ModelData = repository.AppoinmentSlot_Active(noteobj);
                        if (ModelData.Any(item => item.flag == 1) == true)
                        {
                            messagestr = "Appointment Slot activated successfully";
                            model.ReturnFlag = 2;
                        }
                        model.Appoinment = ModelData;
                        model.Message = messagestr;
                        model.Status = "True";
                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                        return response;
                    }
                    catch (Exception ex)
                    {
                      _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                        model.Status = "False";
                        model.Message = "Error in creating Patient Shift Slot";
                        model.ReturnFlag = 0;
                        model.Appoinment = ModelData;
                        return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                    }
                }

       
     
        /// <summary>      
        /// Settings  --> Doctor List details (menu) -- > List Page (result)
        /// to get the list of Doctor List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of Doctor list Details DataTable</returns>
        [HttpGet]
        public IList<DoctorAppoinmentSlotModel> Doctors_List(long? Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DoctorAppoinmentSlotModel> model;
            try
            {
                model = repository.Doctors_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<DoctorAppoinmentSlotModel> CG_Doctors_List(long? Institution_Id, long? CC_CG)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DoctorAppoinmentSlotModel> model;
            try
            {
                model = repository.CG_Doctors_List(Institution_Id, CC_CG);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
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
        public AppoinmentSlotModel ActivateDoctorSlot_List(long Id, long Institution_Id, long Doctor_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            AppoinmentSlotModel model = new AppoinmentSlotModel();
            try
            {
                model = repository.ActivateDoctorSlot_List(Id, Institution_Id, Doctor_Id);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
           
        }
    }
}
    