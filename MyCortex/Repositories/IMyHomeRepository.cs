using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IMyHomeRepository
    {
        IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id,long StartRowNumber, long EndRowNumber);
        TabListModel Tab_ListView(int id);
        void Tab_List_Delete(int Id);
        IList<TabListModel> Tab_InsertUpdate(TabListModel obj);
        IList<TabUserPinModel> Tab_User_Pin_Update(TabUserPinModel obj);
        TabIdReturnModels Get_Tab_ID(long InstitutionId, string Ref_ID);
        IList<TabDevicesModel> Get_TabDevices(long Institution_ID, long Tab_ID);
        IList<TabUserModel> Get_TabUsers(long Institution_ID, long Tab_ID);
        IList<ParameterModels> Parameter_Lists(long ParamGroup_ID, long TabId);
        TabUserDetails Tab_User_Validation(TabUserDetails TabLoginObj);
        TabAdminDetails Tab_Logout_Validation(TabAdminDetails TabLoginObj);
        TabUserDashBordDetails GetDashBoardListDetails(long InstitutionId, long UserId, long TabId, Guid Login_Session_Id, long PatientId);
        IList<TabDevicesModel> Get_DeviceList(int? IsActive, long Institution_ID); 
        IList<TabDevicesModel> Get_DeviceNameList(int? IsActive);
        IList<TabDevicesModel> Device_InsertUpdate(TabDevicesModel obj);
        IList<DashboardUserParameterSettingsModel> Dashboard_UserParameterSettings_InsertUpdate(DashboardUserParameterSettingsModel obj);
        DashboardUserParameterSettingsReturnModel Dashboard_UserParameterSettings_InActive(long Id);
        DashboardUserParameterSettingsReturnModel Dashboard_UserParameterSettings_Active(long Id);
        TabDevicesModel Device_ListView(long id);
        /*TabDevicesModel Get_Device_Id(long DeviceId);*/
        void Device_List_Delete(int Id);
        IList<TabDashBoardAlertDetails> Get_ParameterValue(long patientId, long userTypeId, Guid login_Session_Id);
        IList<MonitoringProtocolModel> ParameterList(long UserId);
    }
}