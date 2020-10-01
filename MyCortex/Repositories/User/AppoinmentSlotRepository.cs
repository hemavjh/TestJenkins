using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
using log4net;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.User.Models;

namespace MyCortex.Repositories.User
{
    public class AppoinmentSlotRepository : IAppoinmentSlotRepository
    {
         ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public AppoinmentSlotRepository()
        {
            db = new ClsDataBase();

        }
        /// <summary>
        /// Settings -->AppoinmentSlot Details --> Add/Edit Page
        /// to Insert/Update the entered AppoinmentSlot Information into database.
        /// When Id = 0 it is Insert, Id >0 it is Update
        /// </summary>
        /// <param name="obj">Fields of AppoinmentSlot Page</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        public long AppoinmentSlot_AddEdit(List<AppoinmentSlotModel> obj)
        {
            try
            {
                string flag = "";
                foreach (AppoinmentSlotModel item in obj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@INSTITUTION_ID", item.Institution_Id));
                    param.Add(new DataParameter("@DOCTOR_ID", item.Doctor_Id));
                  //  param.Add(new DataParameter("@APPOINMENTHOURS", item.Appoinment_Hours));
                    param.Add(new DataParameter("@APPOINMENTMINUTES", item.Appoinment_Minutes));
                    param.Add(new DataParameter("@FOLLOWUPAPPOINMENT", item.FollowUp_Appoinment));
                    param.Add(new DataParameter("@SLOTINTERVAL", item.SlotInterval));
                    param.Add(new DataParameter("@CREATED_BY", item.Created_By));
                    param.Add(new DataParameter("@MODIFIED_BY", item.Modified_By));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLAPPOINMENTSLOT_SP_INSERTUPDATE", param);
                        DataRow dr = dt.Rows[0];
                        flag = (dr["FLAG"].ToString());
                    }
                }
                var data = (Convert.ToInt64(flag));
                return data;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);

            }
            return 0;
        }

        /// <summary>      
        /// Settings  --> AppoinmentSlot details (menu) -- > List Page (result)
        /// to get the list of AppoinmentSlot for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of AppoinmentSlot list Details DataTable</returns>
        public IList<AppoinmentSlotModel> AppoinmentSlot_List(int? IsActive, long Institution_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLAPPOINMENTSLOT_SP_LIST", param);
                List<AppoinmentSlotModel> list = (from p in dt.AsEnumerable()
                                                  select new AppoinmentSlotModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                      Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                      Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                      Doctor_Name = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                                     // Appoinment_Hours = p.Field<int>("APPOINMENTHOURS"),
                                                      Appoinment_Minutes = p.Field<decimal>("APPOINMENTMINUTES"),
                                                      FollowUp_Appoinment = p.Field<decimal>("FOLLOWUPAPPOINMENT"),
                                                      SlotInterval = p.Field<decimal>("SLOTINTERVAL"),
                                                      Created_By = p.Field<long>("CREATED_BY"),
                                                      Modified_By = p.Field<long?>("MODIFIED_BY"),
                                                      Department_Name = p.Field<string>("DEPARTMENT_NAME"),
                                                      IsActive = p.Field<int>("ISACTIVE"),
                                                      // Specialization = p.Field<string>("NAMESPECIALIZATION"),
                                                      //NewAppoinment = p.Field<decimal>("NEWAPPOINMENT")
                                                  }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>      
        /// Settings  --> AppoinmentSlot Details --> View Page
        /// to get the details in the view page of a selected AppoinmentSlot
        /// </summary>        
        /// <param name="Id">Id of a AppoinmentSlot</param>    
        /// <returns>Populated a AppoinmentSlot Details DataTable </returns>
        public AppoinmentSlotModel AppoinmentSlot_View(long Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLAPPOINMENTSLOT_SP_VIEW", param);
                AppoinmentSlotModel INS = (from p in dt.AsEnumerable()
                                           select
                                           new AppoinmentSlotModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                               Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                               Doctor_Name = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                             //  Appoinment_Hours = p.Field<int>("APPOINMENTHOURS"),
                                               Appoinment_Minutes = p.Field<decimal>("APPOINMENTMINUTES"),
                                               FollowUp_Appoinment = p.Field<decimal>("FOLLOWUPAPPOINMENT"),
                                               SlotInterval = p.Field<decimal>("SLOTINTERVAL"),
                                               Created_By = p.Field<long>("CREATED_BY"),
                                               Modified_By = p.Field<long?>("MODIFIED_BY"),
                                               Department_Name = p.Field<string>("DEPARTMENT_NAME"),
                                           }).FirstOrDefault();
                return INS;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        /// <summary>
        /// Settings - AppoinmentSlot Details List - Action - Inactive
        /// Selected AppoinmentSlot details to be deactivated  by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related AppoinmentSlot details to inactivate from AppoinmentSlot database</returns>
        public IList<AppoinmentSlotModel> AppoinmentSlot_Delete(AppoinmentSlotModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLAPPOINMENTSLOT_SP_INACTIVE", param);
                IList<AppoinmentSlotModel> list = (from p in dt.AsEnumerable()
                                                   select new AppoinmentSlotModel()
                                                 {
                                                     flag = p.Field<int>("flag")
                                                 }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Settings - AppoinmentSlot Details List - Action - Active
        /// Selected AppoinmentSlot details to be activated again by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related AppoinmentSlot details to activate again from AppoinmentSlot database</returns>
        public IList<AppoinmentSlotModel> AppoinmentSlot_Active(AppoinmentSlotModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLAPPOINMENTSLOT_SP_ACTIVE", param);
                IList<AppoinmentSlotModel> list = (from p in dt.AsEnumerable()
                                                 select new AppoinmentSlotModel()
                                                 {
                                                     flag = p.Field<int>("flag")
                                                 }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Settings - AppoinmentSlot Details List - Action - Active
        /// Selected AppoinmentSlot details to be activated again by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related AppoinmentSlot details to activate again from AppoinmentSlot database</returns>

        public void AppoinmentSlot_Active(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            ClsDataBase.Update("[MYCORTEX].TBLAPPOINMENTSLOT_SP_ACTIVE", param);

        }
        /// <summary>      
        /// Settings  --> Doctor List details (menu) -- > List Page (result)
        /// to get the list of Doctor List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of Doctor list Details DataTable</returns>
        public IList<DoctorAppoinmentSlotModel> Doctors_List(long? Institution_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DOCTORAPPOINMENTSLOT_SP_LIST", param);
                List<DoctorAppoinmentSlotModel> list = (from p in dt.AsEnumerable()
                                                        select new DoctorAppoinmentSlotModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                      Department_Name = p.Field<string>("DEPARTMENT_NAME"),
                                                      NameSpecialization = p.Field<string>("NAMESPECIALIZATION"),
                                                      ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                                                      EmailId = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                                      TypeName = p.Field<string>("TYPENAME"),
                                                      IsActive = p.Field<int>("ISACTIVE")
                                                  }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        /// <summary>      
        /// Settings  --> Active Appoinment Slot List details (menu) -- > List Page (result)
        /// to get the list of Appoinment Slot List for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a Appoinment slot</param> 
        /// <param name="Id">Id of a Institution Id</param> 
        /// <param name="Id">Id of a Doctor Id</param> 
        /// <returns>Populated List of Appoinment Slot list Details DataTable</returns>
        public AppoinmentSlotModel ActivateDoctorSlot_List(long Id, long Institution_Id, long Doctor_Id)
        {
            // int returnval;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@DOCTOR_ID", Doctor_Id));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ACTIVEDOCOTRSLOT_SP_CHECK", param);

                AppoinmentSlotModel lst = (from p in dt.AsEnumerable()
                                           select new AppoinmentSlotModel()
                                                 {
                                                     returnval = p.Field<int>("val")

                                                 }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}