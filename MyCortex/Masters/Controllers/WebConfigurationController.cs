  
using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;
using MyCortex.Provider;

namespace MyCortex.Masters.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class WebConfigurationController : ApiController
    {
        static readonly IWebConfigurationRepository repository = new WebConfigurationRepository();
 
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;


        /// <summary>      
        /// Settings  --> AppoinmentSlot details (menu) -- > List Page (result)
        /// to get the list of AppoinmentSlot for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of AppoinmentSlot list Details DataTable</returns>
        [HttpGet]
        public IList<WebConfigurationModel> WebConfiguration_List(int? IsActive, int? Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<WebConfigurationModel> model;
            try
            {
                model = repository.WebConfiguration_List(IsActive, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> InsWebConfiguration_List -- > List Page (result)
        /// to get the list of InsWebConfiguration_List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of InsWebConfiguration_List list Details DataTable</returns>
        [HttpGet]
        public IList<WebConfigurationModel> InsWebConfiguration_List(int? IsActive, int? Institution_Id)
        {
            //_AppLogger = this.GetType().FullName;
            //_AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<WebConfigurationModel> model;
            try
            {
                model = repository.InsWebConfiguration_List(IsActive, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                //_MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        [HttpGet]
        public WebConfigurationModel WebConfiguration_View(long Id, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            WebConfigurationModel model = new WebConfigurationModel();
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.WebConfiguration_View(Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpGet]
        public IList<WebConfigurationModel> ChronicCodeList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<WebConfigurationModel> model;
            try
            {
                model = repository.ChronicCodeList();
                return model;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpPost]
        public HttpResponseMessage WebConfiguration_InsertUpdate(Guid Login_Session_Id, [FromBody] List<WebConfigurationModel> insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<WebConfigurationModel> ModelData = new List<WebConfigurationModel>();
            WebConfigurationReturnModels model = new WebConfigurationReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Configuration = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            long retflag = 0;
            try
            {
                retflag = repository.WebConfiguration_InsertUpdate(Login_Session_Id, insobj);
                if ((retflag == 2) == true)
                {
                    messagestr = "Configuration created successfully";
                    model.ReturnFlag = 1;
                }
                else if ((retflag == 3) == true)
                {
                    messagestr = "Configuration updated Successfully";
                    model.ReturnFlag = 1;
                }
                model.Configuration = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Configuration";
                model.Configuration = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpPost]
        public HttpResponseMessage Configuration_AddEdit(List<WebConfigurationModel> model)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        int id = repository.Configuration_InsertUpdate(model);
                        return Request.CreateResponse(HttpStatusCode.OK, id);
                    }
                    catch (Exception ex)
                    {
                      _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                    }
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpPost]

        public HttpResponseMessage WebConfiguration_InActive([FromBody] WebConfigurationModel noteobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<WebConfigurationModel> ModelData = new List<WebConfigurationModel>();
            WebConfigurationReturnModels model = new WebConfigurationReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Configuration = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.WebConfiguration_InActive(noteobj);

                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Web Configuration deactivated successfully";
                    model.ReturnFlag = 2;
                }

                model.Configuration = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating WebConfiguration";
                model.ReturnFlag = 0;
                model.Configuration = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpPost]
        public HttpResponseMessage WebConfiguration_Active([FromBody] WebConfigurationModel noteobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<WebConfigurationModel> ModelData = new List<WebConfigurationModel>();
            WebConfigurationReturnModels model = new WebConfigurationReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Configuration = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.WebConfiguration_Active(noteobj);

                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "WebConfiguration activated successfully";
                    model.ReturnFlag = 2;
                }

                model.Configuration = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating WebConfiguration";
                model.ReturnFlag = 0;
                model.Configuration = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


    }

}