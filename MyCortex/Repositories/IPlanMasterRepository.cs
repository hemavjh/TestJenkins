using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;
using MyCortex.Masters.Controllers;
using MyCortex.Admin.Models;


namespace MyCortex.Repositories
{
    interface IPlanMasterRepository
    {
        IList<PlanMasterModel> PlanMaster_AddEdit(Guid Login_Session_Id, PlanMasterModel obj);
        IList<PlanMasterModel> PlanMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber, Guid Login_Session_Id);
        PlanMasterModel PlanMasterView(Guid Login_Session_Id, int Id);

        IList<PlanMasterModel> PayorBasedPlanList(int Id);
        void PlanMaster_Delete(int Id);
        void PlanMaster_Active(int Id);
    }
}