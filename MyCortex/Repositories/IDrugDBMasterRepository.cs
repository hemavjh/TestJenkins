using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Admin.Controllers;
using MyCortex.Masters.Models;


namespace MyCortex.Repositories
{
   interface IDrugDBMasterRepository
    {
       IList<DrugStrengthMasterModel> DrugStrengthList(long Institution_Id);
       IList<DosageFormMasterModel> DosageFormList(long Institution_Id);      
       IList<DrugDBMasterModel> DrugDBMasterList(int IsActive, long InstitutionId,int StartRowNumber, int EndRowNumber);
       DrugDBMasterModel DrugDBMasterView(int Id);

       IList<DrugDBMasterModel> DrugDBMaster_AddEdit(DrugDBMasterModel obj);
       void DrugDBMaster_Active(int Id);
       void DrugDBMaster_Delete(int Id);
      
    }
}