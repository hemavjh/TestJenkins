using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{

    public class ColorPreferenceModel
    {
        public long ID { get; set; }
        public long InstitutionId { get; set; }
        public long UserId { get; set; }
        public string Primary { get; set; }
        public string Secondary { get; set; }
        public string HeaderBg { get; set; }
        public string HeaderText { get; set; }
        public string TableHeaderBg { get; set; }
        public string TableHeaderText { get; set; }
        public string TableAlternateRowBg { get; set; }
        public string TableAlternateRowText { get; set; }
        public string TableRowHoverBg { get; set; }
        public string TableRowHoverText { get; set; }
        public string LinkText { get; set; }
        public string PositiveBtnBg { get; set; }
        public string PositiveBtnBorder { get; set; }
        public string PositiveBtnText { get; set; }
        public string PositiveHoverBtnBg { get; set; }
        public string PositiveHoverBtnBorder { get; set; }
        public string PositiveHoverBtnText { get; set; }
        public string NegativeBtnBg { get; set; }
        public string NegativeBtnBorder { get; set; }
        public string NegativeBtnText { get; set; }
        public string NegativeHoverBtnBg { get; set; }
        public string NegativeHoverBtnBorder { get; set; }
        public string NegativeHoverBtnText { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public bool IsActive { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public string Menu_Header { get; set; }
        public string Menu_Underline { get; set; }
        public string Sub_Menu_Header { get; set; }
        public string Sub_Menu_Underline { get; set; }
    }

    public class ColorPreferenceReturnModel
    {
        public int ReturnFlag { get; set; }
        public bool Status { get; set; }
        public string Message { get; set; }
        public ColorPreferenceModel ColorPreferences { get; set; }
    }
}