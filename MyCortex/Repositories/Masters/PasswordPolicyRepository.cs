using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Admin
{
    public class PasswordPolicyRepository : IPasswordPolicyRepository
    {
         ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        public PasswordPolicyRepository()
        {
            db = new ClsDataBase();

        }
        //PasswordPolicyInsert-Update
        public IList<PasswordPolicyModel> PasswordPolicy_InsertUpdate(PasswordPolicyModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@MINIMUM_LENGTH", obj.Minimum_Length));
            param.Add(new DataParameter("@MAXIMUM_LENGTH", obj.Maximum_Length));
            param.Add(new DataParameter("@UPPERCASE_REQUIRED", obj.UpperCase_Required));
            param.Add(new DataParameter("@LOWERCASE_REQUIRED", obj.LowerCase_Required));
            param.Add(new DataParameter("@NUMERIC_REQUIRED", obj.Numeric_Required));
            param.Add(new DataParameter("@SPECIALCHAR_REQUIRED", obj.SpecialChar_Required));
            param.Add(new DataParameter("@WITHOUT_CHAR", obj.Without_Char));
            param.Add(new DataParameter("@ALLOWEXPIRYDAYS", obj.AllowExpiryDays));
            param.Add(new DataParameter("@EXPIRY_PERIOD", obj.Expiry_Period));
            param.Add(new DataParameter("@ALLOW_USERNAME", obj.Allow_UserName));
            param.Add(new DataParameter("@RESTRICT_LASTPASSWORD", obj.Restrict_LastPassword));
            param.Add(new DataParameter("@MAXLOGINTIME", obj.MaxLoginTime));
            param.Add(new DataParameter("@MAXLOGINHOURSE", obj.MaxLoginHours));
            param.Add(new DataParameter("@MAXLOGINMINS", obj.MaxLoginMins));
            param.Add(new DataParameter("@REMEMBER_PASSWORD", obj.Remember_Password));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PASSWORDPOLICY_INSERTUPDATE", param);
            IList<PasswordPolicyModel> listval = (from p in dt.AsEnumerable()
                                                  select new PasswordPolicyModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      Minimum_Length = p.Field<int>("MINIMUM_LENGTH"),
                                                      Maximum_Length = p.Field<int>("MAXIMUM_LENGTH"),
                                                      UpperCase_Required = p.Field<bool?>("UPPERCASE_REQUIRED"),
                                                      LowerCase_Required = p.Field<bool?>("LOWERCASE_REQUIRED"),
                                                      Numeric_Required = p.Field<bool?>("NUMERIC_REQUIRED"),
                                                      SpecialChar_Required = p.Field<bool?>("SPECIALCHAR_REQUIRED"),
                                                      Without_Char = p.Field<string>("WITHOUT_CHAR"),
                                                      AllowExpiryDays = p.Field<bool?>("ALLOWEXPIRYDAYS"),
                                                      Expiry_Period = p.Field<int?>("EXPIRY_PERIOD"),
                                                      Allow_UserName = p.Field<bool?>("ALLOW_USERNAME"),
                                                      Restrict_LastPassword = p.Field<int?>("RESTRICT_LASTPASSWORD"),
                                                      MaxLoginTime = p.Field<int?>("MAXLOGINTIME"),
                                                      MaxLoginHours = p.Field<int?>("MAXLOGINHOURSE"),
                                                      MaxLoginMins = p.Field<int?>("MAXLOGINMINS"),
                                                      Remember_Password = p.Field<bool?>("REMEMBER_PASSWORD"),
                                                      Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                      Created_By = p.Field<long>("CREATED_BY"),
                                                      flag = p.Field<int>("flag"),
                                                  }).ToList();
            return listval;

        }


        /* This is for password policy Details  view function*/
        public PasswordPolicyModel PasswordPolicy_View(long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                // DataTable dt = ClsDataBase.GetDataTable("PasswordPolicy_SP_ViewEdit", param);
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PASSWORDPOLICY_SP_VIEW", param);
                PasswordPolicyModel list = (from p in dt.AsEnumerable()
                                            select new PasswordPolicyModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                Minimum_Length = p.Field<int>("MINIMUM_LENGTH"),
                                                Maximum_Length = p.Field<int>("MAXIMUM_LENGTH"),
                                                UpperCase_Required = p.Field<bool?>("UPPERCASE_REQUIRED"),
                                                LowerCase_Required = p.Field<bool?>("LOWERCASE_REQUIRED"),
                                                Numeric_Required = p.Field<bool?>("NUMERIC_REQUIRED"),
                                                SpecialChar_Required = p.Field<bool?>("SPECIALCHAR_REQUIRED"),
                                                Without_Char = p.Field<string>("WITHOUT_CHAR"),
                                                AllowExpiryDays = p.Field<bool?>("ALLOWEXPIRYDAYS"),
                                                Expiry_Period = p.Field<int?>("EXPIRY_PERIOD"),
                                                Allow_UserName = p.Field<bool?>("ALLOW_USERNAME"),
                                                Restrict_LastPassword = p.Field<int?>("RESTRICT_LASTPASSWORD"),
                                                MaxLoginTime = p.Field<int?>("MAXLOGINTIME"),
                                                MaxLoginHours = p.Field<int?>("MAXLOGINHOURSE"),
                                                MaxLoginMins = p.Field<int?>("MAXLOGINMINS"),
                                                Remember_Password = p.Field<bool?>("REMEMBER_PASSWORD"),
                                                IsActive = p.Field<int>("IsActive"),
                                                Created_By = p.Field<long>("CREATED_BY"),
                                                Created_Dt = p.Field<DateTime>("CREATED_DT")
                                            }).FirstOrDefault();
                return list;
            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

    }
}