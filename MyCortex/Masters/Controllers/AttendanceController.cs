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

namespace MyCortex.Masters.Controllers
{
   [Authorize]
    public class AttendanceController : ApiController
    {

        static readonly IAttendanceRepository repository = new AttendanceRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>      
        /// Settings  --> Doctor List details (menu) -- > List Page (result)
        /// to get the list of Doctor List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of Doctor list Details DataTable</returns>
        [HttpGet]
        public IList<AttendanceModel> UserType_List(long Institution_Id)
        {
            IList<AttendanceModel> model;
            try
            {
                model = repository.UserType_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Doctor List details (menu) -- > List Page (result)
        /// to get the list of Doctor List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of Doctor list Details DataTable</returns>
 /*       [HttpGet]
        public IList<AttendanceModel> Attendance_List(long Institution_Id)
        {
            IList<AttendanceModel> model;
            try
            {
                model = repository.Attendance_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }*/
        /// <summary>
        /// Admin  --> AV/Chat Settings --> Add/Edit Page
        /// to Insert/Update the entered AV/Chat Settings Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of AV/Chat Settings Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        ///    [HttpPost]
       

        [HttpPost]
        public HttpResponseMessage AttendanceDetails_InsertUpdate(Guid Login_Session_Id,[FromBody] List<AttendanceModel> insobj)
        {
            IList<AttendanceModel> ModelData = new List<AttendanceModel>();
            AttendanceReturnModels model = new AttendanceReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Attendance = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
             long retflag = 0;
            try
            {
                retflag = repository.AttendanceDetails_InsertUpdate(Login_Session_Id,insobj);
                if ((retflag == 1) == true)
                {
                    messagestr = "From Date and To Date already exists for this Doctor ,  cannot be Duplicated";
                    model.ReturnFlag = 1;
                } 
                else if ((retflag == 2) == true)
                {
                    messagestr = "Holiday created successfully";
                    model.ReturnFlag = 1;
                } else if ((retflag == 3) == true) 
                {
                    messagestr = "Holiday updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.Attendance = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Holiday";
                model.Attendance = ModelData;
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
        public IList<AttendanceModel> Attendance_List(int? IsActive, long Institution_Id, Guid Login_Session_Id)
        {
            IList<AttendanceModel> model;
            try
            {
                model = repository.Attendance_List(IsActive, Institution_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
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
        public AttendanceModel Attendance_View(long Id, Guid Login_Session_Id)
        {
            AttendanceModel model = new AttendanceModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Attendance_View(Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /* This is for PatientAllergy Inactive */
        [HttpPost]

        public HttpResponseMessage Attendance_InActive([FromBody] AttendanceModel noteobj)
        {
            IList<AttendanceModel> ModelData = new List<AttendanceModel>();
            AttendanceReturnModels model = new AttendanceReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Attendance = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.Attendance_InActive(noteobj);

                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Holiday deactivated successfully";
                    model.ReturnFlag = 2;
                }

                model.Attendance = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Holiday";
                model.ReturnFlag = 0;
                model.Attendance = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpPost]
        public HttpResponseMessage Attendance_Active([FromBody] AttendanceModel noteobj)
        {
            IList<AttendanceModel> ModelData = new List<AttendanceModel>();
            AttendanceReturnModels model = new AttendanceReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Attendance = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.Attendance_Active(noteobj);

                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Holiday activated successfully";
                    model.ReturnFlag = 2;
                }

                model.Attendance = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Holiday";
                model.ReturnFlag = 0;
                model.Attendance = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

       
        }
}