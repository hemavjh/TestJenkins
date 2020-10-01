using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;
using MyCortex.Masters.Controllers;
using MyCortex.Admin.Models;


namespace MyCortex.Repositories
{
    interface IMasterICDReposistory
    {
        IList<CategoryMasterModel> CategoryMasterList(long Institution_Id);
        IList<MasterICDModel> ICDMasterList(int IsActive, long InstitutionId);
        MasterICDModel ICDMasterView(int Id);
        void ICDMaster_Delete(int Id);
        void ICDMaster_Active(int Id);
        IList<MasterICDModel> MasterICD_AddEdit(MasterICDModel obj);
    }
}