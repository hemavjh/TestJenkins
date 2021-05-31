using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class TabListModel
    {
        public string TotalRecord { get; set; }
        public long ID { get; set; }
        public string TabName { get; set; }
        public string RefId { get; set; }
        public string Model { get; set; }
        public string OS { get; set; }
        public int UsersCount { get; set; }
        public int DevicesCount { get; set; }
        public bool IsActive { get; set; }
        public long InstitutionId { get; set; }
        public long CreatedBy { get; set; }
        public string Vendor { get; set; }
        public int Flag { get; set; }
        public string DeviceName { get; set; }
        public string UserName { get; set; }
        public string PIN { get; set; }
        public IList<TabUserList> UserList { get; set; }
        public IList<UserTabUserList> SelectedTabUserList { get; set; }
        public IList<TabDevicesList> DevicesList { get; set; }
        public IList<UserTabDevicesList> SelectedTabDeviceList { get; set; }
    }

    public class TabDevicesModel
    {
        public long ID { get; set; }
        public long TabId { get; set; }
        public long DeviceId { get; set; }
        public string DeviceName { get; set; } 
        public string Make { get; set; }
        public string DeviceType { get; set; }
        public string Series { get; set; }
        public string ModelNumber { get; set; }
        public string Purpose { get; set; }
        public string Parameter { get; set; }
        public bool IsActive { get; set; }
    }

    public class TabUserModel
    {
        public long ID { get; set; }
        public long UserId { get; set; }
        public string PIN { get; set; }
        public string Photo { get; set; }
        public string FingerPrint { get; set; }
        public bool IsActive { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public long UserTypeId { get; set; }
        public long GenderId { get; set; }
        public string GenderName { get; set; }

    }

    public class TabUserReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabListModel> TabUserDetails { get; set; }
        public IList<TabUserDetails> GetTabUserDetails { get; set; }

    }

    public class TabDeviceListReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabDevicesModel> TabDeviceList { get; set; }

    }

    public class TabUserListReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabUserModel> TabUserList { get; set; }

    }

    public class TabDevicesList
    {
        public long ID { get; set; }
        public string DeviceName { get; set; }
        public bool IsActive { get; set; }

    }

    public class TabUserList
    {
        public long ID { get; set; }
        public string FullName { get; set; }
        public string PIN { get; set; }
        public bool IsActive { get; set; }

    }

    public class UserTabUserList
    {
        public long? Id { get; set; }
        public long? UserId { get; set; }
        public long? UserListId { get; set; }
        public string UserFullName { get; set; }
        public bool IsActive { get; set; }
        public string PIN { get; set; }
        public long? TabId { get; set; }
    }
    public class UserTabDevicesList
    {
        public long? Id { get; set; }
        public long? UserId { get; set; }
        public long? DeviceId { get; set; }
        public string DeviceName { get; set; }
        public bool IsActive { get; set; }
        public long? TabId { get; set; }
    }

    public class TabUserDetails
    {
        public long TabId { get; set; }
        public string UserName { get; set; }
        public long  UserId { get; set; }
        public string PIN { get; set; }
        public int Flag { get; set; }
        public bool IsActive { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public long UserTypeId { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}