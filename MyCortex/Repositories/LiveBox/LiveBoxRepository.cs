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

        public int LiveBox_Get_Institute(string UserId)
        {
            int retInsid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@UserId", UserId));
            DataTable dttbl = ClsDataBase.GetDataTable("[MYCORTEX].[LiveBox_Get_InstituteId]", param);
            if (dttbl.Rows.Count > 0)
            {
                foreach (DataRow dr in dttbl.Rows)
                {                    
                    retInsid = int.Parse(dr["INSTITUTION_ID"].ToString());
                }
            }
            return retInsid;
        }
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
        //public int LiveBox_Notify_UPDATE(string conferencename,long Institution_Id, string userID,string messageBody,string WebmessageBody,string SMSmessageBody)
        public int LiveBox_Notify_UPDATE(string conferencename,long Institution_Id, string userID,string messageBody,string WebmessageBody)
        {
            int retid = 0;
            long User_Id;
            string MobileNo="";
            long appointmentId;

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
                    appointmentId= long.Parse(dr["APPOINTMENT_ID"].ToString());
                    if (appointmentId == 0)
                    {
                        User_Id = long.Parse(dr["PATIENT_ID"].ToString());
                    }
                    else
                    {
                        User_Id = long.Parse(dr["DOCTOR_ID"].ToString());
                    }
                    
                    MobileNo = dr["MOBILE_NO"].ToString();
                    //  Patient_Id = dr["Patient_Id"].ToString();
                    PushNotificationMessage Emailmessage = new PushNotificationMessage();
                    Emailmessage.Title = "HiveMeet Notification";
                    Emailmessage.Message = messageBody; // "Waiting for meet";
                    Emailmessage.conferencename = conferencename;

                    PushNotificationMessage Webmessage = new PushNotificationMessage();
                    Webmessage.Title = "HiveMeet Notification";
                    Webmessage.Message = WebmessageBody; // "Waiting for meet";
                    Webmessage.conferencename = conferencename;

                    //PushNotificationMessage SMSMessage = new PushNotificationMessage();
                    //SMSMessage.Title = "HiveMeet Notification";
                    //SMSMessage.Message = SMSmessageBody; // "Waiting for meet";
                    //SMSMessage.conferencename = conferencename;

                    ////PushNotificationInputModel Inputval=new PushNotificationInputModel();
                    ////Inputval.Institution_Id = Institution_Id;
                    ////Inputval.User_Id = User_Id;
                    ////Inputval.MobileNo = MobileNo;

                    //PushNotificationApiManager.SendLiveboxNotification(message, User_Id, Institution_Id);
                    //var y = PushNotificationApiManager.SendLiveboxNotificationAsync(Emailmessage, User_Id, Institution_Id, Webmessage, MobileNo,SMSMessage);
                    var y = PushNotificationApiManager.SendLiveboxNotificationAsync(Emailmessage, User_Id, Institution_Id, Webmessage);
                }
            }

            return retid;
        }
        public int LiveBox_Recording_url(string conferencename, string recording_url, string FileType) 
            {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@conferencename", conferencename));
            param.Add(new DataParameter("@recording_url", recording_url));
            param.Add(new DataParameter("@FILETYPE", FileType));
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