using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
  
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Masters
{
    public class ShiftTimingsRepository : IShiftTimingsRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        /*private MyCortexLogger _MyLogger = new MyCortexLogger();*/
        /*string*/
            /*_AppLogger = string.Empty, _AppMethod = string.Empty;*/
        public ShiftTimingsRepository()
        {

            db = new ClsDataBase();
        }
        /// <summary>
        /// Admin  --> AV/Chat Settings --> Add/Edit Page
        /// to Insert/Update the entered AV/Chat Settings Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of AV/Chat Settings Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public IList<ShiftTimingsModel> ShiftTimings_InsertUpdate(Guid Login_Session_Id,ShiftTimingsModel obj)
        {

            int retid;
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/

                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@ID", obj.Id));
                param.Add(new DataParameter("@INSTITUTION_ID", obj.InstituteId));
                param.Add(new DataParameter("@SHIFTNAME", obj.ShiftName));
                param.Add(new DataParameter("@SHIFT_STARTTIME", obj.ShiftFromTime));
                param.Add(new DataParameter("@SHIFT_ENDTIME", obj.ShiftEndTime));
                param.Add(new DataParameter("@SHIFT_FROMDATE", obj.ShiftFromDate));
                param.Add(new DataParameter("@SHIFT_TODATE", obj.ShiftToDate));
                param.Add(new DataParameter("@CREATED_BY", HttpContext.Current.Session["UserId"]));
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
                /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
                try
                {
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SHIFTTIMINGS_SP_INSERTUPDATE", param);
                 IList<ShiftTimingsModel> INS = (from p in dt.AsEnumerable()
                                                   select
                                                   new ShiftTimingsModel()
                                                   {
                                                     //  Id = p.Field<long>("ID"),
                                                       InstituteId = p.Field<long>("INSTITUTION_ID"),
                                                       ShiftName = p.Field<string>("SHIFTNAME"),
                                                       ShiftFromTime = p.Field<DateTime>("SHIFT_STARTTIME"),
                                                       ShiftEndTime = p.Field<DateTime>("SHIFT_ENDTIME"),
                                                       ShiftFromDate = p.Field<DateTime>("SHIFT_FROMDATE"),
                                                       ShiftToDate = p.Field<DateTime>("SHIFT_TODATE"),   
                                                       IsActive = p.Field<int>("ISACTIVE"),
                                                       Created_by = p.Field<long>("CREATED_BY"),
                                                       Created_dt = p.Field<DateTime>("CREATED_DT"),
                                                       Flag = p.Field<int>("flag"),
                                                   }).ToList();
                    return INS;
                    
                }
                catch (Exception ex)
                {
                  /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                    return null;
                }          
        }


        /// <summary>      
        /// Settings  --> AppoinmentSlot details (menu) -- > List Page (result)
        /// to get the list of AppoinmentSlot for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of AppoinmentSlot list Details DataTable</returns>
        public IList<ShiftTimingsModel> ShiftTimings_List(int? IsActive, long InstituteId, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", InstituteId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SHIFTTIMENGS_SP_LIST", param);
                List<ShiftTimingsModel> list = (from p in dt.AsEnumerable()
                                                select new ShiftTimingsModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      ShiftName = p.Field<string>("SHIFTNAME"),
                                                      ShiftFromTime = p.Field<DateTime>("SHIFT_STARTTIME"),
                                                      ShiftEndTime = p.Field<DateTime>("SHIFT_ENDTIME"),
                                                      ShiftFromDate = p.Field<DateTime>("SHIFT_FROMDATE"),
                                                      ShiftToDate = p.Field<DateTime>("SHIFT_TODATE"),
                                                      IsActive = p.Field<int>("ISACTIVE"),
                                                      Created_by = p.Field<long>("CREATED_BY")
                                                      // Specialization = p.Field<string>("NAMESPECIALIZATION"),
                                                      //NewAppoinment = p.Field<decimal>("NEWAPPOINMENT")
                                                  }).ToList();
                return list;
            }
            catch (Exception ex)
            {
               /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }


        /// <summary>      
        /// Settings  --> AppoinmentSlot Details --> View Page
        /// to get the details in the view page of a selected AppoinmentSlot
        /// </summary>        
        /// <param name="Id">Id of a AppoinmentSlot</param>    
        /// <returns>Populated a AppoinmentSlot Details DataTable </returns>
        public ShiftTimingsModel ShiftTimings_View(long Id, Guid Login_Session_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SHIFTTIMENGS_SP_VIEW", param);
                ShiftTimingsModel INS = (from p in dt.AsEnumerable()
                                           select new ShiftTimingsModel()
                                           {
                                               Id = p.Field<long>("ID"),
                                               ShiftName = p.Field<string>("SHIFTNAME"),
                                               ShiftFromTime = p.Field<DateTime>("SHIFT_STARTTIME"),
                                               ShiftEndTime = p.Field<DateTime>("SHIFT_ENDTIME"),
                                               ShiftFromDate = p.Field<DateTime>("SHIFT_FROMDATE"),
                                               ShiftToDate = p.Field<DateTime>("SHIFT_TODATE"),
                                               IsActive = p.Field<int>("ISACTIVE"),
                                               Created_by = p.Field<long>("CREATED_BY")
                                           }).FirstOrDefault();
                return INS;
            }
            catch (Exception ex)
            {
               /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>
        /// to deactivate a Shift Timings
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>deactivated a Shift Timings</returns>
        public IList<ShiftTimingsModel> ShiftTimings_InActive(ShiftTimingsModel noteobj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SHIFTTIMINGS_SP_INACTIVE", param);
                IList<ShiftTimingsModel> list = (from p in dt.AsEnumerable()
                                                 select new ShiftTimingsModel()
                                            {
                                                Flag = p.Field<int>("flag")
                                            }).ToList();
                return list;

            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
        /// <summary>
        /// to activated a Shift Timings
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>activated a Shift Timings</returns>
        public IList<ShiftTimingsModel> ShiftTimings_Active(ShiftTimingsModel noteobj)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            List<DataParameter> param = new List<DataParameter>();
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            /*_MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);*/
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].SHIFTTIMINGS_SP_ACTIVE", param);
                IList<ShiftTimingsModel> list = (from p in dt.AsEnumerable()
                                                 select new ShiftTimingsModel()
                                            {
                                                Flag = p.Field<int>("flag")
                                            }).ToList();
                return list;

            }
            catch (Exception ex)
            {
              /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Active Appoinment Slot List details (menu) -- > List Page (result)
        /// to get the list of Appoinment Slot List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Appoinment slot</param> 
        /// <param name="Id">Id of a Institution Id</param> 
        /// <param name="Id">Id of a Doctor Id</param> 
        /// <returns>Populated List of Appoinment Slot list Details DataTable</returns>
        public ShiftTimingsModel ActivateShiftTiming_List(long Id, long Institution_Id)
        {
            /* _AppLogger = this.GetType().FullName;*/
            /* _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;*/
            // int returnval;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ACTIVESHIFTTIMING_SP_CHECK", param);

                ShiftTimingsModel lst = (from p in dt.AsEnumerable()
                                         select new ShiftTimingsModel()
                                           {
                                               returnval = p.Field<int>("val")

                                           }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
               /* _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);*/
                return null;
            }
        }
    }

}