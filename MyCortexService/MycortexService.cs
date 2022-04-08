using MyCortex.Notification;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Repositories.Template;
using MyCortex.Repositories.Uesr;
using MyCortex.User.Model;
using MyCortexDB;
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
        static readonly UserRepository userrepository = new UserRepository();

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

        public void onDebug()
        {
            OnStart(null);
        }

        private void OnElapsedTime(object source, ElapsedEventArgs e)
        {
            WriteToFile("Service started at " + DateTime.Now);

            try
            {
                string Event_Code = "";

                AlertEvents AlertEventReturn = new AlertEvents();
                IList<EmailListModel> EmailList;
                Int64 Id = 0, Institution_Id, Patient_Id, Doctor_Id, APPOINTMENT_ID;

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
                        if (Event_Code != "")
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
                    if (executedTimeNow == modobj.Remainder_SentTime.ToString("dd/MM/yyyy HH:mm"))
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

                // TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION
                // Start
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@type", "Get_Mail"));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION", param);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                        Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());
                        PatientHealthDataModel phm = new PatientHealthDataModel();
                        phm = userrepository.PatientHealthData_AlertNotification_List(Id);
                        if (phm != null)
                        {
                            if (phm.HighCount > 0)
                                Event_Code = "DIAG_HIGH";
                            else if (phm.MediumCount > 0)
                                Event_Code = "DIAG_MEDIUM";
                            else if (phm.LowCount > 0)
                                Event_Code = "DIAG_LOW";

                            if (phm.HighCount > 0 || phm.MediumCount > 0 || phm.LowCount > 0)
                            {
                                EmailList = AlertEventReturn.Diagnostic_Compliance_AlertEvent((long)Patient_Id, (long)Institution_Id);

                                AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Id, (long)Institution_Id, EmailList);
                            }
                        }

                        {
                            Event_Code = "NEWDATA_CAPTURE";

                            EmailList = AlertEventReturn.NewDataCapturedEvent((long)Patient_Id, (long)Institution_Id);

                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Patient_Id, (long)Institution_Id, EmailList);

                            Event_Code = "TARGET_DAILY";
                            TargetAchived_AlertEventModel tarobj = new TargetAchived_AlertEventModel();
                            tarobj = AlertEventReturn.AlertEvent_TargetAchievedDaily_List((long)Institution_Id, (long)Patient_Id);

                            if (tarobj != null)
                                AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Patient_Id, (long)Institution_Id, EmailList);
                        }

                        List<DataParameter> param1 = new List<DataParameter>();
                        param1.Add(new DataParameter("@type", "Update_Mail_Notification"));
                        param1.Add(new DataParameter("@id", Id));
                        dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION", param1);
                    }
                    catch(Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION", param1);
                        }
                    }
                }
                // End

                // TBLPATIENT_APPOINTMENTS Creation
                // Start

                List<DataParameter> appoint_param = new List<DataParameter>();
                appoint_param.Add(new DataParameter("@type", "Get_Mail"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", appoint_param);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                        Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());
                        List<DataParameter> param_appointment = new List<DataParameter>();

                        param_appointment.Add(new DataParameter("@InstitutionId", Institution_Id));
                        dt = ClsDataBase.GetDataTable("MYCORTEX.ORGAPPOINTMENTLIST_VIEW", param_appointment);
                        if (Convert.ToBoolean(dt.Rows[0]["IS_DIRECTAPPOINTMENT"]) == true)
                        {
                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);
                            AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_CREATION", Id, (long)Institution_Id, EmailList);
                        }
                        else
                        {
                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);
                            AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_CREATION", Id, (long)Institution_Id, EmailList);
                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, "CC_CG");
                            AlertEventReturn.Generate_SMTPEmail_Notification("APPOINTMENT_APPROVAL", Id, (long)Institution_Id, EmailList);
                            // AlertEventReturn.Generate_SMTPEmail_Notification("APPOINTMENT_APPROVED", Id, (long)Institution_Id, EmailList);
                        }




                        List<DataParameter> param1 = new List<DataParameter>();
                        param1.Add(new DataParameter("@type", "Update_Mail_Notification"));
                        param1.Add(new DataParameter("@id", Id));
                        dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);

                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);
                        }
                    }
                }

                List<DataParameter> appoint_aaproval_param = new List<DataParameter>();
                appoint_aaproval_param.Add(new DataParameter("@type", "Get_Mail_Approval"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", appoint_aaproval_param);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                        Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());
                        List<DataParameter> param_appointment = new List<DataParameter>();
                        EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, "CC_CG");

                        AlertEventReturn.Generate_SMTPEmail_Notification("APPOINTMENT_APPROVED", Id, (long)Institution_Id, EmailList);
                        List<DataParameter> param1 = new List<DataParameter>();
                        param1.Add(new DataParameter("@type", "Update_Mail_Notification_Approval"));
                        param1.Add(new DataParameter("@id", Id));
                        dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);

                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Failed_Mail_Notification_approval"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);
                        }
                    }
                }
                // End

                // TBLPATIENT_APPOINTMENTS Cancel
                // Start

                List<DataParameter> appoint_can_param = new List<DataParameter>();
                appoint_can_param.Add(new DataParameter("@type", "Get_Mail"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", appoint_can_param);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                        Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());

                        EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);

                        AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_CANCEL", Id, (long)Institution_Id, EmailList);

                        List<DataParameter> param1 = new List<DataParameter>();
                        param1.Add(new DataParameter("@type", "Update_Mail_Notification"));
                        param1.Add(new DataParameter("@id", Id));
                        dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", param1);

                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                }

                // End

                // APPointments RESET by System
                // Start

                List<DataParameter> li = new List<DataParameter>();
                li.Add(new DataParameter("@INST", 1));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].RESET_APPOINTMENTS_BY_SYSTEM", li);

                // END

                // Deactivate Past Doctor Shift Details
                // Start

                dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEACTIVATE_PAST_DOCTORSHIFT]");

                // END

                // TBLAPPOINTMENT_PAYMENT_STATUS FOR SUCCESS
                // Start

                List<DataParameter> paym_succ = new List<DataParameter>();
                paym_succ.Add(new DataParameter("@type", "Get_Payment_Success_Mail"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", paym_succ);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                        Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());

                        EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);

                        AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINT_PAYMENT_SUCCESS", Id, (long)Institution_Id, EmailList);

                        List<DataParameter> param1 = new List<DataParameter>();
                        param1.Add(new DataParameter("@type", "Update_Payment_Success_Notification"));
                        param1.Add(new DataParameter("@id", Id));
                        dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);

                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Failed_Payment_Success_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                }

                // End

                // TBLAPPOINTMENT_PAYMENT_STATUS FOR FAILURE
                // Start

                List<DataParameter> paym_fail = new List<DataParameter>();
                paym_fail.Add(new DataParameter("@type", "Get_Payment_Failure_Mail"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", paym_fail);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                        Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());

                        EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);

                        AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINT_PAYMENT_FAILURE", Id, (long)Institution_Id, EmailList);

                        List<DataParameter> param1 = new List<DataParameter>();
                        param1.Add(new DataParameter("@type", "Update_Payment_Failure_Notification"));
                        param1.Add(new DataParameter("@id", Id));
                        dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);

                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Failed_Payment_Failure_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                }

                // End

                // Appointment Reminder Notification for Patient
                // Start

                List<DataParameter> appoint_rem = new List<DataParameter>();
                appoint_rem.Add(new DataParameter("@TYPE", "Get_Mail"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", appoint_rem);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            Id = Convert.ToInt64(dt.Rows[i]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[i]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[i]["PATIENT_ID"].ToString());
                            APPOINTMENT_ID = Convert.ToInt64(dt.Rows[i]["APPOINTMENT_ID"].ToString());

                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)APPOINTMENT_ID, (long)Institution_Id, null);

                            AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_REMINDER", APPOINTMENT_ID, (long)Institution_Id, EmailList);

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@TYPE", "Update_Mail_Notification"));
                            param1.Add(new DataParameter("@ID", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@TYPE", "Failed_Mail_Notification"));
                            param1.Add(new DataParameter("@ID", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                }

                // End


                // Appointment Reminder Notification for Doctor
                // Start

                List<DataParameter> appoint_doc = new List<DataParameter>();
                appoint_doc.Add(new DataParameter("@TYPE", "Get_Mail"));
                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", appoint_doc);
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            Id = Convert.ToInt64(dt.Rows[i]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[i]["INSTITUTION_ID"].ToString());
                            Doctor_Id = Convert.ToInt64(dt.Rows[i]["DOCTOR_ID"].ToString());
                            APPOINTMENT_ID = Convert.ToInt64(dt.Rows[i]["APPOINTMENT_ID"].ToString());

                            EmailList = alertrepository.UserSpecificEmailList((long)Institution_Id, Doctor_Id);

                            AlertEventReturn.Generate_SMTPEmail_Notification("DOCTOR_APPOINTMENT_REMINDER", APPOINTMENT_ID, (long)Institution_Id, EmailList);

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@TYPE", "Update_Mail_Notification"));
                            param1.Add(new DataParameter("@ID", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                    catch (Exception ex)
                    {
                        if (Id != 0)
                        {
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@TYPE", "Failed_Mail_Notification"));
                            param1.Add(new DataParameter("@ID", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                        }
                    }
                }

                // End
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
