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
                        foreach (TabUserlist item in insobj.UserList)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@User_Id", item.ID));
                            param1.Add(new DataParameter("@TAB_ID", InsertId));
                            param1.Add(new DataParameter("@PIN", item.PIN));
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
                            param1.Add(new DataParameter("@ISACTIVE", item.IsActive));
                            var objExist = insobj.SelectedTabuserlist.Where(ChildItem => ChildItem.Id == item.ID);

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
                        foreach (TabDeviceslist item in insobj.DevicesList)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@DeviceID", item.ID));
                            param1.Add(new DataParameter("@TAB_ID", InsertId)); 
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CreatedBy));
                            param1.Add(new DataParameter("@ISACTIVE", item.IsActive));
                            var objExist = insobj.SelectedTabdevicelist.Where(ChildItem => ChildItem.DeviceId == item.ID);

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
                    list.SelectedTabdevicelist = USERDEVICEDETAILS_VIEW(list.ID);
                    list.SelectedTabuserlist = USERTABDETAILS_VIEW(list.ID);
                }
               return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<UserTabDeviceslist> USERDEVICEDETAILS_VIEW(long Id)
        {
          
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERDEVICEDETAILS_SP_VIEW]", param);
            List<UserTabDeviceslist> INS = (from p in dt.AsEnumerable()
                                            select new UserTabDeviceslist()
                                            {
                                                Id = p.Field<long>("Id"),
                                                TabId = p.Field<long>("TAB_ID"),
                                                DeviceId = p.Field<long>("DEVICE_ID"),
                                                DeviceName = p.Field<string>("DEVICENAME"),
                                                IsActive = p.Field<bool>("ISACTIVE")
                                            }).ToList();
            return INS;
        }

        public IList<UserTabUserlist> USERTABDETAILS_VIEW(long Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTABDETAILS_SP_VIEW]", param);
            List<UserTabUserlist> INS = (from p in dt.AsEnumerable()
                                            select new UserTabUserlist()
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
                                                 DeviceId = p.Field<long>("ID"),
                                                 DeviceName = p.Field<string>("DEVICE_NAME"), 
                                                 MAKE = p.Field<string>("MAKE"),
                                                 DeviceType = p.Field<string>("BRAND_NAME"),
                                                 SERIES = p.Field<string>("SERIES"),
                                                 ModelNumber = p.Field<string>("MODEL_NUMBER"),
                                                 PURPOSE = p.Field<string>("PURPOSE"),
                                                 PARAMETER = p.Field<string>("PARAMETER"),
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

        public IList<TabUserDetails> Get_TabLoginUserDetails(long Tab_ID, long UserId, string Pin)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>(); 
            param.Add(new DataParameter("@Tab_ID", Tab_ID));
            param.Add(new DataParameter("@UserId", UserId));
            param.Add(new DataParameter("@Pin", Pin));
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
    }

}