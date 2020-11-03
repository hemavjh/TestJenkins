using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using log4net;
using MyCortex.Masters.Models;
using MyCortex.Utilities;
using MyCortexDB;

namespace MyCortex.Repositories.Masters
{
    public class WebConfigurationRepository: IWebConfigurationRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public IList<WebConfigurationModel> WebConfiguration_List(int? IsActive)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCE_SP_LIST", param);
                DataEncryption DecryptFields = new DataEncryption();
                List<WebConfigurationModel> list = (from p in dt.AsEnumerable()
                                              select new WebConfigurationModel()
                                              {
                                                  Id = p.Field<long>("ID"),
                                                  KeyName = DecryptFields.Decrypt(p.Field<string>("KEYNAME")),
                                                  Value = DecryptFields.Decrypt(p.Field<string>("VALUE")),
                                                  IsActive = p.Field<int>("ISACTIVE"),
                                                  Created_by = p.Field<long>("CREATED_BY"),
                                                  Created_Dt = p.Field<DateTime>("CREATED_DT"),

                                              }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}