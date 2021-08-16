using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;
using MyCortex.Masters.Controllers;
using MyCortex.Admin.Models;


namespace MyCortex.Repositories
{
    interface IPayorMasterRepository
    {
        IList<PayorMasterModel> PayorMaster_AddEdit(PayorMasterModel obj);
        IList<PayorMasterModel> PayorMasterList(int IsActive, long InstitutionId, int StartRowNumber, int EndRowNumber);
        PayorMasterModel PayorMasterView(int Id);
        void PayorMaster_Delete(int Id);
        void PayorMaster_Active(int Id);
    }
}