using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Template.Models
{
    public class EmailTemplateTagModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long Email_TemplateId { get; set; }
        public string TagName { get; set; }
        public int ModifiedUser_Id { get; set; }
        public long Created_By { get; set; }
        public string TagType_Name { get; set; }
        
        public IList<EmailTemplateDesignModel> EmailTemplateDesignList { get; set; }
    }
     public class EmailTemplateDesignModel
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
        public long TemplateAlertType { get; set; }
         public IList<EmailTemplateTagModel> EmailTemplateTagList { get; set; }
    }
     public class EmailTemplateReturnListModels
     {
         public int ReturnFlag { get; set; }
         public string Status { get; set; }
         public string Message { get; set; }
         public IList<EmailTemplateTagModel> EmailTemp { get; set; }
         public IList<EmailTemplateDesignModel> EmailTempData { get; set; }
     }
     public class TagListModels
     {
         public long Id { get; set; }
         public long Institution_Id { get; set; }
         public string Institution_Name { get; set; }
         public string TagTypeName { get; set; }
         public string Description { get; set; }
         public int IsActive { get; set; }
     }
     public class TagListMappingModels
     {
         public long Id { get; set; }
         public long Institution_Id { get; set; }
         public string Institution_Name { get; set; }
         public string TagType_Name { get; set; }         
         public long TagType_Id { get; set; }
         public string TagList { get; set; }
         public string Description { get; set; }
         public string SectionName { get; set; }
         public int IsActive { get; set; }
     }
}