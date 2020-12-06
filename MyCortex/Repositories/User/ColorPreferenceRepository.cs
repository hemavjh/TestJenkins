using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using log4net;
using MyCortexDB;
using MyCortex.User.Model;
using MyCortex.Masters.Models;
using MyCortex.User.Models;
using MyCortex.Utilities;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories.User
{
    public class ColorPreferenceRepository : IColorPreferenceRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public ColorPreferenceRepository()
        {
            db = new ClsDataBase();
        }
        public ColorPreferenceModel ColorPreference_List(int? UserId, Guid Login_Session_Id)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USER_ID", UserId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLCOLOR_PREFERENCE_SP_LIST", param);
                ColorPreferenceModel list = (from p in dt.AsEnumerable()
                                               select
                                               new ColorPreferenceModel()
                                               {
                                                   ID = p.IsNull("ID") ? 0 : p.Field<long>("ID"),
                                                   UserId = p.IsNull("USER_ID") ? 0 : p.Field<long>("USER_ID"),
                                                   InstitutionId = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                                   Primary = (p.Field<string>("PRIMARY")),
                                                   Secondary = (p.Field<string>("SECONDARY")),
                                                   HeaderBg = (p.Field<string>("HEADERBG")),
                                                   HeaderText = (p.Field<string>("HEADERTEXT")),
                                                   TableHeaderBg = (p.Field<string>("TABLEHEADERBG")),
                                                   TableHeaderText = (p.Field<string>("TABLEHEADERTEXT")),
                                                   TableAlternateRowBg = (p.Field<string>("TABLEALTERNATEROWBG")),
                                                   TableAlternateRowText = (p.Field<string>("TABLEALTERNATEROWTEXT")),
                                                   TableRowHoverBg = (p.Field<string>("TABLEROWHOVERBG")),
                                                   TableRowHoverText = (p.Field<string>("TABLEROWHOVERTEXT")),
                                                   LinkText = (p.Field<string>("LINKTEXT")),
                                                   PositiveBtnBg = (p.Field<string>("POSITIVEBTNBG")),
                                                   PositiveBtnBorder = (p.Field<string>("POSITIVEBTNBORDER")),
                                                   PositiveBtnText = (p.Field<string>("POSITIVEBTNTEXT")),
                                                   PositiveHoverBtnBg = (p.Field<string>("POSITIVEHOVERBTNBG")),
                                                   PositiveHoverBtnBorder = (p.Field<string>("POSITIVEHOVERBTNBORDER")),
                                                   PositiveHoverBtnText = (p.Field<string>("POSITIVEHOVERBTNTEXT")),
                                                   NegativeBtnBg = (p.Field<string>("NEGATIVEBTNBG")),
                                                   NegativeBtnBorder = (p.Field<string>("NEGATIVEBTNBORDER")),
                                                   NegativeBtnText = (p.Field<string>("NEGATIVEBTNTEXT")),
                                                   NegativeHoverBtnBg = (p.Field<string>("NEGATIVEHOVERBTNBG")),
                                                   NegativeHoverBtnBorder = (p.Field<string>("NEGATIVEHOVERBTNBORDER")),
                                                   NegativeHoverBtnText = (p.Field<string>("NEGATIVEHOVERBTNTEXT")),
                                                   Title = (p.Field<string>("TITLE")),
                                                   SubTitle = (p.Field<string>("SUBTITLE"))
                                               }).FirstOrDefault();
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public ColorPreferenceReturnModel ColorPreference_InsertUpdate(Guid Login_Session_Id, ColorPreferenceModel insobj)
        {
            try
            {               
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@ID", insobj.ID));
                param.Add(new DataParameter("@USER_ID", insobj.UserId));
                param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLCOLOR_PREFERENCE_SP_INSERTUPDATE", param);



                ColorPreferenceReturnModel insert = (from p in dt.AsEnumerable()
                                                select
                                                new ColorPreferenceReturnModel()
                                                {
                                                    ReturnFlag = p.IsNull("FLAG") ? 0 : p.Field<Int32>("FLAG"),
                                                    ColorPreferences = new ColorPreferenceModel()
                                                    {
                                                        ID = p.IsNull("ID") ? 0 : p.Field<long>("ID"),
                                                        UserId = p.IsNull("USER_ID") ? 0 : p.Field<long>("USER_ID"),
                                                        InstitutionId = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                                        Primary = (p.Field<string>("PRIMARY")),
                                                        Secondary = (p.Field<string>("SECONDARY")),
                                                        HeaderBg = (p.Field<string>("HEADERBG")),
                                                        HeaderText = (p.Field<string>("HEADERTEXT")),
                                                        TableHeaderBg = (p.Field<string>("TABLEHEADERBG")),
                                                        TableHeaderText = (p.Field<string>("TABLEHEADERTEXT")),
                                                        TableAlternateRowBg = (p.Field<string>("TABLEALTERNATEROWBG")),
                                                        TableAlternateRowText = (p.Field<string>("TABLEALTERNATEROWTEXT")),
                                                        TableRowHoverBg = (p.Field<string>("TABLEROWHOVERBG")),
                                                        TableRowHoverText = (p.Field<string>("TABLEROWHOVERTEXT")),
                                                        LinkText = (p.Field<string>("LINKTEXT")),
                                                        PositiveBtnBg = (p.Field<string>("POSITIVEBTNBG")),
                                                        PositiveBtnBorder = (p.Field<string>("POSITIVEBTNBORDER")),
                                                        PositiveBtnText = (p.Field<string>("POSITIVEBTNTEXT")),
                                                        PositiveHoverBtnBg = (p.Field<string>("POSITIVEHOVERBTNBG")),
                                                        PositiveHoverBtnBorder = (p.Field<string>("POSITIVEHOVERBTNBORDER")),
                                                        PositiveHoverBtnText = (p.Field<string>("POSITIVEHOVERBTNTEXT")),
                                                        NegativeBtnBg = (p.Field<string>("NEGATIVEBTNBG")),
                                                        NegativeBtnBorder = (p.Field<string>("NEGATIVEBTNBORDER")),
                                                        NegativeBtnText = (p.Field<string>("NEGATIVEBTNTEXT")),
                                                        NegativeHoverBtnBg = (p.Field<string>("NEGATIVEHOVERBTNBG")),
                                                        NegativeHoverBtnBorder = (p.Field<string>("NEGATIVEHOVERBTNBORDER")),
                                                        NegativeHoverBtnText = (p.Field<string>("NEGATIVEHOVERBTNTEXT")),
                                                        Title = (p.Field<string>("TITLE")),
                                                        SubTitle = (p.Field<string>("SUBTITLE"))
                                                    }
                                                }).FirstOrDefault();

                return null;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);

            }
            return null;
        }

    }
}