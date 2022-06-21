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

namespace MyCortex.Admin.Controllers 
{

    [Authorize]
    [CheckSessionOutFilter]
    public class DrugDBMasterController : ApiController
     {
         static readonly IDrugDBMasterRepository repository = new DrugDBMasterRepository();
  

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>
        /// drug strength name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>drug strength name list of a institution</returns>
        [HttpGet]
         public IList<DrugStrengthMasterModel> DrugStrengthList(long Institution_Id)
         {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DrugStrengthMasterModel> model;
             try
             {
                 model = repository.DrugStrengthList(Institution_Id);
                 return model;
             }
             catch (Exception ex)
             {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                 return null;
             }
         }


        /// <summary>
        /// dosage form name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>dosge form name list of a institution</returns>
        [HttpGet]
         public IList<DosageFormMasterModel> DosageFormList(long Institution_Id)
         {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<DosageFormMasterModel> model;
             try
             {
                 model = repository.DosageFormList(Institution_Id);
                 return model;
             }
             catch (Exception ex)
             {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                 return null;
             }
         }


        /// <summary>
        /// drug db master list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        ///  <param name="StartRowNumber">StartRowNumber</param>
        ///   <param name="EndRowNumber">EndRowNumber</param>
        /// <returns>drug db master list of a institution</returns>
        [HttpGet]
         public IList<DrugDBMasterModel> DrugDBMasterList(int IsActive, long InstitutionId,int StartRowNumber, int EndRowNumber)
         {
             IList<DrugDBMasterModel> model;
             model = repository.DrugDBMasterList(IsActive, InstitutionId, StartRowNumber, EndRowNumber);
             return model;
         }
        /// <summary>
        /// details of a DrugDB note
        /// </summary>
        /// <param name="Id">DrugDB Id</param>
        /// <returns>details of a DrugDB</returns>

         [HttpGet]
         public DrugDBMasterModel DrugDBMasterView(int Id)
         {
             DrugDBMasterModel model = new DrugDBMasterModel();
             model = repository.DrugDBMasterView(Id);
             return model;
         }

        [HttpGet]
        //  [CheckSessionOutFilter]
        public List<DrugDBMasterModel> Search_DRUGDB_List(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber, String SearchQuery = null)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            string SearchQuery2 = string.IsNullOrEmpty(SearchQuery) ? "" : SearchQuery.ToLower();
            int lastno = EndRowNumber;
            int StartRowNumber2 = StartRowNumber;
            List<DrugDBMasterModel> model = new List<DrugDBMasterModel>();
            try
            {
                model = repository.Search_DRUGDB_List(IsActive, InstitutionId, StartRowNumber2, lastno, SearchQuery2);
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
            return model;
        }

        /// <summary>
        /// to insert/update drug db master 
        /// </summary>
        /// <param name="obj">details of drug db master</param>
        /// <returns>inserted/updated drug db master</returns>
        public HttpResponseMessage DrugDBMaster_AddEdit([FromBody] DrugDBMasterModel obj)
         {

             IList<DrugDBMasterModel> ModelData = new List<DrugDBMasterModel>();
             DrugDBMasterReturnModels model = new DrugDBMasterReturnModels();
             if (!ModelState.IsValid)
             {
                 model.Status = "False";
                 model.Message = "Invalid data";
                 model.DrugDBMaster = ModelData;
                 return Request.CreateResponse(HttpStatusCode.BadRequest, model);

             }
            
             string messagestr = "";
             try
             {
                 ModelData = repository.DrugDBMaster_AddEdit(obj);
                 if (ModelData.Any(item => item.flag == 1) == true)
                 {
                     messagestr = "Generic Name already exists, cannot be Duplicated";
                     model.ReturnFlag = 0;
                 }
                 else if (ModelData.Any(item => item.flag == 2) == true)
                 {
                     messagestr = "Item Code already exists, cannot be Duplicated";
                     model.ReturnFlag = 0;
                 }
                 else if (ModelData.Any(item => item.flag == 3) == true)
                 {
                     messagestr = "Drug Code already exists, cannot be Duplicated";
                     model.ReturnFlag = 0;
                 }
                 else if (ModelData.Any(item => item.flag == 4) == true)
                 {
                     messagestr = "Drug DB Details created successfully";
                     model.ReturnFlag = 1;
                 }
                 else if (ModelData.Any(item => item.flag == 5) == true)
                 {
                     messagestr = "Drug DB Details updated successfully";
                     model.ReturnFlag = 1;
                 }
                 model.DrugDBMaster = ModelData;
                 model.Message = messagestr;// "User created successfully";
                 model.Status = "True";
                 HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                 return response;
             }
             catch
             {
                 model.Status = "False";
                 model.Message = "Error in creating User";
                 model.DrugDBMaster = ModelData;
                 return Request.CreateResponse(HttpStatusCode.BadRequest, model);
             }
         }

         /// <summary>
         /// to deactivate a drug db master
         /// </summary>
         /// <param name="Id">Id of a drug db master</param>
         /// <returns>success response of deactivation</returns>
         [HttpGet]
         public HttpResponseMessage DrugDBMaster_Delete(int Id)
         {
             if (Id > 0)
             {
                 repository.DrugDBMaster_Delete(Id);
                 HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                 return response;
             }
             else
             {
                 return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
             }
         }

        /// <summary>
        /// to activate a drug db master 
        /// </summary>
        /// <param name="Id">id drug db master </param>
        /// <returns>success/failure response of activation</returns>
        [HttpGet]
         public HttpResponseMessage DrugDBMaster_Active(int Id)
         {
             if (Id > 0)
             {
                 repository.DrugDBMaster_Active(Id);
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