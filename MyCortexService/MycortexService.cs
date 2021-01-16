using MyCortex.Notification;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Repositories.Template;
using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace MyCortexService
{
    public partial class MycortexService : ServiceBase
    {
        Timer timer = new Timer();
        private string executedTime="";
        private string lastexecutedTime="";
        private string executedTimeNow = "";

        static readonly SendEmailRepository emailrepository = new SendEmailRepository();
        static readonly AlertEventRepository alertrepository = new AlertEventRepository();
        

        public MycortexService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //Debugger.Launch(); // Launches VS2012 debugger.
            timer.Elapsed += new ElapsedEventHandler(OnElapsedTime);
            timer.Interval = 60000; //number in milisecinds     // 60000 = one minute
            timer.Enabled = true;
        }
        private void OnElapsedTime(object source, ElapsedEventArgs e)
        {
            WriteToFile("Service started at " + DateTime.Now);

            try
            {
                string Event_Code = "";

                AlertEvents AlertEventReturn = new AlertEvents();
                IList<EmailListModel> EmailList;

                // to execute the service daily once at the day start(at 12AM)
                var dateAndTime = DateTime.Now;
                executedTime = dateAndTime.ToString("dd/MM/yyyy");

                if (executedTime == "" || executedTime != lastexecutedTime)
                {
                    // archiving mail and notification > 365 days
                    emailrepository.SendArchivedetails();
                    lastexecutedTime = executedTime;

                    IList<PasswordExpiry_AlertEventModel> PwdEmailList;

                    // pwd expiry notification to user ex. before 90 days, 60 days,...
                    Event_Code = "PASSWORD_EXPIRY";
                    PwdEmailList = alertrepository.AlertEvent_Get_PasswordExpiry_List();

                    foreach (PasswordExpiry_AlertEventModel modobj in PwdEmailList)
                    {
                        EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.UserId);
                        // send email & notification
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.UserId, (long)modobj.Institution_Id, EmailList);
                    }

                    IList<TargetAchived_AlertEventModel> targetweekly;
                    // target achived weekly alerts
                    // execute once a day
                    Event_Code = "TARGET_WEEKLY";
                    targetweekly = alertrepository.AlertEvent_TargetAchievedWeekly_List();

                    foreach (TargetAchived_AlertEventModel modobj in targetweekly)
                    {
                        EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.UserId);
                        // send email & notification
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.UserId, (long)modobj.Institution_Id, EmailList);
                    }

                    IList<LicenceExpiry_AlertEventModel> LincenseExpiry;
                    // license expiry reminder
                    Event_Code = "LICENCE_EXPIRY";
                    LincenseExpiry = alertrepository.AlertEvent_Get_LicenceExpiry_List();

                    foreach (LicenceExpiry_AlertEventModel modobj in LincenseExpiry)
                    {
                        EmailList = alertrepository.InstitutionCreateEvent((long)modobj.Institution_Id, modobj.HosAdmin_Id);
                        // send email & notification
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.HosAdmin_Id, (long)modobj.Institution_Id, EmailList);
                    }

                    IList<PatientHealthDataModel> complist;
                    // target achived weekly alerts
                    // execute once a day
                    Event_Code = "";
                    complist = alertrepository.PatientHealthData_Compliance_List();

                    foreach (PatientHealthDataModel modobj in complist)
                    {
                        if (modobj.HighCount > 0)
                            Event_Code = "COMP_HIGH";
                        else if (modobj.MediumCount > 0)
                            Event_Code = "COMP_MEDIUM";
                        else if (modobj.LowCount > 0)
                            Event_Code = "COMP_LOW";
                        if(Event_Code!="")
                        { 
                            EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.Patient_Id);
                            // send email & notification
                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.Patient_Id, (long)modobj.Institution_Id, EmailList);
                        }
                    }
                }

                // generate the appointment schedule
                alertrepository.Get_AlertSchedule();

                // get open appointment schedule
                IList<Appointment_AlertEventModel> apptmodel = new List<Appointment_AlertEventModel>();
                apptmodel = alertrepository.Get_AlertSchedule_List();

                var timeNow = DateTime.Now;
                // loop thru schedule list
                foreach (Appointment_AlertEventModel modobj in apptmodel)
                {
                    timeNow = DateTime.Now;
                    executedTimeNow = timeNow.ToString("dd/MM/yyyy HH:mm");
                    WriteToFile("appt " + executedTimeNow);
                    WriteToFile("modobj.Remainder_SentTime " + modobj.Remainder_SentTime.ToString("dd/MM/yyyy HH:mm"));
                    if (executedTimeNow==modobj.Remainder_SentTime.ToString("dd/MM/yyyy HH:mm"))
                    { 
                        // get email list
                        if (modobj.Event_Code == "PAT_APPOINTMENT_REMINDER")
                        {
                            Event_Code = modobj.Event_Code; 
                            EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.Patient_Id);
                        }
                        else
                        {
                            Event_Code = modobj.Event_Code;
                            EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.Doctor_Id);
                        }

                       WriteToFile("PAT_APPOINTMENT_REMINDER");
                        // send email & notification
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.Appointment_Id, (long)modobj.Institution_Id, EmailList);
                        WriteToFile("PAT_APPOINTMENT_REMINDER check mail status");
                        // update appointment schedule
                        alertrepository.Appointment_Schedule_UpdateList(modobj.Id);
                    }
                }

            }
            catch (Exception ex)
            {
                WriteToFile(new String('-', 50));
                WriteToFile(ex.StackTrace);
                WriteToFile(new String('-', 50));
            }
        }
        protected override void OnStop()
        {
            WriteToFile("Service is stopped at " + DateTime.Now);
        }
        public void WriteToFile(string Message)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "\\Logs";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string filepath = AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ServiceLog_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
            if (!File.Exists(filepath))
            {
                // Create a file to write to.   
                using (StreamWriter sw = File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
            else
            {
                using (StreamWriter sw = File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
        }
    }
}
