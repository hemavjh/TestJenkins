using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using log4net;
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.Masters.Models;


namespace MyCortex.Repositories.Masters
{
    public class MyHomeRepository : IMyHomeRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public MyHomeRepository()
        {

            db = new ClsDataBase();
        }
       
        public IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber)
        {
            //  DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.MYHOME_TAB_SP_LIST", param);
                DataEncryption DecryptFields = new DataEncryption();
                 List<TabListModel> list = (from p in dt.AsEnumerable()  
                                       select new TabListModel()
                                       {
                                           TotalRecord = p.Field<string>("TotalRecords"),
                                           ID = p.Field<long>("ID"),
                                           TabName = p.Field<string>("TAB_NAME"),
                                           RefId = p.Field<string>("REF_ID"),
                                           Model = p.Field<string>("MODEL"),
                                           OS=p.Field<string>("OS"),
                                           UsersCount=p.Field<int>("NUMBER_USERS"),
                                           DevicesCount=p.Field<int>("NUMBER_DEVICES"),
                                           IsActive =p.Field<bool>("ISACTIVE")
                                       }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabListModel> Tab_InsertUpdate(TabListModel insobj)
        {


            long InsertId = 0;
            string flag = "";
            long Inserted_Group_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.ID));
            param.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
            param.Add(new DataParameter("@TAB_NAME", insobj.TabName));
            param.Add(new DataParameter("@REF_ID", insobj.RefId));
            param.Add(new DataParameter("@MODEL", insobj.Model)); 
            param.Add(new DataParameter("@OS", insobj.OS));
            param.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
            param.Add(new DataParameter("@VENDOR", ""));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.MYHOME_TAB_SP_INSERTUPDATE", param);
                DataRow dr = dt.Rows[0];
                if (dr.IsNull("Id") == true)
                {
                    InsertId = 0;
                }
                else
                {
                    InsertId = long.Parse((dr["Id"].ToString()));
                }
                if (InsertId > 0)
                {
                    if (insobj.UserList != null)
                    {
                        foreach (TabUserList item in insobj.UserList)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            List<DataParameter> param_1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@User_Id", item.ID));
                            param1.Add(new DataParameter("@TAB_ID", InsertId)); 
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
                            param1.Add(new DataParameter("@ISACTIVE", item.IsActive));
                            param1.Add(new DataParameter("@PIN", insobj.PIN)); 

                            var objExist = insobj.SelectedTabUserList.Where(ChildItem => ChildItem.Id == item.ID);

                            if (objExist.ToList().Count > 0)
                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                param1.Add(new DataParameter("@Userlist_Selected", "1")); 
                               
                            else
                                param1.Add(new DataParameter("@Userlist_Selected", "0"));

                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].USER_SP_INSERTUPDATE_TABADDITIONALDETAILS", param1, true);
                        }
                    }
                    if (insobj.DevicesList != null)
                    {
                        foreach (TabDevicesList item in insobj.DevicesList)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@DeviceID", item.ID));
                            param1.Add(new DataParameter("@TAB_ID", InsertId)); 
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
                            param1.Add(new DataParameter("@ISACTIVE", item.IsActive)); 
                            var objExist = insobj.SelectedTabDeviceList.Where(ChildItem => ChildItem.DeviceId == item.ID);

                            if (objExist.ToList().Count > 0)
                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                param1.Add(new DataParameter("@DeviceList_Selected", "1"));
                            else
                                param1.Add(new DataParameter("@DeviceList_Selected", "0"));

                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].USER_SP_INSERTUPDATE_DEVICEADDITIONALDETAILS", param1, true);
                        }
                    }
                }
                    IList<TabListModel> INS = (from p in dt.AsEnumerable()
                                            select
                                            new TabListModel()
                                            {
                                                    //  Id = p.Field<long>("ID"),
                                                //ID = p.Field<long>("ID"),
                                                TabName = p.Field<string>("TAB_NAME"),
                                                RefId = p.Field<string>("REF_ID"),
                                                Model = p.Field<string>("MODEL"),
                                                OS = p.Field<string>("OS"),
                                                UsersCount = p.Field<int>("NUMBER_USERS"),
                                                DevicesCount = p.Field<int>("NUMBER_DEVICES"),
                                                IsActive = p.Field<bool>("ISACTIVE"),
                                                Flag = p.Field<int>("flag")
                                            }).ToList();
                return INS;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
            
        }
        public TabListModel Tab_ListView(int id)
            {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", id)); 
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.MYHOME_TAB_SP_LIST_View", param);
                
                TabListModel list = (from p in dt.AsEnumerable()
                                     select new TabListModel()
                                     {
                                              
                                               ID = p.Field<long>("ID"),
                                               TabName = p.Field<string>("TAB_NAME"),
                                               RefId = p.Field<string>("REF_ID"),
                                               Model = p.Field<string>("MODEL"),
                                               OS = p.Field<string>("OS"),
                                               UsersCount = p.Field<int>("NUMBER_USERS"),
                                               DevicesCount = p.Field<int>("NUMBER_DEVICES"),
                                               DeviceName = p.Field<string>("DeviceName"),
                                               UserName = DecryptFields.Decrypt(p.Field<string>("UserName")),
                                               PIN = p.Field<string>("PIN")

                                     }).FirstOrDefault();
                if (list != null)
                {
                    list.SelectedTabDeviceList = USERDEVICEDETAILS_VIEW(list.ID);
                    list.SelectedTabUserList = USERTABDETAILS_VIEW(list.ID);
                }
               return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<UserTabDevicesList> USERDEVICEDETAILS_VIEW(long Id)
        {
          
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERDEVICEDETAILS_SP_VIEW]", param);
            List<UserTabDevicesList> INS = (from p in dt.AsEnumerable()
                                            select new UserTabDevicesList()
                                            {
                                                Id = p.Field<long>("Id"),
                                                TabId = p.Field<long>("TAB_ID"), 
                                                DeviceName = p.Field<string>("DEVICENAME"),
                                                IsActive = p.Field<bool>("ISACTIVE")
                                            }).ToList();
            return INS;
        }

        public IList<UserTabUserList> USERTABDETAILS_VIEW(long Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTABDETAILS_SP_VIEW]", param);
            List<UserTabUserList> INS = (from p in dt.AsEnumerable()
                                            select new UserTabUserList()
                                            {
                                                Id = p.Field<long>("Id"),
                                                TabId= p.Field<long>("TAB_ID"),
                                                UserId = p.Field<long>("USER_ID"),
                                                UserFullName = DecryptFields.Decrypt(p.Field<string>("USERNAME")),
                                                PIN = p.Field<string>("PIN"),
                                                IsActive=p.Field<bool>("ISACTIVE")
                                            }).ToList();
            return INS;
        }

        public void Tab_List_Delete(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("MYCORTEX.MYHOME_TAB_SP_LIST_DELETE", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }

        public IList<TabDevicesModel> Get_TabDevices(long Institution_ID, long Tab_ID)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@Tab_ID", Tab_ID));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_DEVICE_LIST]", param);
                List<TabDevicesModel> lst = (from p in dt.AsEnumerable()
                                             select new TabDevicesModel()
                                             {
                                                 ID = p.Field<long>("ID"),
                                                 DeviceId = p.Field<string>("DEVICE_ID"),
                                                 DeviceName = p.Field<string>("DEVICE_NAME"), 
                                                 Make = p.Field<string>("MAKE"),
                                                 DeviceType = p.Field<string>("DEVICE_TYPE"),
                                                 Series = p.Field<string>("SERIES"),
                                                 ModelNumber = p.Field<string>("MODEL"),
                                                 Purpose = p.Field<string>("PURPOSE"),
                                                 Parameter= p.Field<string>("PARAMETER"),
                                                 IsActive = p.Field<bool>("ISACTIVE")
                                             }).ToList();

                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabUserModel> Get_TabUsers(long Institution_ID, long Tab_ID)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@Tab_ID", Tab_ID));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_USERS_LIST]", param);
                List<TabUserModel> lst = (from p in dt.AsEnumerable()
                                          select new TabUserModel()
                                          {
                                              ID = p.Field<long>("ID"),
                                              UserId = p.Field<long>("USER_ID"),
                                              PIN = p.Field<string>("PIN"),
                                              //PHOTO = p.Field<string>("PHOTO"),
                                              FingerPrint = p.Field<string>("FINGERPRINT"),
                                              IsActive = p.Field<bool>("ISACTIVE"),
                                              FirstName = DecryptFields.Decrypt(p.Field<string>("FIRSTNAME")),
                                              MiddleName = DecryptFields.Decrypt(p.Field<string>("MIDDLENAME")),
                                              LastName = DecryptFields.Decrypt(p.Field<string>("LASTNAME")),
                                              EmailId = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                              UserTypeId = p.Field<long>("USERTYPE_ID"),
                                              GenderId = p.Field<long>("GENDER_ID"),
                                              GenderName = p.Field<string>("GENDER_NAME"),
                                          }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabUserDetails> Get_TabLoginUserDetails(TabUserDetails TabLoginObj)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>(); 
            param.Add(new DataParameter("@Tab_ID", TabLoginObj.TabId));
            param.Add(new DataParameter("@UserId", TabLoginObj.UserId));
            param.Add(new DataParameter("@Pin", TabLoginObj.PIN));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_USERSINFOR_LIST]", param);
               
                    List<TabUserDetails> lst = (from p in dt.AsEnumerable()
                                                select new TabUserDetails()
                                                {
                                                    TabId = p.Field<long>("TAB_ID"),
                                                    UserId = p.Field<long>("USER_ID"),
                                                    PIN = p.Field<string>("PIN"),
                                                    ModifiedDate = p.Field<DateTime?>("MODIFIED_AT"),
                                                    IsActive = p.Field<bool>("ISACTIVE"),
                                                    FirstName = DecryptFields.Decrypt(p.Field<string>("FIRSTNAME")),
                                                    MiddleName = DecryptFields.Decrypt(p.Field<string>("MIDDLENAME")),
                                                    LastName = DecryptFields.Decrypt(p.Field<string>("LASTNAME")),
                                                    EmailId = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                                    UserTypeId = p.Field<long>("USERTYPE_ID"),
                                                    UserName = DecryptFields.Decrypt(p.Field<string>("UserName")),
                                                    Flag = p.Field<int>("flag")
                                                }).ToList();
             
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public  TabUserDashBordDetails  GetDashBoardListDetails(long InstitutionId, long UserId, long TabId, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            string DeviceType = "TAB";
            
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            param.Add(new DataParameter("@USERID",UserId));
            param.Add(new DataParameter("@TABID",TabId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt_1 = ClsDataBase.GetDataTable("[MYCORTEX].[UNITGROUPTYPE_SP_LIST]");
                TabUserDashBordDetails Get_UsersGroupId = (from p in dt_1.AsEnumerable()
                                            select new TabUserDashBordDetails()
                                            {
                                                UserGroupId = p.Field<long>("ID"),
                                                UserGroupName = p.Field<string>("UNITSGROUPNAME"),
                                                IsActive = p.Field<int>("ISACTIVE")

                                            }).FirstOrDefault();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TABDASHBOARDUSERDETAILS]", param);  
                
                TabUserDashBordDetails  lst = (from p in dt.AsEnumerable()
                                            select new TabUserDashBordDetails()
                                            {  
                                                UserId = p.Field<long>("UserId"),
                                                TabId = p.Field<long>("TabId"),
                                                UserTypeId = p.Field<long>("UserTypeId"),
                                                InstitutionId =p.Field<long>("InstitutionId"),
                                                DeviceType = DeviceType,  
                                                Flag = p.Field<int>("Flag"),

                                                UserDetails = new TabDeviceUserDetails()
                                                {
                                                    UserName = DecryptFields.Decrypt(p.Field<string>("UserName")),
                                                    PhotoLobThumb =p.IsNull("PhotoThump") ? null : decrypt.DecryptFile(p.Field<byte[]>("PhotoThump"))
                                                }, 
                                            }).FirstOrDefault();
                if (lst != null)
                {

                    if(Get_UsersGroupId.UserGroupName == "Metric")
                    {
                        Get_UsersGroupId.UserGroupId = 1;
                    }else
                    {
                        Get_UsersGroupId.UserGroupId = 2;
                    }

                    lst.TabParameterList = GroupParameterNameList(lst.UserId, Get_UsersGroupId.UserGroupId);
                    lst.TabAlertsList = Get_ParameterValue(lst.UserId,lst.UserTypeId,Login_Session_Id);
                    lst.TabAppointmentList = DoctorAppoinmentsList(lst.UserId, Login_Session_Id);
                    lst.TabMedicationList = MedicationView(lst.UserId, Login_Session_Id);
                }

                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabDashBoardAlertDetails> Get_ParameterValue(long PatientId, long UserTypeId, Guid Login_Session_Id)
        {
             var sessionId = HttpContext.Current.Session.SessionID;
            //var result = Guid(sessionId);
         
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PatientId", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                DataEncryption DecryptFields = new DataEncryption();
                DataTable dt = new DataTable();
                if (UserTypeId == 6)
                {
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETPARAMETERVALUE_SP_LIST]", param);
                }
                else
                {
                    param.Add(new DataParameter("@VIEWUSER", UserTypeId));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[CAREGIVER_GETPARAMETERVALUE_SP_LIST]", param);
                }
                List<TabDashBoardAlertDetails> list = (from p in dt.AsEnumerable()
                                                     select new TabDashBoardAlertDetails()
                                                     {
                                                         ID = p.Field<long>("Id"),
                                                         PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                         HighCount = p.Field<int>("HighCount"),
                                                         MediumCount = p.Field<int>("MediumCount"),
                                                         LowCount = p.Field<int>("LowCount"),
                                                         ParameterName = p.Field<string>("ParameterName"),
                                                         ParameterValue = p.Field<decimal?>("PARAMETERVALUE"),
                                                         Average = p.Field<decimal?>("AVERAGE"),
                                                         UnitName = p.Field<string>("UnitName"),
                                                         PageType = p.Field<string>("PageType"),
                                                         ActivityDate = p.Field<DateTime?>("ACTIVITY_DATE"),
                                                         DeviceType = p.Field<string>("DEVICETYPE"),
                                                         DeviceNo = p.Field<string>("DEVICE_NO"),
                                                         FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                         TypeName = p.Field<string>("TYPENAME"),
                                                         CreatedByShortName = p.Field<string>("CREATEDBY_SHORTNAME"),
                                                         ComDurationType = p.Field<string>("DurationType"),
                                                     }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        public IList<TabDeviceParameterDetails> GroupParameterNameList(long Patient_Id, long UnitGroupType_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@ParamGroup_Id", Group_Id));
            try
            {
                param.Add(new DataParameter("@Patient_Id", Patient_Id));
                param.Add(new DataParameter("@UNITSGROUP_ID", UnitGroupType_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTIONGROUPBASED_SP_PARAMETER_TABDASHBOARD]", param);
                List<TabDeviceParameterDetails> list = (from p in dt.AsEnumerable()
                                                  select new TabDeviceParameterDetails()
                                                  {

                                                      GroupId = p.Field<long>("PARAMGROUP_ID"),
                                                      ParameterId = p.Field<long>("PARAMETER_ID"),
                                                      ParameterName = p.Field<string>("PARAMETERNAME"),
                                                      GroupName = p.Field<string>("PARAMGROUPNAME"),
                                                      MaxPossible = p.IsNull("MAX_POSSIBLE") ? 0 : p.Field<decimal>("MAX_POSSIBLE"),
                                                      MinPossible = p.IsNull("MIN_POSSIBLE") ? 0 : p.Field<decimal>("MIN_POSSIBLE"),
                                                      Average = p.IsNull("AVERAGE") ? 0 : p.Field<decimal>("AVERAGE"),
                                                      ParameterHasChild = p.Field<int?>("HASCHILD"),
                                                      ParameterParentId = p.Field<int?>("PARENT_ID"),
                                                      UomId = p.Field<long>("UOM_ID"),
                                                      UomName = p.Field<string>("UOM_NAME"),
                                                      RangeMax = p.IsNull("NORMALRANGE_HIGH") ? 0 : p.Field<decimal>("NORMALRANGE_HIGH"),
                                                      RangeMin = p.IsNull("NORMALRANGE_LOW") ? 0 : p.Field<decimal>("NORMALRANGE_LOW"),
                                                      IsFormulaParam = p.Field<int>("FORMULAPARAM")

                                                  }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabDashBoardAppointmentDetails> DoctorAppoinmentsList(long PatientId, Guid Login_Session_Id)
        {
            DataEncryption decrypt = new DataEncryption();
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENTID", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DOCTORAPPOINMENTS_SP_VIEW]", param);
                List<TabDashBoardAppointmentDetails> lst = (from p in dt.AsEnumerable()
                                                      select new TabDashBoardAppointmentDetails()
                                                      {
                                                          ID = p.Field<long>("Id"),
                                                          InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                          PatientId = p.Field<long>("PATIENT_ID"),
                                                          DoctorId = p.Field<long>("DOCTOR_ID"),
                                                          AppointmentDate = p.Field<DateTime>("APPOINTMENT_DATE"),
                                                          AppointmentFromTime = p.Field<DateTime>("APPOINTMENT_FROMTIME"),
                                                          AppointmentToTime = p.Field<DateTime>("APPOINTMENT_TOTIME"),
                                                          AppointmentType = p.Field<long>("APPOINTMENT_TYPE"),
                                                          ReasonForVisit = p.Field<string>("REASONFOR_VISIT"),
                                                          Remarks = p.Field<string>("REMARKS"), 
                                                          CancelledDate = p.Field<DateTime?>("CANCELED_DATE"),
                                                          CancelledRemarks = p.Field<string>("CANCEL_REMARKS"), 
                                                          CreatedBy = p.Field<int>("CREATED_BY"),
                                                          DoctorName = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                                          PatientName = DecryptFields.Decrypt(p.Field<string>("PATIENTNAME")), 
                                                          CreatedByName = DecryptFields.Decrypt(p.Field<string>("CREATEDBYNAME")),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          CreatedDt = p.Field<DateTime>("CREATED_DT"),
                                                      }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabDashBoardMedicationDetails> MedicationView(long Id, Guid Login_Session_Id)
        {
            //long ViewId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_MEDICATION_SP_VIEW", param);
            IList <TabDashBoardMedicationDetails> View = (from p in dt.AsEnumerable()
                                      select
                                      new TabDashBoardMedicationDetails()
                                      {
                                          ID = p.Field<long>("ID"),
                                          FrequencyId = p.Field<long?>("FREQUENCYID"),
                                          FrequencyName = p.Field<string>("FREQUENCYNAME"),
                                          RouteId = p.Field<long?>("ROUTEID"),
                                          RouteName = p.Field<string>("ROUTENAME"),
                                          DrugId = p.Field<long?>("DRUGID"),
                                          DrugCode = p.Field<string>("DRUGCODE"),
                                          StartDate = p.Field<DateTime>("STARTDATE"),
                                          EndDate = p.Field<DateTime>("ENDDATE"),
                                          GenericName = p.Field<string>("GENERIC_NAME"),
                                          ItemCode = p.Field<string>("ITEMCODE"),
                                          StrengthName = p.Field<string>("STRENGTHNAME"),
                                          DosageFromName = p.Field<string>("DOSAGEFORMNAME"),
                                          NoOfDays = p.Field<decimal?>("NO_OF_DAYS")
                                      }).ToList();
            return View;

        }

        public IList<TabDevicesModel> Get_DeviceList(int? IsActive, long Institution_ID)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICE_SP_LIST]", param);
                List<TabDevicesModel> lst = (from p in dt.AsEnumerable()
                                             select new TabDevicesModel()
                                             {
                                                 ID = p.Field<long>("ID"),
                                                 DeviceId = p.Field<string>("DEVICE_ID"),
                                                 DeviceName = p.Field<string>("DEVICE_NAME"),
                                                 Make = p.Field<string>("MAKE"),
                                                 ModelNumber = p.Field<string>("MODEL"),
                                                 DeviceType = p.Field<string>("DEVICE_TYPE"),

                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<TabDevicesModel> Device_InsertUpdate(TabDevicesModel insobj)
        {
            long InsertId = 0;
            string flag = "";
            long Inserted_Group_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.ID));
            param.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
            param.Add(new DataParameter("@DEVICE_ID", insobj.DeviceId));
            param.Add(new DataParameter("@DEVICE_NAME", insobj.DeviceName));
            param.Add(new DataParameter("@DEVICE_TYPE", insobj.DeviceType));
            param.Add(new DataParameter("@MODEL", insobj.ModelNumber));
            //param.Add(new DataParameter("@PARAMETER", insobj.Parameter));
            param.Add(new DataParameter("@MAKE", insobj.Make));
            param.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[Device_SP_INSERTUPDATE]", param);
                DataRow dr = dt.Rows[0];
                if (dr.IsNull("Id") == true)
                {
                    InsertId = 0;
                }
                else
                {
                    InsertId = long.Parse((dr["Id"].ToString()));
                }
                if (InsertId > 0)
                {

                    if (insobj.ParameterList != null)
                    {
                        foreach (DeviceParameterList item in insobj.ParameterList)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@PARAMETER_ID", item.ID));
                            param1.Add(new DataParameter("@DEVICEROW_ID", InsertId));
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
                            param1.Add(new DataParameter("@ISACTIVE", item.IsActive));
                            var objExist = insobj.SelectedDeviceParameterList.Where(ChildItem => ChildItem.ID == item.ID);

                            if (objExist.ToList().Count > 0)
                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                param1.Add(new DataParameter("@Devicelist_Selected", "1"));
                            else
                                param1.Add(new DataParameter("@Devicelist_Selected", "0"));

                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].[DEVICEPARAMETER_SP_INSERTUPDATE]", param1, true);
                        }
                    }

                    IList<TabDevicesModel> INS = (from p in dt.AsEnumerable()
                                                  select
                                                  new TabDevicesModel()
                                                  {
                                                      ID = p.Field<long>("ID"),
                                                      DeviceId = p.Field<string>("DEVICE_ID"),
                                                      DeviceName = p.Field<string>("DEVICE_NAME"),
                                                      Make = p.Field<string>("MAKE"),
                                                      ModelNumber = p.Field<string>("MODEL"),
                                                      DeviceType = p.Field<string>("DEVICE_TYPE"),
                                                      Flag = p.Field<int>("flag")
                                                  }).ToList();
                    return INS;

                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }

        public TabDevicesModel Device_ListView(long id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICELIST_SP_VIEW]", param);

                TabDevicesModel list = (from p in dt.AsEnumerable()
                                        select new TabDevicesModel()
                                        {

                                            ID = p.Field<long>("ID"),
                                            DeviceId = p.Field<string>("DEVICE_ID"),
                                            DeviceName = p.Field<string>("DEVICE_NAME"),
                                            Make = p.Field<string>("MAKE"),
                                            ModelNumber = p.Field<string>("MODEL"),
                                            DeviceType = p.Field<string>("DEVICE_TYPE")

                                        }).FirstOrDefault();
                if (list != null)
                {
                    list.ParameterList = DEVICEDETAILS_VIEW(list.ID);
                }
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<DeviceParameterList> DEVICEDETAILS_VIEW(long Id)
        {

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICE_SP_LIST_VIEW]", param);
            List<DeviceParameterList> INS = (from p in dt.AsEnumerable()
                                             select new DeviceParameterList()
                                             {
                                                 //ID = p.Field<long>('Id'),
                                                 ParameterName = p.Field<string>("PARAMETERNAME"),
                                             }).ToList();
            return INS;
        }

        public void Device_List_Delete(int Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                ClsDataBase.Update("[MYCORTEX].[DEVICE_SP_LIST_DELETE]", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
        }


    }

}