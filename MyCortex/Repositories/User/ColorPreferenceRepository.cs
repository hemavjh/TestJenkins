﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
  
using MyCortex.User.Models;
using MyCortex.Utilities;
using MyCortexDB;

namespace MyCortex.Repositories.User
{
    public class ColorPreferenceRepository : IColorPreferenceRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public ColorPreferenceRepository()
        {
            db = new ClsDataBase();
        }
        public ColorPreferenceModel ColorPreference_List(long? InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
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
                            Primary = (p.Field<string>("PRIMARY_COLOR")),
                            Secondary = (p.Field<string>("SECONDARY_COLOR")),
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
                            SubTitle = (p.Field<string>("SUBTITLE")),
                            IsActive = (p.Field<bool>("ISACTIVE")),
                            CreatedBy = (p.Field<long>("CREATED_BY")),
                            CreatedAt = (p.Field<DateTime>("CREATED_AT")),
                            ModifiedAt = (p.Field<DateTime>("MODIFIED_AT")),
                            Menu_Header = (p.Field<string>("MENU_HEADER")),
                            Menu_Underline = (p.Field<string>("MENU_UNDERLINE")),
                            Sub_Menu_Header = (p.Field<string>("SUB_MENU_HEADER")),
                            Sub_Menu_Underline = (p.Field<string>("SUB_MENU_UNDERLINE")),
                        }).FirstOrDefault();
                return list;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        public ColorPreferenceReturnModel ColorPreference_InsertUpdate(ColorPreferenceModel insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ColorPreferenceReturnModel insert = new ColorPreferenceReturnModel();
            try
            {               
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@ID", insobj.ID));
                //param.Add(new DataParameter("@USER_ID", insobj.UserId));
                param.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
                param.Add(new DataParameter("@CREATED_BY", insobj.UserId));
                param.Add(new DataParameter("@PRIMARY_COLOR", insobj.Primary));
                param.Add(new DataParameter("@SECONDARY_COLOR", insobj.Secondary));
                param.Add(new DataParameter("@HEADERBG", insobj.HeaderBg));
                param.Add(new DataParameter("@HEADERTEXT", insobj.HeaderText));
                param.Add(new DataParameter("@TABLEHEADERBG", insobj.TableHeaderBg));
                param.Add(new DataParameter("@TABLEHEADERTEXT", insobj.TableHeaderText));
                param.Add(new DataParameter("@TABLEALTERNATEROWBG", insobj.TableAlternateRowBg));
                param.Add(new DataParameter("@TABLEALTERNATEROWTEXT", insobj.TableAlternateRowText));
                param.Add(new DataParameter("@TABLEROWHOVERBG", insobj.TableRowHoverBg));
                param.Add(new DataParameter("@TABLEROWHOVERTEXT", insobj.TableRowHoverText));
                param.Add(new DataParameter("@LINKTEXT", insobj.LinkText));
                param.Add(new DataParameter("@POSITIVEBTNBG", insobj.PositiveBtnBg));
                param.Add(new DataParameter("@POSITIVEBTNBORDER", insobj.PositiveBtnBorder));
                param.Add(new DataParameter("@POSITIVEBTNTEXT", insobj.PositiveBtnText));
                param.Add(new DataParameter("@POSITIVEHOVERBTNBG", insobj.PositiveHoverBtnBg));
                param.Add(new DataParameter("@POSITIVEHOVERBTNBORDER", insobj.PositiveHoverBtnBorder));
                param.Add(new DataParameter("@POSITIVEHOVERBTNTEXT", insobj.PositiveHoverBtnText));
                param.Add(new DataParameter("@NEGATIVEBTNBG", insobj.NegativeBtnBg));
                param.Add(new DataParameter("@NEGATIVEBTNBORDER", insobj.NegativeBtnBorder));
                param.Add(new DataParameter("@NEGATIVEBTNTEXT", insobj.NegativeBtnText));
                param.Add(new DataParameter("@NEGATIVEHOVERBTNBG", insobj.NegativeHoverBtnBg));
                param.Add(new DataParameter("@NEGATIVEHOVERBTNBORDER", insobj.NegativeHoverBtnBorder));
                param.Add(new DataParameter("@NEGATIVEHOVERBTNTEXT", insobj.NegativeHoverBtnText));
                param.Add(new DataParameter("@TITLE", insobj.Title));
                param.Add(new DataParameter("@SUBTITLE", insobj.SubTitle));
                param.Add(new DataParameter("@MENU_HEADER", insobj.Menu_Header));
                param.Add(new DataParameter("@MENU_UNDERLINE", insobj.Menu_Underline));
                param.Add(new DataParameter("@SUB_MENU_HEADER", insobj.Sub_Menu_Header));
                param.Add(new DataParameter("@SUB_MENU_UNDERLINE", insobj.Sub_Menu_Underline));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLCOLOR_PREFERENCE_SP_INSERTUPDATE", param);

                insert = (from p in dt.AsEnumerable()
                            select
                            new ColorPreferenceReturnModel()
                            {
                                ReturnFlag = p.IsNull("FLAG") ? 0 : p.Field<Int32>("FLAG"),
                                Status = true,
                                ColorPreferences = new ColorPreferenceModel()
                                {
                                    ID = p.IsNull("ID") ? 0 : p.Field<long>("ID"),
                                    UserId = p.IsNull("USER_ID") ? 0 : p.Field<long>("USER_ID"),
                                    InstitutionId = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                    Primary = (p.Field<string>("PRIMARY_COLOR")),
                                    Secondary = (p.Field<string>("SECONDARY_COLOR")),
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
                                    SubTitle = (p.Field<string>("SUBTITLE")),
                                    IsActive = (p.Field<bool>("ISACTIVE")),
                                    CreatedBy = (p.Field<long>("CREATED_BY")),
                                    CreatedAt = (p.Field<DateTime>("CREATED_AT")),
                                    ModifiedAt = (p.Field<DateTime>("MODIFIED_AT")),
                                    Menu_Header = (p.Field<string>("MENU_HEADER")),
                                    Menu_Underline = (p.Field<string>("MENU_UNDERLINE")),
                                    Sub_Menu_Header = (p.Field<string>("SUB_MENU_HEADER")),
                                    Sub_Menu_Underline = (p.Field<string>("SUB_MENU_UNDERLINE")),

                                }
                            }).FirstOrDefault();

                return insert;
            }

            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                insert.ReturnFlag = 0;
                insert.Message = "Error occurred while creating";
            }
            return insert;
        }

    }
}