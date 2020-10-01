
using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IInstitutionRepository
    {
        InstitutionModel InstitutionDetails_View(long Id);
        IList<InstitutionModel> InstitutionDetails_AddEdit(InstitutionModel obj);
        IList<InstitutionModel> InstitutionDetails_List(long? Id,int? IsActive);
        void InstitutionDetails_Delete(long Id);
        void InstitutionDetails_Active(long Id);
        void Institution_PhotoUpload(byte[] imageFile, int Id);
        PhotoUploadModal Institution_GetPhoto(long Id);  
    }
}
