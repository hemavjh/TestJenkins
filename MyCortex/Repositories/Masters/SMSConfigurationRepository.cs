using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Utilities;

namespace MyCortex.Repositories.Admin
{
    public class SMSConfigurationRepository: ISMSConfigurationRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public SMSConfigurationRepository()
        {
            db = new ClsDataBase();

        }

        /// to Insert/Update the entered SMS Configuration Information into database of a institution
        /// </summary>
        /// <param name="model">SMS Configuration details</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public long SMSConfiguration_AddEdit(SMSConfigurationModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long retid;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@SOURCE_ID", obj.Source_Id));
            param.Add(new DataParameter("@USERNAME", obj.UserName));
            param.Add(new DataParameter("@API_ID", obj.ApiId));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                retid = ClsDataBase.Insert("[MYCORTEX].[SMSCONFIGURAION_INSERTUPDATE]", param, true);
                return retid;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }

        /// to get SMS configuration details of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>SMS configuration details of a institution</returns>
        public SMSConfigurationModel SMSConfiguration_View(long Institution_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.SMSCONFIGURATION_SP_VIEWEDIT", param);
                SMSConfigurationModel obj = (from p in dt.AsEnumerable()
                                               select new SMSConfigurationModel()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                   Insitution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                   Source_Id = p.Field<string>("SOURCE_ID"),
                                                   UserName = p.Field<string>("USERNAME"),
                                                   ApiId = p.Field<string>("API_ID"),

                                               }).FirstOrDefault();
                return obj;

            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
    }
}