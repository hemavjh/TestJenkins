using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using log4net;
using MyCortex.User.Models;
using MyCortexDB;

namespace MyCortex.Repositories.User
{
    public class PatientDeviceDataRepository : IPatientDeviceDataRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public long PatientDeviceData_InsertUpdate(List<PatientDeviceDataModel> insobj)
        {
            try
            {
                string flag = "";
                foreach (PatientDeviceDataModel item in insobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@PATIENT_ID", item.Patient_Id));
                    param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                    param.Add(new DataParameter("@DEVICETYPE", item.DeviceType));
                    param.Add(new DataParameter("@DEVICENO", item.DeviceNo));
                    param.Add(new DataParameter("@DEVICEDATA", item.DeviceData));
                    param.Add(new DataParameter("@CREATED_BY", item.Created_By));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTDEVICEDATA_SP_INSERTUPDATE", param);
                        DataRow dr = dt.Rows[0];
                        flag = (dr["FLAG"].ToString());
                    }
                }
                var data = (Convert.ToInt64(flag));
                return data;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);

            }
            return 0;
        }
    }
}