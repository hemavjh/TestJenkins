using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
  
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Masters
{
    public class AttendanceRepository : IAttendanceRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public AttendanceRepository()
        {

            db = new ClsDataBase();
        }
        /// <summary>      
        /// Settings  --> Doctor List details (menu) -- > List Page (result)
        /// to get the list of Doctor List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of Doctor list Details DataTable</returns>
        public IList<AttendanceModel> UserType_List(long Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCEUSERTYPEDETAILS_SP_LIST", param);
                List<AttendanceModel> list = (from p in dt.AsEnumerable()
                                              select new AttendanceModel()
                                                        {
                                                            Id = p.Field<long>("ID"),
                                                            FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                            Department_Name = p.Field<string>("DEPARTMENT_NAME"),
                                                            NameSpecialization = p.Field<string>("NAMESPECIALIZATION"),
                                                            ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                                                            EmailId = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                                            TypeName = p.Field<string>("TYPENAME"),
                                                            IsActive = p.Field<int>("ISACTIVE")
                                                        }).ToList();
                return list;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Doctor List details (menu) -- > List Page (result)
        /// to get the list of Doctor List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of Doctor list Details DataTable</returns>
    /*    public IList<AttendanceModel> Attendance_List(long Institution_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCESTATUS_SP_LIST", param);
                List<AttendanceModel> list = (from p in dt.AsEnumerable()
                                              select new AttendanceModel()
                                              {
                                                  Id = p.Field<long>("ID"),
                                                  Attendance_Status = p.Field<string>("ATTENDANCESTATUS"),
                                                  IsActive = p.Field<int>("ISACTIVE")
                                              }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        */
        public long AttendanceDetails_InsertUpdate(Guid Login_Session_Id,List<AttendanceModel> insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                string flag = "";
                foreach (AttendanceModel item in insobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                    param.Add(new DataParameter("@ATTENDANCE_FROMDATE", item.AttendanceFromDate));
                    param.Add(new DataParameter("@ATTENDANCE_TODATE", item.AttendanceToDate));
                    param.Add(new DataParameter("@ATTENDANCE_FROMTIME", item.AttendanceFromTime));
                    param.Add(new DataParameter("@ATTENDANCE_TOTIME", item.AttendanceToTime));
                    param.Add(new DataParameter("@DOCTOR_ID", item.Doctor_Id));
                    param.Add(new DataParameter("@REMARKS", item.Remarks));                    
                    param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCEDETAILS_SP_INSERTUPDATE", param);
                        DataRow dr = dt.Rows[0];
                        flag = (dr["FLAG"].ToString());
                    }
                }
                var data = (Convert.ToInt64(flag));
                return data;
            }

              catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);

            }
            return 0;
        }
        public IList<ClinicalUser_List> Clinician_UserList(long? Institution_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CLINICALUSERS_SP_LIST", param);
                List<ClinicalUser_List> list = (from p in dt.AsEnumerable()
                                                        select new ClinicalUser_List()
                                                        {
                                                            Id = p.Field<long>("ID"),
                                                            FullName = p.Field<string>("FULLNAME"),
                                                            Department_Name = p.Field<string>("DEPARTMENT_NAME"),
                                                            NameSpecialization = p.Field<string>("NAMESPECIALIZATION"),
                                                            ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                                                            EmailId = p.Field<string>("EMAILID"),
                                                            TypeName = p.Field<string>("TYPENAME"),
                                                            IsActive = p.Field<int>("ISACTIVE")
                                                        }).ToList();
                return list;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /*   public IList<AttendanceModel> AttendanceDetails_InsertUpdate(AttendanceModel obj)
           {

               int retid;
               List<DataParameter> param = new List<DataParameter>();
               param.Add(new DataParameter("@ID", obj.Id));
               param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
               param.Add(new DataParameter("@ATTENDANCE_FROMDATE", obj.AttendanceFromDate));
               param.Add(new DataParameter("@ATTENDANCE_TODATE", obj.AttendanceToDate));
               param.Add(new DataParameter("@DOCTOR_ID", obj.Doctor_Id));
               param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));

               var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
               _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
               try
               {
                   DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCEDETAILS_SP_INSERTUPDATE", param);
                   IList<AttendanceModel> INS = (from p in dt.AsEnumerable()
                                                 select new AttendanceModel()
                                                 {
                                                     Id = p.Field<long>("ID"),
                                                     /* Institution_Id = p.Field<long>("INSTITUTION_ID");
                                                      ShiftName = p.Field<string>("SHIFTNAME"),
                                                      ShiftFromTime = p.Field<DateTime>("SHIFT_STARTTIME"),
                                                      ShiftEndTime = p.Field<DateTime>("SHIFT_ENDTIME"),
                                                      ShiftFromDate = p.Field<DateTime>("SHIFT_FROMDATE"),
                                                      ShiftToDate = p.Field<DateTime>("SHIFT_TODATE"),
                                                      IsActive = p.Field<int>("ISACTIVE"),
                                                      Created_by = p.Field<long>("CREATED_BY"),
                                                      Created_dt = p.Field<DateTime>("CREATED_DT"),
                                                      Flag = p.Field<int>("flag"),*/
        /*  }).ToList();
return INS;

}
catch (Exception ex)
{
_MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
return null;
}
}
*/
        /// <summary>      
        /// Settings  --> AppoinmentSlot details (menu) -- > List Page (result)
        /// to get the list of AppoinmentSlot for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of AppoinmentSlot list Details DataTable</returns>
        public IList<AttendanceModel> Attendance_List(int? IsActive, long Institution_Id, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCE_SP_LIST", param);
                 List<AttendanceModel> list = (from p in dt.AsEnumerable()  
                                       select new AttendanceModel()
                                       {
                                           Id = p.Field<long>("ID"),
                                           Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                           UserTypeName = p.Field<string>("TYPENAME"),
                                           DoctorName = p.Field<string>("DOCTORNAME"),
                                           AttendanceFromDate = p.Field<DateTime>("ATTENDANCE_FROMDATE"),
                                           AttendanceToDate = p.Field<DateTime>("ATTENDANCE_TODATE"),
                                           IsActive = p.Field<int>("ISACTIVE"),
                                           Created_by = p.Field<long>("CREATED_BY"),
                                           CreatedByName = p.Field<string>("CREATEDBYNAME"),
                                           Remarks = p.Field<string>("REMARKS"),
                                           Created_Dt = p.Field<DateTime>("CREATED_DT"),
                                           
                                       }).ToList();
                return list;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>      
        /// Settings  --> AppoinmentSlot Details --> View Page
        /// to get the details in the view page of a selected AppoinmentSlot
        /// </summary>        
        /// <param name="Id">Id of a AppoinmentSlot</param>    
        /// <returns>Populated a AppoinmentSlot Details DataTable </returns>
        public AttendanceModel Attendance_View(long Id, Guid Login_Session_Id, long institution_id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@INSTITUTION_ID", institution_id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCE_SP_VIEW", param);
                AttendanceModel INS = (from p in dt.AsEnumerable()
                                       select new AttendanceModel()
                                         {
                                             Id = p.Field<long>("ID"),
                                             Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                             DoctorName = p.Field<string>("DOCTORNAME"),
                                             AttendanceFromDate = p.Field<DateTime>("ATTENDANCE_FROMDATE"),
                                             AttendanceToDate = p.Field<DateTime>("ATTENDANCE_TODATE"),
                                             IsActive = p.Field<int>("ISACTIVE"),
                                             Created_by = p.Field<long>("CREATED_BY"),
                                             CreatedByName = p.Field<string>("CREATEDBYNAME"),
                                             Remarks = p.Field<string>("REMARKS"),
                                             
                                         }).FirstOrDefault();
                return INS;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /* This is for Delete Allergy Details */
        public IList<AttendanceModel> Attendance_InActive(AttendanceModel noteobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCE_SP_INACTIVE", param);
                IList<AttendanceModel> list = (from p in dt.AsEnumerable()
                                               select new AttendanceModel()
                                                 {
                                                     Flag = p.Field<int>("flag")
                                                 }).ToList();
                return list;

            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<AttendanceModel> Attendance_Active(AttendanceModel noteobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ATTENDANCE_SP_ACTIVE", param);
                IList<AttendanceModel> list = (from p in dt.AsEnumerable()
                                               select new AttendanceModel()
                                                 {
                                                     Flag = p.Field<int>("flag")
                                                 }).ToList();
                return list;

            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

    }

}