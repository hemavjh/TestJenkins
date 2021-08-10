using MyCortex.Masters.Controllers;
using MyCortex.Masters.Models;
using MyCortexDB;
using log4net;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Masters.Models;
using MyCortex.Utilities;

namespace MyCortex.Repositories.Masters
{
    public class DoctorShiftRepository : IDoctorShiftRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public DoctorShiftRepository()
        {
            db = new ClsDataBase();

        }
        /// <summary>      
        /// Settings --> Doctor Shift --> View Page
        /// to get the details in the view page of a selected Doctor Shift
        /// </summary>        
        /// <param name="Id">Id of a Doctor Shift</param>    
        /// <returns>Populated a Doctor Shift Details DataTable </returns>
        public IList<SelectedDaysList> DoctorShiftDayDetails_View(long Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@DoctorShift_id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[Doctor_Shift_Details_WithDates_SP]", param);
                List<SelectedDaysList> INS = (from p in dt.AsEnumerable()
                                              select
                                              new SelectedDaysList()
                                              {
                                                  //Id = p.Field<long>("Id"),
                                                  Day = p.Field<DateTime>("SHIFT_DATE"),
                                                  TimeSlotFromTime = p.Field<DateTime>("SHIFT_Starttime"),
                                                  TimeSlotToTime = p.Field<DateTime>("SHIFT_Endtime"),
                                                  SHIFT = p.Field<int>("SHIFT_No"),
                                                  //Sunday = p.Field<string>("SUNDAY"),
                                                  //Monday = p.Field<string>("MONDAY"),
                                                  //Tuesday = p.Field<string>("TUESDAY"),
                                                  //Wednessday = p.Field<string>("WEDNESSDAY"),
                                                  //Thursday = p.Field<string>("THURSDAY"),
                                                  //Friday = p.Field<string>("FRIDAY"),
                                                  //Saturday = p.Field<string>("SATURDAY"),
                                                  //Shift_Id = p.Field<long?>("SHIFT_ID"),
                                                  //ShiftName = p.Field<string>("SHIFTNAME"),
                                                  //IsActive = p.Field<int>("ISACTIVE"),
                                                  //Created_By = p.Field<long>("CREATED_BY"),
                                                  //Modified_By = p.Field<long?>("MODIFIED_BY"),
                                              }).ToList();
                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Active Doctor Shift List details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param> 
        /// <param name="Id">Id of a Institution Id</param> 
        /// <param name="Id">Id of a Doctor Id</param> 
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        public IList<New_DoctorShiftModel> DoctorShift_List(int IsActive, long InstitutionId, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            DataEncryption DecryptFields = new DataEncryption();
            //param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TBLDOCTORSHIFT_SP_VIEWLIST]", param);
                List<New_DoctorShiftModel> list = (from p in dt.AsEnumerable()
                                               select new New_DoctorShiftModel()
                                               {
                                                   ID = p.Field<long>("ID"),
                                                   DoctorId = p.Field<long>("DOCTOR_ID"),
                                                   Doctor_Name = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                                   //DayMaster_Id = p.Field<long>("DAYMASTER_ID"),
                                                   //WeekDayName = p.Field<string>("WEEKDAYNAME"),
                                                   //Sunday = p.Field<string>("SUNDAY"),
                                                   //Monday = p.Field<string>("MONDAY"),
                                                   //Tuesday = p.Field<string>("TUESDAY"),
                                                   //Wednessday = p.Field<string>("WEDNESSDAY"),
                                                   //Thursday = p.Field<string>("THURSDAY"),
                                                   //Friday = p.Field<string>("FRIDAY"),
                                                   //Saturday = p.Field<string>("SATURDAY"),
                                                   //Shift_Id = p.Field<long?>("SHIFT_ID"),
                                                   //ShiftName = p.Field<string>("SHIFTNAME"),
                                                   FromDate = p.Field<DateTime>("FROMDATE"),
                                                   ToDate = p.Field<DateTime>("TODATE"),
                                                   IsActive = p.Field<int>("ISACTIVE")
                                               }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        /* THIS IS FOR ADD EDIT FUNCTION */
        /// <summary>
        /// Settings  --> Doctor Shift Details --> Add/Edit Page
        /// to Insert/Update the entered Doctor Shift Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of Doctor Shift Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public long DoctorShift_AddEdit(List<DoctorShiftModel> obj)
        {
            long InsSubModId;
            int insert;
            try
            {
                string flag = "";
                foreach (DoctorShiftModel item in obj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                    param.Add(new DataParameter("@DOCTOR_ID", item.Doctor_Id));
                    param.Add(new DataParameter("@FROMDATE", item.FromDate));
                    param.Add(new DataParameter("@TODATE", item.ToDate));
                    param.Add(new DataParameter("@CREATED_BY", item.Created_By));
                    param.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLDOCTORSHIFT_SP_INSERTUPDATE", param);

                        //var InsertId = long.Parse((dr["Id"].ToString()));
                        //var Insflag = (dr["flag"].ToString());
                        DataRow dr = dt.Rows[0];
                        var InsertId = long.Parse((dr["Id"].ToString()));
                        flag = (dr["FLAG"].ToString());

                        if (InsertId > 0 && flag != "1")
                        {
                            if (item.DoctorShiftList != null)
                            {
                                foreach (WeekDayModel items in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item1 in item.SundayChildModuleList)
                                    {
                                        List<DataParameter> param1 = new List<DataParameter>();

                                        param1.Add(new DataParameter("@ID", item1.Id));
                                        param1.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param1.Add(new DataParameter("@DAYMASTER_ID", item1.DayMaster_Id));
                                        param1.Add(new DataParameter("@SHIFT_ID", items.Id));
                                        param1.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param1.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.SundayChildModuleList != null)
                                        {
                                            var objExist1 = item.SundayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == items.Id);
                                            if (objExist1.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param1.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param1.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param1, true);
                                        }
                                    }
                                }
                                foreach (WeekDayModel item1 in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item2 in item.MondayChildModuleList)
                                    {
                                        List<DataParameter> param2 = new List<DataParameter>();

                                        param2.Add(new DataParameter("@ID", item2.Id));
                                        param2.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param2.Add(new DataParameter("@DAYMASTER_ID", item2.DayMaster_Id));
                                        param2.Add(new DataParameter("@SHIFT_ID", item1.Id));
                                        param2.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param2.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.MondayChildModuleList != null)
                                        {
                                            var objExist2 = item.MondayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == item1.Id);
                                            if (objExist2.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param2.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param2.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param2, true);
                                        }
                                    }
                                }
                                foreach (WeekDayModel item2 in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item3 in item.TuesdayChildModuleList)
                                    {
                                        List<DataParameter> param3 = new List<DataParameter>();

                                        param3.Add(new DataParameter("@ID", item3.Id));
                                        param3.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param3.Add(new DataParameter("@DAYMASTER_ID", item3.DayMaster_Id));
                                        param3.Add(new DataParameter("@SHIFT_ID", item2.Id));
                                        param3.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param3.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.TuesdayChildModuleList != null)
                                        {
                                            var objExist3 = item.TuesdayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == item2.Id);
                                            if (objExist3.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param3.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param3.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param3, true);
                                        }
                                    }
                                }

                                foreach (WeekDayModel item3 in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item4 in item.WednessdayChildModuleList)
                                    {
                                        List<DataParameter> param4 = new List<DataParameter>();

                                        param4.Add(new DataParameter("@ID", item4.Id));
                                        param4.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param4.Add(new DataParameter("@DAYMASTER_ID", item4.DayMaster_Id));
                                        param4.Add(new DataParameter("@SHIFT_ID", item3.Id));
                                        param4.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param4.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.WednessdayChildModuleList != null)
                                        {
                                            var objExist4 = item.WednessdayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == item3.Id);
                                            if (objExist4.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param4.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param4.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param4, true);
                                        }
                                    }
                                }
                                foreach (WeekDayModel item4 in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item5 in item.ThursdayChildModuleList)
                                    {
                                        List<DataParameter> param5 = new List<DataParameter>();

                                        param5.Add(new DataParameter("@ID", item5.Id));
                                        param5.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param5.Add(new DataParameter("@DAYMASTER_ID", item5.DayMaster_Id));
                                        param5.Add(new DataParameter("@SHIFT_ID", item4.Id));
                                        param5.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param5.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.ThursdayChildModuleList != null)
                                        {
                                            var objExist5 = item.ThursdayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == item4.Id);
                                            if (objExist5.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param5.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param5.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param5, true);
                                        }
                                    }
                                }

                                foreach (WeekDayModel item5 in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item6 in item.FridayChildModuleList)
                                    {
                                        List<DataParameter> param6 = new List<DataParameter>();

                                        param6.Add(new DataParameter("@ID", item6.Id));
                                        param6.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param6.Add(new DataParameter("@DAYMASTER_ID", item6.DayMaster_Id));
                                        param6.Add(new DataParameter("@SHIFT_ID", item5.Id));
                                        param6.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param6.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.FridayChildModuleList != null)
                                        {
                                            var objExist6 = item.FridayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == item5.Id);
                                            if (objExist6.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param6.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param6.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param6, true);
                                        }
                                    }
                                }
                                foreach (WeekDayModel item6 in item.DoctorShiftList)
                                {
                                    foreach (DoctorShiftDayDetailsModel item7 in item.SaturdayChildModuleList)
                                    {
                                        List<DataParameter> param7 = new List<DataParameter>();

                                        param7.Add(new DataParameter("@ID", item7.Id));
                                        param7.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                        param7.Add(new DataParameter("@DAYMASTER_ID", item7.DayMaster_Id));
                                        param7.Add(new DataParameter("@SHIFT_ID", item6.Id));
                                        param7.Add(new DataParameter("@CREATED_BY", item.Created_By));
                                        param7.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));

                                        if (item.SaturdayChildModuleList != null)
                                        {
                                            var objExist7 = item.SaturdayChildModuleList.Where(ChildItem => ChildItem.Shift_Id == item6.Id);
                                            if (objExist7.ToList().Count > 0)
                                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                                param7.Add(new DataParameter("@Group_Selected", "1"));
                                            else
                                                param7.Add(new DataParameter("@Group_Selected", "0"));
                                            InsSubModId = ClsDataBase.Insert("[MYCORTEX].TBLDOCTORSHIFT_DETAILS_SP_INSERTUPDATE", param7, true);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var data = (Convert.ToInt64(flag));
                return data;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                // return null;
            }
            return 0;
        }

        /// <summary>      
        ///Settings  --> Doctor Shift (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param>        
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        public New_DoctorShiftModel DoctorShift_View(long Id, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@doctor_id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[Doctor_Shift_Details_SP]", param);
                New_DoctorShiftModel INS = (from p in dt.AsEnumerable()
                                        select
                                        new New_DoctorShiftModel()
                                        {
                                            ID = p.Field<long>("ID"),
                                            DoctorId = p.Field<long>("DOCTOR_ID"),
                                            FromDate = p.Field<DateTime>("FROMDATE"),
                                            ToDate = p.Field<DateTime>("TODATE"),
                                            //IsActive = p.Field<int>("ISACTIVE"),
                                            CreatedBy = p.Field<long>("CREATED_BY"),
                                            //ModifiedBy = p.Field<long>("MODIFIED_BY"),
                                            NewAppointment = p.Field<int>("NEWAPPOINTMNET"),
                                            FollowUp = p.Field<int>("FOLLOWUP"),
                                            Intervel = p.Field<int>("INTERVAL"),
                                            CustomSlot = p.Field<int>("CUSTOM_SLOT"),
                                            BookingOpen = p.Field<int>("BOOKING_OPEN"),
                                            BookingCancelLock = p.Field<int>("BOOKING_CANCEL_LOCK"),
                                            DepartmentId = p.Field<long>("DEPARTMENT_ID"),
                                        }).FirstOrDefault();
                INS.SelectedDaysList = DoctorShiftDayDetails_View(INS.ID, Login_Session_Id);
                INS.CC_CG = DoctorShift_CCCG_View(INS.ID);
                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<CcCg> DoctorShift_CCCG_View(long ID)
        {

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@DoctorShift_id", ID));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DoctorShift_CCCG_View]", param);
            List<CcCg> INS1 = (from p in dt.AsEnumerable()
                               select new CcCg()
                               {
                                   //ID = p.Field<long>('Id'),
                                   CcCg_Id = p.Field<long>("Cc_Cg"),
                                   IsActive = p.Field<int>("IsActive"),
                               }).ToList();
            return INS1;
        }

        /// <summary>
        /// Settings - Doctor Shift Details List - Action - Active
        /// Selected institution details to be activated again by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Doctor Shift details to activate again from Doctor Shift database</returns>
        public IList<DoctorShiftModel> DoctorShift_Active(DoctorShiftModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", noteobj.Id));
            param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLDOCTORSHIFT_SP_ACTIVE", param);
                IList<DoctorShiftModel> list = (from p in dt.AsEnumerable()
                                                select new DoctorShiftModel()
                                                {
                                                    flag = p.Field<int>("flag")
                                                }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }

        /// <summary>
        /// Settings - Doctor Shift Details List - Action - Inactive
        /// Selected institution details to be Inactivated again by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Doctor Shift details to Inactivated again from Doctor Shift database</returns>
        public IList<DoctorShiftModel> DoctorShift_Delete(DoctorShiftModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", noteobj.Id));
            param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLDOCTORSHIFT_SP_INACTIVE", param);
                IList<DoctorShiftModel> list = (from p in dt.AsEnumerable()
                                                select new DoctorShiftModel()
                                                {
                                                    flag = p.Field<int>("flag")
                                                }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Doctor Shift details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param>        
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        public IList<ShiftTimingsModel> Shift_List(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[SHIFTNAME_SP_LIST]", param);
                List<ShiftTimingsModel> lst = (from p in dt.AsEnumerable()
                                               select new ShiftTimingsModel()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   InstituteId = p.Field<long>("INSTITUTION_ID"),
                                                   ShiftName = p.Field<string>("SHIFTNAME"),
                                                   IsActive = p.Field<int>("IsActive")
                                               }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Doctor Shift details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param>        
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        public IList<WeekDayModel> Days_List(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[WEEKDAYS_SP_LIST]", param);
                List<WeekDayModel> INS = (from p in dt.AsEnumerable()
                                          select
                                          new WeekDayModel()
                                          {
                                              Id = p.Field<long>("Id"),
                                              Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                              WeekDayName = p.Field<string>("WEEKDAYNAME"),
                                              WeekDayNumber = p.Field<string>("WEEKDAYNUMBER"),
                                              IsActive = p.Field<int>("ISACTIVE"),
                                              OrderNumber = p.Field<int>("ORDERNUMBER"),
                                          }).ToList();
                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> Active Doctor Shift List details (menu) -- > List Page (result)
        /// to get the list of Doctor Shift List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Doctor Shift</param> 
        /// <param name="Id">Id of a Institution Id</param> 
        /// <param name="Id">Id of a Doctor Id</param> 
        /// <returns>Populated List of Doctor Shift list Details DataTable</returns>
        public DoctorShiftModel ActivateDoctorShift_List(long Id, long Institution_Id, long Doctor_Id)
        {
            // int returnval;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@DOCTOR_ID", Doctor_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ACTIVEDOCOTRSHIFT_SP_CHECK", param);

                DoctorShiftModel lst = (from p in dt.AsEnumerable()
                                        select new DoctorShiftModel()
                                        {
                                            returnval = p.Field<int>("val")

                                        }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IList<AppointmentTimeZone> GetTimeZoneList()
        {
            // int returnval; 
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.APPOINTMENT_TIMEZONE_SETTINGS ");

                IList<AppointmentTimeZone> lst = (from p in dt.AsEnumerable()
                                                  select new AppointmentTimeZone()
                                                  {
                                                      TimeZoneId = p.Field<long>("TimeZoneID"),
                                                      TimeZoneName = p.Field<string>("TimeZoneName"),
                                                      UtcOffSet = p.Field<string>("UTCOFFSET"),
                                                      TimeZoneDisplayName = p.Field<string>("TimeZoneDisplayName"),
                                                      IsActive = p.Field<int>("IsActive")

                                                  }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public IList<OrgAppointmentSettings> GetOrgAppointmentSettings(Guid Login_Session_Id, OrgAppointmentSettings InObj)
        {
            long InsertId = 0;
            string flag = "";
            long Inserted_Group_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", InObj.ID));
            param.Add(new DataParameter("@InstitutionId", InObj.InstitutionId));
            param.Add(new DataParameter("@AppointmentDays", InObj.MinRescheduleDays));
            param.Add(new DataParameter("@CancelAppointmentMinutes", InObj.MinRescheduleMinutes));
            param.Add(new DataParameter("@TimeZone", InObj.DefautTimeZone));
            param.Add(new DataParameter("@HolidayBooking", InObj.IsAppointmentInHolidays));
            param.Add(new DataParameter("@CC", InObj.IsCc));
            param.Add(new DataParameter("@CG", InObj.IsCg));
            param.Add(new DataParameter("@CL", InObj.IsCl));
            param.Add(new DataParameter("@SC", InObj.IsSc));
            param.Add(new DataParameter("@Patient", InObj.IsPatient));
            param.Add(new DataParameter("@ConfirmBooking", InObj.IsDirectAppointment));
            param.Add(new DataParameter("@IsAutoReschedule", InObj.IsAutoReschedule));
            param.Add(new DataParameter("@MaxScheduleDays", InObj.MaxScheduleDays));
            param.Add(new DataParameter("@CreatedBy", InObj.CreatedBy));


            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.ORGAPPOINTMENT_SETTINGS_INSERTUPDATE", param);
                DataRow dr = dt.Rows[0];
                if (dr.IsNull("ID") == true)
                {
                    InsertId = 0;
                }
                else
                {
                    InsertId = long.Parse((dr["ID"].ToString()));
                }

                if (InsertId > 0)
                {
                    
                    List<DataParameter> param2 = new List<DataParameter>();
                    param2.Add(new DataParameter("@ID", InObj.ID));
                    param2.Add(new DataParameter("@MYAPPCONFIG_ID", InsertId));
                    param2.Add(new DataParameter("@NewAppointment", InObj.NewAppointmentDuration));
                    param2.Add(new DataParameter("@FollowUp", InObj.FollowUpDuration));
                    param2.Add(new DataParameter("@AppointmentInterval", InObj.AppointmentInterval));
                    param2.Add(new DataParameter("@WorkingDays", InObj.DefaultWorkingDays));
                    param2.Add(new DataParameter("@HoliDays", InObj.DefaultHoliDays));
                    param2.Add(new DataParameter("@CreatedBy", InObj.CreatedBy));
                    Inserted_Group_Id = ClsDataBase.Insert("MYCORTEX.ORGAPPOINTMENT_MYAPPCONFIGDET_INSERTUPDATE", param2, true);

                    if (InObj.ReminderTimeInterval != null)
                    {

                        foreach (ReminderUserLists item in InObj.ReminderTimeInterval)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@Id", item.ID));
                            param1.Add(new DataParameter("@MYREMINDERID", InsertId));
                            param1.Add(new DataParameter("@ReminderDays", item.ReminderDays));
                            param1.Add(new DataParameter("@ReminderHours", item.ReminderHours));
                            param1.Add(new DataParameter("@ReminderMinutes", item.ReminderMinutes));
                            param1.Add(new DataParameter("@IsActive", item.IsActive));
                            param1.Add(new DataParameter("@CreatedBy", InObj.CreatedBy));
                            param1.Add(new DataParameter("@InstitutionId", InObj.InstitutionId));
                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].[APPOINTMENTREMINDERUSER_INSERTUPDATE]", param1, true);
                        }

                    }
                }
                IList<OrgAppointmentSettings> INS = (from p in dt.AsEnumerable()
                                                     select
                                                     new OrgAppointmentSettings()
                                                     {

                                                         MinRescheduleDays = p.Field<int>("MinRescheduleDays"),
                                                         MinRescheduleMinutes = p.Field<int>("MinRescheduleMinutes"),
                                                         DefautTimeZone = p.Field<string>("TimeZone"),
                                                         IsAppointmentInHolidays = p.Field<bool>("IsAppointmentInHolidays"),
                                                         IsCc = p.Field<bool>("Iscc"),
                                                         IsCg = p.Field<bool>("Iscg"),
                                                         IsCl = p.Field<bool>("Iscl"),
                                                         IsSc = p.Field<bool>("Issc"),
                                                         IsPatient = p.Field<bool>("IsPatient"),
                                                         IsDirectAppointment = p.Field<bool>("IsDirectAppointment"),
                                                         IsAutoReschedule = p.Field<bool>("IsAutoReschedule"),
                                                         MaxScheduleDays = p.Field<int>("MaxScheduleDays"),
                                                         Flag = p.Field<int>("Flag")
                                                     }).ToList();
                return INS;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;

            }

        }

        public OrgAppointmentSettings APPOINTMENTLISTDETAILS(long InstitutionId)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
           
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.ORGAPPOINTMENTLIST_VIEW", param);

                OrgAppointmentSettings list = (from p in dt.AsEnumerable()
                                     select new OrgAppointmentSettings()
                                     {

                                         ID = p.Field<long>("ID"),
                                         InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                         MyAppConfigId = p.Field<long>("MYAPPCONFIG_ID"),
                                         NewAppointmentDuration = p.Field<int>("NEWAPPOINTMENT_DURATION"),
                                         FollowUpDuration = p.Field<int>("FOLLOWUP_DURATION"),
                                         AppointmentInterval = p.Field<int>("APPOINTMENT_INTERVAL"),
                                         DefaultWorkingDays= p.Field<string>("DEFAULT_WORKINGDAYS"),
                                         DefaultHoliDays = p.Field<string>("DEFAULT_HOLIDAYS"),
                                         MinRescheduleDays = p.Field<int>("MIN_RESCHEDULE_DAYS"),
                                         MinRescheduleMinutes = p.Field<int>("MIN_RESCHEDULE_MINUTES"),
                                         DefautTimeZone = p.Field<string>("DEFAUT_TIMEZONE"),
                                         IsAppointmentInHolidays = p.Field<bool>("IS_APPOINTMENTINHOLIDAYS"),
                                         IsCc = p.Field<bool>("IS_CC"),
                                         IsCg = p.Field<bool>("IS_CG"),
                                         IsCl = p.Field<bool>("IS_CL"),
                                         IsSc = p.Field<bool>("IS_SC"),
                                         IsPatient = p.Field<bool>("IS_PATIENT"),
                                         IsDirectAppointment = p.Field<bool>("IS_DIRECTAPPOINTMENT"),
                                         IsAutoReschedule = p.Field<bool>("IS_AUTORESCHEDULE"),
                                         MaxScheduleDays = p.Field<int>("MAX_SCHEDULE_DAYS"),
                                         CreatedBy = p.Field<long>("CREATED_BY"),
                                         IsActive =  p.Field<int>("ISACTIVE")

                                     }).FirstOrDefault();
                if (list != null)
                {
                    
                    list.ReminderTimeInterval = ReminderUserLists(list.MyAppConfigId,list.InstitutionId);
                }
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<ReminderUserLists> ReminderUserLists(long MyAppConfigId,long InstitutionId)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@MYAPPCONFIGID", MyAppConfigId));
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[REMINDERUSERS_SP_VIEW]", param);
            List<ReminderUserLists> INS = (from p in dt.AsEnumerable()
                                     select new ReminderUserLists()
                                     {
                                         ID = p.Field<long>("ID"),
                                         InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                         ReminderDays = p.Field<int>("REMINDER_DAYS"),
                                         ReminderHours = p.Field<int>("REMINDER_HOURS"),
                                         ReminderMinutes = p.Field<int>("REMINDER_MINUTES"),
                                         IsActive = p.Field<int>("ISACTIVE")
                                     }).ToList();
            return INS;
        }
        public void APPOINTMENTRESETDETAILS(long InstitutionId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("MYCORTEX.ORGAPPOINTMENTLIST_DELETE", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }
    }
}