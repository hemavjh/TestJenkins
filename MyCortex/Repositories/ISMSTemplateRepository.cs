using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Template.Models;
using MyCortex.Admin.Models;
namespace MyCortex.Repositories
{
    interface ISMSTemplateRepository
    {
        //long SMSTemplateDesign_AddEdit(SMSTemplateDesignModel obj);
        //SMSTemplateDesignModel SMSTemplateDetails_View(long Id);

        IList<SMSTemplateDesignModel> SMSTemplateTag_AddEdit(SMSTemplateDesignModel obj);

        //IList<SMSTemplateTagModel> SMSTemplateTag_View(long Id);

        //IList<SMSTemplateDesignModel> SMSTemplateTag_List(long Id, int IsActive, long TemplateType_Id);

        void SMSTemplate_Active(int Id);

        void SMSTemplate_Delete(int Id);

        IList<TagListModels> TemplateTag_List(long Institution_Id);

        IList<TagListMappingModels> SMSTemplateTagMapping_List(long Id, long Institution_Id);

    }
}