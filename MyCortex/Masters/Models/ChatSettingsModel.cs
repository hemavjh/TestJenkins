using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class ChatSettingsModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long FromUser_TypeId { get; set; }
        public long ToUser_TypeId { get; set; }
        public string FromUser { get; set; }
        public string ToUser { get; set; }
        public int Flag { get; set; }
        public int IsActive { get; set; }
        public long Created_by { get; set; }
        public DateTime Created_dt { get; set; }
        public int FlagType { get; set; }
    }
    public class UserTypeModel
    {
        public long Id { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
    }
    public class ChatReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<ChatSettingsModel> chat { get; set; }
    }

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
        public int IsActive { get; set; }
    }

    public class ColorPreferenceReturnModel
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public ColorPreferenceModel ColorPreferences { get; set; }
    }
}