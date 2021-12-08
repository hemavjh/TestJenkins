using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Template.Models
{
    public class SMSTemplateTagModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long Email_TemplateId { get; set; }
        public string TagName { get; set; }
        public int ModifiedUser_Id { get; set; }
        public long Created_By { get; set; }
        public string TagType_Name { get; set; }

        public IList<SMSTemplateDesignModel> SMSTemplateDesignList { get; set; }
    }

    public class SMSTemplateDesignModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public long TemplateType_Id { get; set; }
        public string EmailSubject { get; set; }
        public string EmailTemplate { get; set; }
        public long ModifiedUser_Id { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public string TemplateName { get; set; }
        public string Institution_Name { get; set; }
        public int flag { get; set; }
        public long Type_Id { get; set; }
        public string Type_Name { get; set; }
        public string Result { get; set; }
        public IList<SMSTemplateTagModel> SMSTemplateTagList { get; set; }
    }

}