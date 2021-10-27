using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using log4net;
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
using MyCortex.Utilities;

namespace MyCortex.Admin.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class InstitutionController : ApiController
    {
        static readonly IInstitutionRepository repository = new InstitutionRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// To insert/update Instituion Master
        /// </summary>
        /// <param name="insobj">Institution object</param>
        /// <returns>Inserted/Updated Institution object</returns>
        public HttpResponseMessage Institution_AddEdit([FromBody] InstitutionModel insobj)
        {             
                IList<InstitutionModel> ModelData=new List<InstitutionModel>();
                InstitutionReturnModels model = new InstitutionReturnModels();
                if (!ModelState.IsValid)
                {
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Institute = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);                   
                }
                else 
                {
                    if (insobj.Photo != null && insobj.Photo != "")
                    {
                            insobj.Photo_Fullpath = System.Web.HttpContext.Current.Server.MapPath("~/" + insobj.Photo);
                    }
                }
               
                string messagestr = "";
                try
                {
                    ModelData = repository.InstitutionDetails_AddEdit(insobj);
                    if (ModelData.Any(item => item.flag == 1) == true)
                    {
                        messagestr = "Institution Name already exists, cannot be Duplicated";
                        model.ReturnFlag = 0;
                    }
                    else if (ModelData.Any(item => item.flag == 4) == true)
                    {
                        messagestr = "Institution Short Name already exists, cannot be Duplicated";
                        model.ReturnFlag = 0;
                    }
                    else if (ModelData.Any(item => item.flag == 2) == true)
                    {
                        messagestr = "Institution created successfully";
                        model.ReturnFlag = 1;
                    }
                    else if (ModelData.Any(item => item.flag == 3) == true)
                    {
                        messagestr = "Institution updated Successfully";
                        model.ReturnFlag = 1;
                    }
                    if (model.ReturnFlag == 1)
                    {
                        EmailGeneration Generator = new EmailGeneration();
                        EmailGenerateModel MailMessage = new EmailGenerateModel();
                        MailMessage.Institution_Id = -1;
                        MailMessage.MessageToId = insobj.Email;
                        MailMessage.MessageSubject = "Welcome - Mycortex Registration";
                        MailMessage.MessageBody = messagestr;
                        MailMessage.Created_By = 0;
                        MailMessage.UserId = 0;
                        var insData = Generator.SendEmail(MailMessage);
                    }
                    model.Institute = ModelData;
                    model.Message = messagestr;// "User created successfully";
                    model.Status = "True";
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch(Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                    model.Status = "False";
                    model.Message = "Error in creating Institution";
                    model.Institute = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
            }

        /// <summary>
        /// get the list of institution for the filter
        /// </summary>
        /// <param name="Id">Primary key Id of institution</param>
        /// <param name="IsActive">Active / inactive flag</param>
        /// <returns></returns>
        [HttpGet]
        public IList<InstitutionModel> InstitutionDetails_List(long? Id, int? IsActive)
        {
            IList<InstitutionModel> model;
            model = repository.InstitutionDetails_List(Id,IsActive);
            return model;
        }


        /// <summary>      
        /// to get the details of a selected Institution
        /// </summary>        
        /// <param name="Id">Id of a Institution</param>    
        /// <returns>a Institution Details </returns>
        [HttpGet]
        public InstitutionModel InstitutionDetails_View(long Id, Guid Login_Session_Id)
        {
            InstitutionModel model = new InstitutionModel();
            model = repository.InstitutionDetails_View(Id, Login_Session_Id);
            return model;
        }

        /// <summary>
        /// upload a photo blob data in table
        /// </summary>
        /// <param name="Id">Id of institution</param>
        /// <returns>sucess/failure status</returns>
        [HttpPost]
        public List<string> AttachPhoto(int Id)
        {
            var UserId = Id;
            HttpResponseMessage result = null;
            string filePath = "";
            string returnPath = "";
            var docfiles = new List<string>();
            try
            {
                //if (fileName != null)
                {
                    var httpRequest = HttpContext.Current.Request;
                    if (httpRequest.Files.Count > 0)
                    {
                        foreach (string file in httpRequest.Files)
                        {
                            var postedFile = httpRequest.Files[file];
                            byte[] fileData = null;
                            using (var binaryReader = new BinaryReader(postedFile.InputStream))
                            {
                                fileData = binaryReader.ReadBytes(postedFile.ContentLength);
                            }
                            repository.Institution_PhotoUpload(fileData, UserId);

                            docfiles.Add(postedFile.ToString());
                        }
                        result = Request.CreateResponse(HttpStatusCode.OK, docfiles);
                    }
                    else
                    {
                        repository.Institution_PhotoUpload(null, UserId);
                        result = Request.CreateResponse(HttpStatusCode.OK);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return docfiles;
        }
        /// <summary>
        /// get a instituion photo blob
        /// </summary>
        /// <param name="Id">Id of the institution</param>
        /// <returns>Photo blob of a institution </returns>
        [HttpGet]
        public PhotoUploadModal Institution_GetPhoto(long Id)
        {
            PhotoUploadModal model = new PhotoUploadModal();
            // IList<InstitutionModel> model;         
            model = repository.Institution_GetPhoto(Id);
            return model;
        }  

        /// <summary>
        /// Deactivate a institution
        /// </summary>
        /// <param name="Id">Id of a institution</param>
        /// <returns>Deactivated institution details</returns>
        [HttpGet]
        public HttpResponseMessage InstitutionDetails_Delete(long Id)
        {
            if (Id > 0)
            {
                repository.InstitutionDetails_Delete(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }
        /// <summary>
        /// Activate a Institution
        /// </summary>
        /// <param name="Id">Id of the institution</param>
        /// <returns>Activated Institution details</returns>
        [HttpGet]
        public HttpResponseMessage InstitutionDetails_Active(long Id)
        {
            if (Id > 0)
            {
                repository.InstitutionDetails_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        [HttpGet]
        public HttpResponseMessage InstitutionDefaultData_Insert(long Id)
        {
            if (Id > 0)
            {
                repository.InstitutionDefaultData_Insert(Id);
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