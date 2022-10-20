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
    public class MyHomeRepository : IMyHomeRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public MyHomeRepository()
        {

            db = new ClsDataBase();
        }
       
        public IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber, long HiveType)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@HIVETYPE", HiveType));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.MYHOME_TAB_SP_LIST", param);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabListModel> Tab_InsertUpdate(TabListModel insobj)
        {

             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long InsertId = 0;
            string flag = "";
            long Inserted_Group_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.ID));
            param.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
            param.Add(new DataParameter("@TAB_NAME", insobj.TabName));
            //param.Add(new DataParameter("@REF_ID", insobj.RefId));
            param.Add(new DataParameter("@MODEL", insobj.Model));
            param.Add(new DataParameter("@OS", insobj.OS));
            param.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
            param.Add(new DataParameter("@VENDOR", ""));
            param.Add(new DataParameter("@HIVETYPE", insobj.HiveType));

            if (insobj.ID == 0)
            {
                /*_MyLogger.Exceptions("INFO", _AppLogger, "BEFORE TABREFID_AUTOCREATIION_SP", null, _AppMethod);*/
                List<DataParameter> param_2 = new List<DataParameter>();
                param_2.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
                param_2.Add(new DataParameter("@USER_ID", insobj.CreatedBy));
                //param_2.Add(new DataParameter("@MRNPREFIX", insobj.MrnPrefix));
                //param_2.Add(new DataParameter("@MRNPREFIX", insobj.MrnPrefix));
                var senddata1 = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
                /*_MyLogger.Exceptions("INFO", _AppLogger, senddata1, null, _AppMethod);*/
                DataTable dt_2 = ClsDataBase.GetDataTable("[MYCORTEX].[TABREFID_AUTOCREATIION_SP]", param_2);
                /*_MyLogger.Exceptions("INFO", _AppLogger, "TABREFID_AUTOCREATIION_SP", null, _AppMethod);*/
                TabListModel RefId = (from p in dt_2.AsEnumerable()
                                      select new TabListModel()
                                      {
                                          RefId = p.Field<string>("TABREFID"),
                                      }).FirstOrDefault();
                param.Add(new DataParameter("@REF_ID", RefId.RefId));
            }
            else
            {
                param.Add(new DataParameter("@REF_ID", insobj.RefId));
            }

            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
                            param1.Add(new DataParameter("@Id", item.ID));
                            param1.Add(new DataParameter("@User_Id", item.UserId));
                            param1.Add(new DataParameter("@TAB_ID", InsertId));
                            param1.Add(new DataParameter("@PIN", item.PIN));
                            param1.Add(new DataParameter("@ISACTIVE", item.IsActive));
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].[USER_SP_INSERTUPDATE_TABADDITIONALDETAILS]", param1, true);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabListModel> Tab_Insert_Update(TabListModel insobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.ID));
            param.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
            param.Add(new DataParameter("@TAB_NAME", insobj.TabName));
            param.Add(new DataParameter("@MODEL", insobj.Model));
            param.Add(new DataParameter("@VENDOR", ""));
            param.Add(new DataParameter("@OS", insobj.OS));
            param.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
            param.Add(new DataParameter("@HIVETYPE", insobj.HiveType));
            param.Add(new DataParameter("@USERCOUNT", insobj.UserList.Count));
            param.Add(new DataParameter("@DEVICESCOUNT", insobj.DevicesList.Count));

            if (insobj.UserList != null)
            {
                string userxmlData = "<Users>";
                foreach (TabUserList item in insobj.UserList)
                {
                    userxmlData = userxmlData + "<User>";
                    userxmlData = userxmlData + "<Id>" + item.ID + "</Id>";
                    userxmlData = userxmlData + "<User_Id>" + item.UserId + "</User_Id>";
                    userxmlData = userxmlData + "<PIN>" + item.PIN + "</PIN>";
                    userxmlData = userxmlData + "<CREATED_BY>" + insobj.CreatedBy + "</CREATED_BY>";
                    userxmlData = userxmlData + "<ISACTIVE>" + item.IsActive + "</ISACTIVE>";
                    userxmlData = userxmlData + "</User>";
                }
                userxmlData = userxmlData + "</Users>";
                param.Add(new DataParameter("@Users", userxmlData));
            }

            if (insobj.DevicesList != null)
            {
                string devicexmlData = "<Devices>";
                foreach (TabDevicesList item in insobj.DevicesList)
                {
                    devicexmlData = devicexmlData + "<Device>";
                    devicexmlData = devicexmlData + "<Id>" + item.DeviceId + "</Id>";
                    devicexmlData = devicexmlData + "<DEVICE_ID>" + item.ID + "</DEVICE_ID>";
                    devicexmlData = devicexmlData + "<CREATED_BY>" + insobj.CreatedBy + "</CREATED_BY>";
                    devicexmlData = devicexmlData + "<ISACTIVE>" + item.IsActive + "</ISACTIVE>";
                    devicexmlData = devicexmlData + "</Device>";
                }
                devicexmlData = devicexmlData + "</Devices>";
                param.Add(new DataParameter("@Devices", devicexmlData));
            }


            if (insobj.ID == 0)
            {
                List<DataParameter> param_2 = new List<DataParameter>();
                param_2.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
                param_2.Add(new DataParameter("@USER_ID", insobj.CreatedBy));
                param_2.Add(new DataParameter("@HIVETYPE", insobj.HiveType));
                DataTable dt_2 = ClsDataBase.GetDataTable("[MYCORTEX].[TABREFID_AUTOCREATIION_SP]", param_2);

                TabListModel RefId = (from p in dt_2.AsEnumerable()
                                      select new TabListModel()
                                      {
                                          RefId = p.Field<string>("TABREFID"),
                                      }).FirstOrDefault();
                param.Add(new DataParameter("@REF_ID", RefId.RefId));
            }
            else
            {
                param.Add(new DataParameter("@REF_ID", insobj.RefId));
            }

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[asp_SAV_Hive_Details]", param);

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
                                           Flag = p.Field<int>("flag"),
                                           HiveType = p.Field<long>("HIVETYPE"),
                                       }).ToList();
            return INS;
        }

        public IList<TabUserPinModel> Tab_User_Pin_Update(TabUserPinModel insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", insobj.InstitutionId));
            param.Add(new DataParameter("@TAB_ID", insobj.TabId));
            param.Add(new DataParameter("@USER_ID", insobj.UserId));
            param.Add(new DataParameter("@PIN", insobj.PIN));
            param.Add(new DataParameter("@ISTEMP", insobj.IsTemp));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.TAB_USER_PIN_UPDATE", param);
                DataRow dr = dt.Rows[0];
                
                IList<TabUserPinModel> INS = (from p in dt.AsEnumerable()
                                           select
                                           new TabUserPinModel()
                                           {
                                              Flag = p.Field<int>("flag")
                                           }).ToList();
                return INS;

            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }
        public TabListModel Tab_ListView(int id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
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
                                               OS = p.Field<string>("OS")  
                                     }).FirstOrDefault();
                if (list != null)
                {
                    list.SelectedTabDeviceList = USERDEVICEDETAILS_VIEW(list.ID);
                    list.UserList = USERTABDETAILS_VIEW(list.ID);
                }
               return list;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
                                                DeviceId = p.Field<long>("DEVICE_ID"),
                                                DeviceName = p.Field<string>("DEVICENAME"),
                                                IsActive = p.Field<bool>("ISACTIVE")
                                            }).ToList();
            return INS;
        }

        public IList<TabUserList> USERTABDETAILS_VIEW(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTABDETAILS_SP_VIEW]", param);
            List<TabUserList> INS = (from p in dt.AsEnumerable()
                                            select new TabUserList()
                                            {
                                                ID = p.Field<long>("Id"),
                                                TabId = p.Field<long>("TAB_ID"),
                                                UserId = p.Field<long>("USER_ID"),
                                                FullName = p.Field<string>("USERNAME"),
                                                PIN = p.Field<string>("PIN"),
                                                IsActive = p.Field<bool>("ISACTIVE")
                                            }).ToList();
            return INS;
        }

        public void Tab_List_Delete(int Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("MYCORTEX.MYHOME_TAB_SP_LIST_DELETE", param);
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }

        public TabIdReturnModels Get_Tab_ID(long Institution_ID, string Ref_ID)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@InstitutionId", Institution_ID));
            param.Add(new DataParameter("@Ref_Id", Ref_ID));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_TAB_ID]", param);
                TabIdReturnModels lst = (from p in dt.AsEnumerable()
                                             select new TabIdReturnModels()
                                             {
                                                 ReturnFlag = 0,
                                                 Status = "True",
                                                 Message = p.Field<string>("Messagetype"),
                                                 data = p.Field<int>("data"),
                                                 InstitutionId = p.Field<long>("InstitutionId"),
                                                 TabId = p.Field<long>("TABID"),
                                                 RefId = p.Field<string>("REFID"),
                                             }).FirstOrDefault();

                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabDevicesModel> Get_TabDevices(long Institution_ID, long Tab_ID)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@Tab_ID", Tab_ID));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_DEVICE_LIST]", param);
                List<TabDevicesModel> lst = (from p in dt.AsEnumerable()
                                             select new TabDevicesModel()
                                             {
                                                 RowNumber = p.Field<int>("ROW_NUM"),
                                                 ID = p.Field<long>("ID"),
                                                 Device_Id = p.Field<long>("DEVICE_ID"),
                                                 DeviceSerialNo = p.Field<string>("DEVICE_SERIALNO"),
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabUserModel> Get_TabUsers(long Institution_ID, long Tab_ID)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@Tab_ID", Tab_ID));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_USERS_LIST]", param);
                List<TabUserModel> lst = (from p in dt.AsEnumerable()
                                          select new TabUserModel()
                                          {
                                              ID = p.Field<long>("ID"),
                                              UnreadCount = p.Field<int>("UNREAD_COUNT"),
                                              UserId = p.Field<long>("USER_ID"),
                                              PIN = p.Field<string>("PIN"),
                                              //PHOTO = p.Field<string>("PHOTO"),
                                              PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                              FingerPrint = p.Field<string>("FINGERPRINT"),
                                              IsActive = p.Field<bool>("ISACTIVE"),
                                              FirstName = p.Field<string>("FIRSTNAME"),
                                              MiddleName = p.Field<string>("MIDDLENAME"),
                                              LastName = p.Field<string>("LASTNAME"),
                                              EmailId = p.Field<string>("EMAILID"),
                                              UserTypeId = p.Field<long>("USERTYPE_ID"),
                                              GenderId = p.Field<long>("GENDER_ID"),
                                              GenderName = p.Field<string>("GENDER_NAME"),
                                              IsTemp = p.Field<bool>("ISTEMP"),
                                          }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<ParameterModels> Parameter_Lists(long ParamGroup_ID, long TabId,long? Language_ID)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PARAMGROUPID", ParamGroup_ID));
            param.Add(new DataParameter("@Tab_ID", TabId));
            param.Add(new DataParameter("@Language_ID", Language_ID));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_PARAMETER_LIST_ON_GROUPID_LANGUAGE]", param);
                List<ParameterModels> lst = (from p in dt.AsEnumerable()
                                          select new ParameterModels()
                                          {
                                              ParameterId = p.Field<long>("ID"),
                                              ParameterName = p.Field<string>("NAME"),
                                              DisplayParameterName = p.Field<string>("DISPLAYNAME"),                                             
                                          }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
              return null;
            }
        }

        public TabUserDetails Tab_User_Validation(TabUserDetails TabLoginObj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            String Flag = "";
            List<DataParameter> param = new List<DataParameter>(); 
            param.Add(new DataParameter("@Tab_ID", TabLoginObj.TabId));
            param.Add(new DataParameter("@UserId", TabLoginObj.UserId));
            param.Add(new DataParameter("@Pin", TabLoginObj.PIN));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_USER_PIN_VALIDATION]", param);
               
                TabUserDetails lst = (from p in dt.AsEnumerable()
                                            select new TabUserDetails()
                                            {
                                                TabId = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<long>("TAB_ID") : 0,
                                                TabRefId = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("TAB_REF_ID") : "",
                                                UserId = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<long>("USER_ID") : 0,
                                                PIN = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("PIN") : "",
                                                UserName = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("USER_NAME") : "",
                                                FirstName = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("FIRSTNAME") : "",
                                                MiddleName = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("MIDDLENAME") : "",
                                                LastName = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("LASTNAME") : "",
                                                EmailId = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("EMAILID") : "",
                                                Password = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<string>("PASSWORD") : "",
                                                UserTypeId = dt.Rows[0]["flag"].ToString() == "1" ? p.Field<long>("USERTYPE_ID") : 0,
                                                Flag = p.Field<int>("flag")
                                            }).FirstOrDefault(); 
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public TabAdminDetails Tab_Logout_Validation(TabAdminDetails TabAdminObj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            String Flag = "";
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", TabAdminObj.InstitutionId));
            param.Add(new DataParameter("@USERID", TabAdminObj.UserId));
            param.Add(new DataParameter("@USERNAME", TabAdminObj.UserName));
            param.Add(new DataParameter("@PASSWORD", TabAdminObj.Password));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TAB_LOGOUT_VALIDATION]", param);

                TabAdminDetails lst = (from p in dt.AsEnumerable()
                                      select new TabAdminDetails()
                                      {
                                          InstitutionId = dt.Rows[0]["FLAG"].ToString() == "1" ? p.Field<long>("INSTITUTION_ID") : 0,
                                          UserId = dt.Rows[0]["FLAG"].ToString() == "1" ? p.Field<long>("USERID") : 0,
                                          UserName = dt.Rows[0]["FLAG"].ToString() == "1" ? p.Field<string>("USERNAME") : "",
                                          Password = dt.Rows[0]["FLAG"].ToString() == "1" ? p.Field<string>("PASSWORD") : "",
                                          Flag = p.Field<int>("FLAG")
                                      }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public TabUserDashBordDetails GetDashBoardListDetails(long InstitutionId, long UserId, long TabId, Guid Login_Session_Id, Int32 Language_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            string DeviceType = "TAB";

            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            param.Add(new DataParameter("@USERID", UserId));
            param.Add(new DataParameter("@TABID", TabId));
            param.Add(new DataParameter("@LANGUAGE_ID", Language_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[TABDASHBOARDUSERDETAILS]", param);

                TabUserDashBordDetails lst = (from p in dt.AsEnumerable()
                                              select new TabUserDashBordDetails()
                                              {
                                                  UserId = p.Field<long>("UserId"),
                                                  UnreadCount = p.Field<int>("UnreadCount"),
                                                  TabId = p.Field<long>("TabId"),
                                                  UserTypeId = p.Field<long>("UserTypeId"),
                                                  InstitutionId = p.Field<long>("InstitutionId"),
                                                  DeviceType = DeviceType,
                                                  Flag = p.Field<int>("Flag"),

                                                  UserDetails = new TabDeviceUserDetails()
                                                  {
                                                      UserName = p.Field<string>("UserName"),
                                                      PhotoLobThumb = p.IsNull("PhotoThump") ? null : decrypt.DecryptFile(p.Field<byte[]>("PhotoThump"))
                                                  },
                                              }).FirstOrDefault();
                if (lst != null)
                {
                    lst.TabParameterList = GroupParameterNameLists(lst.InstitutionId, UserId,Language_Id);
                    //lst.TabAlertsList = Get_ParameterValue(lst.UserId, lst.UserTypeId, Login_Session_Id);
                    lst.TabAppointmentList = PatientAppoinmentsList(UserId, Login_Session_Id, Language_Id);
                    lst.TabMedicationList = MedicationView(UserId, Login_Session_Id);
                }

                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabDashBoardAlertDetails> Get_ParameterValue(long PatientId, long UserTypeId, Guid Login_Session_Id, Int32 Language_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var sessionId = HttpContext.Current.Session.SessionID;
            //var result = Guid(sessionId);
         
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PatientId", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@ISTAB", 1));
            param.Add(new DataParameter("@LANGUAGE_ID", Language_Id));
            try
            {
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
                                                         PatientName = p.Field<string>("PatientName"),
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
                                                         FullName = p.Field<string>("FULLNAME"),
                                                         TypeName = p.Field<string>("TYPENAME"),
                                                         CreatedByShortName = p.Field<string>("CREATEDBY_SHORTNAME"),
                                                         ComDurationType = p.Field<string>("DurationType"),
                                                         TimeDifference = "(" + p.Field<string>("TIME_DIFFERENCE") + ")",
                                                         //DisplayParameterName = p.Field<string>("LANGUAGE_TEXT"),
                                                         DisplayParameterName = p.Field<string>("DISPLAYPARAMETERNAME"),
                                                         DisplayUnitName = p.Field<string>("DISPLAYUNITNAME"),
                                                     }).ToList();
                return list;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabDeviceParameterList> GroupParameterNameLists(long InstitutionId, long Patient_Id, Int32 Language_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            try
            {
                param.Add(new DataParameter("@INSTITUTION_ID", InstitutionId));
                param.Add(new DataParameter("@PATIENT_ID", Patient_Id));
                param.Add(new DataParameter("@LANGUAGE_ID", Language_Id));
                DataSet ds = ClsDataBase.GetDataSet("[MYCORTEX].[INSTITUTIONGROUPBASED_SP_PARAMETER_TABDASHBOARD_DATA]", param);
                TabDeviceParameterList paramlist = new TabDeviceParameterList();
                List<TabDeviceParameterList> lst = new List<TabDeviceParameterList>();
                if (ds.Tables.Count > 0)
                {
                    for (int i = 0; i < ds.Tables.Count; i++)
                    {
                        List<TabDeviceParameterValues> list = (from p in ds.Tables[i].AsEnumerable()
                                                               select new TabDeviceParameterValues()
                                                               {
                                                                   ActivityDate = p.Field<DateTime>("ACTIVITY_DATE"),
                                                                   CreatedDateTime = p.Field<DateTime>("CREATED_DT"),
                                                                   ParameterId = p.Field<long>("PARAMETER_ID"),
                                                                   ParameterGroupId = p.Field<long>("PARAMETER_GROUPID"),
                                                                   ParameterValue = p.Field<decimal>("PARAMETER_VALUE"),
                                                                   ParameterName = p.Field<string>("PARAMETER_NAME"),
                                                                   UomId = p.Field<long>("UNIT_ID"),
                                                                   UomName = p.Field<string>("UNIT_NAME"),
                                                                   HighCount = p.Field<int>("HighCount"),
                                                                   MediumCount = p.Field<int>("MediumCount"),
                                                                   LowCount = p.Field<int>("LowCount"),
                                                                   DisplayParameterName = p.Field<string>("DISPLAYPARAMETERNAME"),
                                                                   DisplayUomName = p.Field<string>("DISPLAYUNITNAME"),
                                                               }).ToList();
                        paramlist.ParameterList = list;
                    }
                }

                lst.Add(paramlist);
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabDashBoardAppointmentDetails> PatientAppoinmentsList(long PatientId, Guid Login_Session_Id, Int32 Language_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Patient_Id", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@ISTAB", 1));
            param.Add(new DataParameter("@Language_Id", Language_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTAPPOINTMENTS_SP_LIST]", param);
                List<TabDashBoardAppointmentDetails> lst = (from p in dt.AsEnumerable()
                                                      select new TabDashBoardAppointmentDetails()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                          Patient_Id = p.Field<long>("PATIENT_ID"),
                                                          Appointment_FromTime = p.Field<DateTime>("APPOINTMENT_FROMTIME"),
                                                          Appointment_ToTime = p.Field<DateTime>("APPOINTMENT_TOTIME"),
                                                          DoctorName = p.Field<string>("DOCTORNAME"),
                                                          PatientName = p.Field<string>("PATIENTNAME"),
                                                          Appointment_Date = p.Field<DateTime>("APPOINTMENT_DATE"),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                          Doctor_DepartmentName = p.Field<string>("DEPARTMENT_NAME"),
                                                          DisplayDoctor_DepartmentName = p.Field<string>("DISPLAYDEPARTMENTNAME"),
                                                          DoctorDepartmentId = p.Field<long>("DEPARTMENT_ID"),
                                                          ViewGenderName = p.Field<string>("GENDER_NAME"),
                                                          DisplayViewGenderName = p.Field<string>("DISPLAYGENDERNAME"),
                                                          TimeDifference = p.Field<string>("TimeDifference"),
                                                          Payment_Status = (p.IsNull("PAYMENT_STATUS") ? "" : p.Field<string>("PAYMENT_STATUS")),
                                                          ConferenceId = p.Field<string>("CONFERENCE_ID"),
                                                          Amount= p.Field<string>("AMOUNT"),
                                                      }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabDashBoardMedicationDetails> MedicationView(long Id, Guid Login_Session_Id)
        {
            //long ViewId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", Id));
            param.Add(new DataParameter("@ISACTIVE", 1));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@ISTAB", 1));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_MEDICATION_SP_LIST", param);
            IList <TabDashBoardMedicationDetails> View = (from p in dt.AsEnumerable()
                                      select
                                      new TabDashBoardMedicationDetails()
                                      {
                                          ID = p.Field<long>("ID"),
                                          FrequencyName = p.Field<string>("FREQUENCYNAME"),
                                          RouteName = p.Field<string>("ROUTENAME"),
                                          DrugCode = p.Field<string>("DRUGCODE"),
                                          StartDate = p.Field<DateTime>("STARTDATE"),
                                          EndDate = p.Field<DateTime>("ENDDATE"),
                                          GenericName = "(" + p.Field<string>("GENERIC_NAME") + ")",
                                          ItemCode = p.Field<string>("ITEMCODE"),
                                          StrengthName = p.Field<string>("STRENGTHNAME"),
                                          DosageFromName = p.Field<string>("DOSAGEFORMNAME"),
                                          NoOfDays = p.Field<decimal?>("NO_OF_DAYS"),
                                          TimeDifference = p.Field<string>("TIME_DIFFERNCE")
                                      }).ToList();
            return View;

        }

        public IList<TabDevicesModel> Get_DeviceList(int? IsActive, long Institution_ID, long HiveType)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            param.Add(new DataParameter("@HIVETYPE", HiveType));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
                                                 IsActive = p.Field<bool>("ISACTIVE")

                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<TabDevicesModel> Get_DeviceNameList(int? IsActive)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICENAME_SP_LIST]", param);
                List<TabDevicesModel> lst = (from p in dt.AsEnumerable()
                                             select new TabDevicesModel()
                                             {
                                                 ID = p.Field<long>("ID"),
                                                 DeviceId = p.Field<string>("DEVICEID"),
                                                 DeviceName = p.Field<string>("NAME"),
                                                 //Make = p.Field<string>("MAKE"),
                                                 //ModelNumber = p.Field<string>("MODEL"),
                                                 //DeviceType = p.Field<string>("DEVICE_TYPE"),
                                                 //IsActive = p.Field<bool>("ISACTIVE"),

                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<TabDevicesModel> DeviceNameInsert_InsertUpdate(TabDevicesModel insobj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long InsertId = 0;
            long Inserted_Group_Id;
            //String Flag = "";
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.ID));
            param.Add(new DataParameter("@NAME", insobj.DeviceName));
            param.Add(new DataParameter("@DEVICE_TYPE", insobj.DeviceType));
            param.Add(new DataParameter("@MAKE", insobj.Make));
            param.Add(new DataParameter("@MODEL", insobj.ModelNumber));
            param.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICENAME_SP_INSERTUPDATE]", param);
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

                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].[TBLDEVICEPARAMETER_SP_INSERTUPDATE]", param1, true);
                        }
                    }

                    IList<TabDevicesModel> INS = (from p in dt.AsEnumerable()
                                                  select
                                                  new TabDevicesModel()
                                                  {
                                                      ID = p.Field<long>("ID"),
                                                      DeviceName = p.Field<string>("NAME"),
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
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }
        public IList<TabDevicesModel> Get_DeviceNameAdminList(int? IsActive )
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ISACTIVE", IsActive));
           // param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            //param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICENAME_ADMIN_SP_LIST]", param);
                List<TabDevicesModel> lst = (from p in dt.AsEnumerable()
                                             select new TabDevicesModel()
                                             {
                                                 //TotalRecord = p.Field<string>("TotalRecords"),
                                                 ID = p.Field<long>("ID"),
                                                 DeviceName = p.Field<string>("NAME"),
                                                 Make = p.Field<string>("MAKE"),
                                                 ModelNumber = p.Field<string>("MODEL"),
                                                 DeviceType = p.Field<string>("DEVICE_TYPE"),
                                                 Is_Active = p.Field<int>("ISACTIVE")
                                             }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<DeviceParameterList> DEVICEADMINDETAILS_VIEW(long Id)
        {

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICE_ADMIN_SP_LIST_VIEW]", param);
            List<DeviceParameterList> INS = (from p in dt.AsEnumerable()
                                             select new DeviceParameterList()
                                             {
                                                 //ID = p.Field<long>('Id'),
                                                 ParameterName = p.Field<string>("PARAMETERNAME"),
                                             }).ToList();
            return INS;
        }
        public TabDevicesModel DeviceName_ListView(long id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICENAME_LIST_SP_VIEW]", param);

                TabDevicesModel list = (from p in dt.AsEnumerable()
                                        select new TabDevicesModel()
                                        {

                                            ID = p.Field<long>("ID"),
                                            DeviceName = p.Field<string>("NAME"),
                                            Make = p.Field<string>("MAKE"),
                                            ModelNumber = p.Field<string>("MODEL"),
                                            DeviceType = p.Field<string>("DEVICE_TYPE")
                                        }).FirstOrDefault();
                if (list != null)
                {
                    list.ParameterList = DEVICEADMINDETAILS_VIEW(list.ID);
                }
                return list;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<Institution_Device_list> InstitutionDevice(long Institution_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ISUBSCRIPTIONDEVICE_SP_LIST]", param);
                List<Institution_Device_list> lst = (from p in dt.AsEnumerable()
                                                 select new Institution_Device_list()
                                                 {
                                                     Id= p.Field<int>("DEVICE_ID"),
                                                     DeviceName = p.Field<string>("NAME"),
                                                     Make = p.Field<string>("MAKE"),
                                                     ModelNumber = p.Field<string>("MODEL"),
                                                     DeviceType = p.Field<string>("DEVICE_TYPE"),
                                                     IsActive = p.Field<int>("ISACTIVE")
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public TabDeviceIdModel Update_Device_SerialNo(TabDeviceIdModel insobj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@TAB_ID", insobj.TabId));
            param.Add(new DataParameter("@DeviceID", insobj.DeviceId));
            param.Add(new DataParameter("@DEVICE_SERIALNO", insobj.DeviceSerialNumber));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEVICEUPDATE]", param);

                TabDeviceIdModel INS = (from p in dt.AsEnumerable()
                                              select
                                              new TabDeviceIdModel()
                                              {
                                                  DeviceId = p.Field<long>("DeviceID"),
                                                  TabId = p.Field<long>("TAB_ID"),
                                                  DeviceSerialNumber = p.Field<string>("DEVICE_SERIALNO"),
                                              }).FirstOrDefault();
                return INS;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }

        public IList<TabDevicesModel> Device_InsertUpdate(TabDevicesModel insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
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
            param.Add(new DataParameter("@ISTAB", insobj.ISTAB));
            param.Add(new DataParameter("@HIVETYPE", insobj.HiveType));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }
        
        public IList<MonitoringProtocolModel> ParameterList(long UserId, Int32 Language_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@USER_ID", UserId));
                param.Add(new DataParameter("@Language_Id", Language_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].STANDARDPARAMETERNAME_BYSETTING_SP_LIST", param);
                List<MonitoringProtocolModel> lst = (from p in dt.AsEnumerable()
                                                     select new MonitoringProtocolModel()
                                                     {
                                                         Id = p.Field<long>("PARAMETER_ID"),
                                                         Name = p.Field<string>("NAME"),
                                                         DisplayName = p.Field<string>("DISPLAYNAME"),
                                                         Is_Selected = p.Field<int>("Is_Selected")
                                                     }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /*public IList<DashboardUserParameterSettingsModel> Dashboard_UserParameterSettings_InsertUpdate(DashboardUserParameterSettingsModel insobj)
        {
            long InsertId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.Id));
            param.Add(new DataParameter("@USER_ID", insobj.User_Id));
            param.Add(new DataParameter("@PARAMETER_ID",  insobj.Parameter_Id));
            param.Add(new DataParameter("@ISACTIVE", insobj.IsActive));
            param.Add(new DataParameter("@CREATED_BY", insobj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DASHBOARD_USERPARAMETERSETTINGS_SP_INSERTUPDATE]", param);
                IList<DashboardUserParameterSettingsModel> INS = (from p in dt.AsEnumerable()
                                                                      select
                                                                      new DashboardUserParameterSettingsModel()
                                                                      {
                                                                          Id = p.Field<long>("ID"),
                                                                          User_Id = p.Field<long>("USER_ID"),
                                                                          Parameter_Id = p.Field<string>("PARAMETER_ID"),
                                                                          IsActive = p.Field<int>("ISACTIVE"),
                                                                          Created_By = p.Field<long>("CREATED_BY")
                                                                      }).ToList();
                    return INS;
                
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }*/
            public IList<DashboardUserParameterSettingsModel> Dashboard_UserParameterSettings_InsertUpdate(DashboardUserParameterSettingsModel insobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USER_ID", insobj.User_Id));
            param.Add(new DataParameter("@PARAMETER_ID", insobj.Parameter_Id));
            param.Add(new DataParameter("@ISACTIVE", insobj.IsActive));
            param.Add(new DataParameter("@CREATED_BY", insobj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DASHBOARD_USERPARAMETERSETTINGS_SP_INSERTUPDATE]", param);
                IList<DashboardUserParameterSettingsModel> INS = (from p in dt.AsEnumerable()
                                                                  select
                                                                  new DashboardUserParameterSettingsModel()
                                                                  {
                                                                      Id = p.Field<long>("ID"),
                                                                      User_Id = p.Field<long>("USER_ID"),
                                                                      Parameter_Id = p.Field<string>("PARAMETER_ID"),
                                                                  }).ToList();
                return INS;

            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }

        public TabDevicesModel Device_ListView(long id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
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
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].[DEVICE_SP_LIST_DELETE]", param);
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }
        public void Device_Name_List_Delete(int Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                ClsDataBase.Update("[MYCORTEX].[DEVICENAME_SP_LIST_DELETE]", param);
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
        }
        public DashboardUserParameterSettingsReturnModel Dashboard_UserParameterSettings_Active(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DASHBOARD_USERPARAMETERSETTINGS_SP_ACTIVE]", param);
            DashboardUserParameterSettingsReturnModel Active = (from p in dt.AsEnumerable()
                                      select new DashboardUserParameterSettingsReturnModel()
                                      {
                                          ReturnFlag = p.Field<int>("flag"),
                                      }).FirstOrDefault();
            return Active;
        }
        public DashboardUserParameterSettingsReturnModel Dashboard_UserParameterSettings_InActive(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DASHBOARD_USERPARAMETERSETTINGS_SP_INACTIVE", param);
            DashboardUserParameterSettingsReturnModel Active = (from p in dt.AsEnumerable()
                                      select new DashboardUserParameterSettingsReturnModel()
                                      {
                                          ReturnFlag = p.Field<int>("flag"),
                                      }).FirstOrDefault();
            return Active;            
        }
    }
}