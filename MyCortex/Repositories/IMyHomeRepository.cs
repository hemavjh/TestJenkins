using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories
{
    interface IMyHomeRepository
    {
        IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id,long StartRowNumber, long EndRowNumber);
        TabListModel Tab_ListView(int id);
        void Tab_List_Delete(int Id);
        IList<TabListModel> Tab_InsertUpdate(TabListModel obj);
        IList<TabDevicesModel> Get_TabDevices(long Institution_ID, long Tab_ID);
        IList<TabUserModel> Get_TabUsers(long Institution_ID, long Tab_ID);
        IList<TabUserDetails> Get_TabLoginUserDetails(long Tab_ID, long UserId, string Pin);
        TabUserDashBordDetails GetDashBoardListDetails(long InstitutionId, long UserId, long TabId,Guid Login_Session_Id);
    }
}