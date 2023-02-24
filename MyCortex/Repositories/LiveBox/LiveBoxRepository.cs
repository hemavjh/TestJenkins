using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using MyCortexDB;
using MyCortex.Utilities;
using MyCortex.User.Models;
using System.Runtime.Remoting.Contexts;
using MyCortex.Notification.Firebase;
using static MyCortex.Notification.Firebase.PushNotificationApiManager;

namespace MyCortex.Repositories.LiveBox
{
    public class LiveBoxRepository : ILiveBoxRepository
    {
        ClsDataBase db;

        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public int LiveBox_Notify_Log(string LogText)
        {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@LOG_TEXT", LogText));
            retid = ClsDataBase.Insert("[MYCORTEX].[LIVEBOX_NOTIFY_LOG]", param, true);
            return retid;
        }
        public int LiveBox_RemainingTime(string ConferenceId,string RemainingTime)
        {
            int retFlag = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Conference_Id", ConferenceId));
            param.Add(new DataParameter("@Remaining_Time", RemainingTime));
            retFlag = ClsDataBase.Insert("[MYCORTEX].[LIVEBOX_REMAININGTIME_LOG]", param, true);
            return retFlag;
        }
        public int LiveBox_Notify_UPDATE(string conferencename,long Institution_Id, string userID,string messageBody)
        {
            int retid = 0;
            long User_Id;

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@conferencename", conferencename));
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            param.Add(new DataParameter("@UserId", userID));
            retid = ClsDataBase.Insert("[MYCORTEX].[LIVEBOX_NOTIFY_LOG_GET_SP]", param, true);

            List<DataParameter> param1 = new List<DataParameter>();
            param1.Add(new DataParameter("@conferencename", conferencename));

            DataTable dttbl = ClsDataBase.GetDataTable("[MYCORTEX].[LIVEBOX_USERDETAILS]", param1);
            if (dttbl.Rows.Count > 0)
            {                
                foreach (DataRow dr in dttbl.Rows)
                {                    
                    //Id = long.Parse(dr["Id"].ToString());
                    Institution_Id = long.Parse(dr["INSTITUTION_ID"].ToString());
                    User_Id = long.Parse(dr["Doctor_Id"].ToString());
                    //  Patient_Id = dr["Patient_Id"].ToString();
                    PushNotificationMessage message = new PushNotificationMessage();
                    message.Title = "HiveMeet Notification";
                    message.Message = messageBody; // "Waiting for meet";
                    //PushNotificationApiManager.SendLiveboxNotification(message, User_Id, Institution_Id);
                    var y = PushNotificationApiManager.SendLiveboxNotificationAsync(message, User_Id, Institution_Id);
                }
            }

            return retid;
        }
        public int LiveBox_Recording_url(string conferencename, string recording_url) 
            {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@conferencename", conferencename));
            param.Add(new DataParameter("@recording_url", recording_url));
            retid = ClsDataBase.Insert("[MYCORTEX].[GET_RECORDING_URL]", param, true);
            return retid;
        }
      

        //public IList<LiveboxModel> Get_AppointmentDuration(string Conference_ID)
        //{    

        //    List<DataParameter> param = new List<DataParameter>();
        //    param.Add(new DataParameter("@Conference_ID", Conference_ID));
        //    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_APPOINTMENT_DURATION]", param);
        //    IList<LiveboxModel> list = (from p in dt.AsEnumerable()
        //                         select new LiveboxModel()
        //                         {
        //                             Duration = p.Field<string>("DURATION"),
        //                             ConferenceId = p.Field<string>("CONFERENCE_ID")
        //                         }).ToList();
        //    return list;
        //}
        public IList<LiveboxModel> Get_AppointmentDuration(string Conference_ID)
        {

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Conference_ID", Conference_ID));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_APPOINTMENT_DURATION]", param);
            //IList<LiveboxModel> list = (from p in dt.AsEnumerable()
            //                            select new LiveboxModel()
            //                            {
            //                                Duration = p.Field<string>("DURATION"),
            //                                ConferenceId = p.Field<Guid>("CONFERENCE_ID")
            //                            }).ToList();

            List<LiveboxModel> list = new List<LiveboxModel>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                LiveboxModel li = new LiveboxModel();
                li.Duration = dt.Rows[i][0].ToString();
                li.ConferenceId = dt.Rows[i][1].ToString();
                //li.Doctor_Id = dt.Rows[i][2].ToString();
                //li.Patient_Id = dt.Rows[i][3].ToString();
                list.Add(li);
            }
            return list;
        }
    }
}