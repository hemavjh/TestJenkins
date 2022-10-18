﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using MyCortexDB;
using MyCortex.Utilities;
using MyCortex.User.Models;

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
        public int LiveBox_Notify_UPDATE(string conferencename)
        {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@conferencename", conferencename));
            retid = ClsDataBase.Insert("[MYCORTEX].[LIVEBOX_NOTIFY_LOG_GET_SP]", param, true);
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

        public IList<LiveboxModel> Get_AppointmentDuration(string Conference_ID)
        {

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Conference_ID", Conference_ID));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_APPOINTMENT_DURATION]", param);
            IList<LiveboxModel> list = (from p in dt.AsEnumerable()
                                 select new LiveboxModel()
                                 {
                                     Duration = p.Field<Int32>("DURATION"),
                                     ConferenceId = p.Field<Guid>("CONFERENCE_ID")

                                 }).ToList();
            return list;
        }
    }
}