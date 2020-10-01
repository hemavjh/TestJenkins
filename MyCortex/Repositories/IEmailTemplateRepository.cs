using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Template.Models;
using MyCortex.Admin.Models;
namespace MyCortex.Repositories
{
    interface IEmailTemplateRepository
    {
    //    long EmailTemplateDesign_AddEdit(EmailTemplateDesignModel obj);
        EmailTemplateDesignModel EmailTemplateDetails_View(long Id);
        IList<EmailTemplateDesignModel> EmailTemplateTag_AddEdit(EmailTemplateDesignModel obj);
        IList<EmailTemplateTagModel> EmailTemplateTag_View(long Id);
        IList<EmailTemplateDesignModel> EmailTemplateTag_List(long Id, int IsActive, long TemplateType_Id);
        void EmailTemplate_Active(int Id);
        void EmailTemplate_Delete(int Id);
        IList<TagListModels> TemplateTag_List(long Institution_Id);
        IList<TagListMappingModels> EmailTemplateTagMapping_List(long Id, long Institution_Id);

    }
}