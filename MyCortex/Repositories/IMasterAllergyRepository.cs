using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;
using MyCortex.Masters.Controllers;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories
{
    interface IMasterAllergyReposistory
    {
        /*IList<CategoryMasterModel> CategoryMasterList(long Institution_Id);
        IList<MasterAllergyModel> AllergyMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber);
        MasterICDModel ICDMasterView(int Id);
        void AllergyMaster_Delete(int Id);
        void AllergyMaster_Active(int Id);*/
        IList<MasterAllergyModel> MasterAllergy_AddEdit(MasterAllergyModel obj);
        IList<MasterAllergyTypeModel> MasterAllergyTypeList(long Institution_Id);
        IList<MasterAllergyenModel> MasterAllergenList(long ALLERGYTYPE_ID, long Institution_Id);
        MasterAllergyModel MasterAllergyView(long Id, Guid Login_Session_Id);
        void AllergyMaster_Delete(int Id);

        IList<MasterAllergyModel> AllergyMaster_Active(MasterAllergyModel noteobj);

    }
}