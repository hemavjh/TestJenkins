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
using MyCortex.Masters.Models;


namespace MyCortex.Repositories.Admin
{
    public class InstitutionRepository : IInstitutionRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        public InstitutionRepository()
        {
            db = new ClsDataBase();

        }

        /// <summary>
        /// To insert/update Instituion Master
        /// </summary>
        /// <param name="insobj">Institution object</param>
        /// <returns>Inserted/Updated Institution object</returns>
        public IList<InstitutionModel> InstitutionDetails_AddEdit(InstitutionModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@INSTITUTION_NAME", obj.Institution_Name));
            param.Add(new DataParameter("@INSTITUTION_SHORTNAME", obj.INSTITUTION_SHORTNAME));
            param.Add(new DataParameter("@ADDRESS1", obj.Institution_Address1));
            param.Add(new DataParameter("@ADDRESS2", obj.Institution_Address2));
            param.Add(new DataParameter("@ADDRESS3", obj.Institution_Address3));
            param.Add(new DataParameter("@POSTAL_ZIPCODE", obj.ZipCode));
            param.Add(new DataParameter("@EMAILID", obj.Email));
            param.Add(new DataParameter("@COUNTRYID", obj.CountryId));
            param.Add(new DataParameter("@STATEID", obj.StateId));
            param.Add(new DataParameter("@CITYID", obj.CityId));
            param.Add(new DataParameter("@LOGO_NAME", obj.Photo));
            param.Add(new DataParameter("@LOGO_FILENAME", obj.FileName));
            param.Add(new DataParameter("@LOGO_FULLPATH", obj.Photo_Fullpath));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_by));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SP_INSERTUPDATE", param);

            IList<InstitutionModel> INS = (from p in dt.AsEnumerable()
                                           select
                                           new InstitutionModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                               INSTITUTION_SHORTNAME = p.Field<string>("INSTITUTION_SHORTNAME"),
                                               Institution_Address1 = p.Field<string>("ADDRESS1"),
                                               Institution_Address2 = p.Field<string>("ADDRESS2"),
                                               Institution_Address3 = p.Field<string>("ADDRESS3"),
                                               ZipCode = p.Field<string>("POSTEL_ZIPCODE"),
                                               Email = p.Field<string>("EMAILID"),
                                               CountryId = p.Field<long>("COUNTRYID"),
                                               StateId = p.Field<long>("STATEID"),
                                               CityId = p.Field<long>("CITYID"),
                                               Photo = p.Field<string>("LOGO_NAME"),
                                               FileName = p.Field<string>("LOGO_FILENAME"),
                                               Photo_Fullpath = p.Field<string>("LOGO_FULLPATH"),
                                               flag = p.Field<int>("flag"),
                                               Created_by = p.Field<long>("CREATED_BY"),

                                           }).ToList();
            return INS;


        }

        /// <summary>
        /// get the list of institution for the filter
        /// </summary>
        /// <param name="Id">Primary key Id of institution</param>
        /// <param name="IsActive">Active / inactive flag</param>
        /// <returns></returns>
        public IList<InstitutionModel> InstitutionDetails_List(long? Id, int? IsActive)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@IsActive", IsActive));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SP_LIST", param);
            List<InstitutionModel> list = (from p in dt.AsEnumerable()
                                           select new InstitutionModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                               INSTITUTION_SHORTNAME = p.Field<string>("INSTITUTION_SHORTNAME"),
                                               Institution_Address1 = p.Field<string>("ADDRESS1"),
                                               Institution_Address2 = p.Field<string>("ADDRESS2"),
                                               Institution_Address3 = p.Field<string>("ADDRESS3"),
                                               ZipCode = p.Field<string>("POSTEL_ZIPCODE"),
                                               Email = p.Field<string>("EMAILID"),
                                               CountryId = p.Field<long>("COUNTRYID"),
                                               CountryName = p.Field<string>("COUNTRY_NAME"),
                                               StateId = p.Field<long>("STATEID"),
                                               StateName = p.Field<string>("StateName"),
                                               CityId = p.Field<long>("CITYID"),
                                               CityName = p.Field<string>("LocationName"),
                                               Photo = p.Field<string>("LOGO_NAME"),
                                               FileName = p.Field<string>("LOGO_FILENAME"),
                                               Photo_Fullpath = p.Field<string>("LOGO_FULLPATH"),
                                               IsActive = p.Field<int>("ISACTIVE")
                                           }).ToList();
            return list;
        }

        /// <summary>      
        /// to get the details of a selected Institution
        /// </summary>        
        /// <param name="Id">Id of a Institution</param>    
        /// <returns>a Institution Details </returns>
        public InstitutionModel InstitutionDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SP_VIEW", param);
            InstitutionModel INS = (from p in dt.AsEnumerable()
                                    select
                                    new InstitutionModel()
                                    {
                                        Id = p.Field<long>("Id"),
                                        Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                        INSTITUTION_SHORTNAME = p.Field<string>("INSTITUTION_SHORTNAME"),
                                        Institution_Address1 = p.Field<string>("ADDRESS1"),
                                        Institution_Address2 = p.Field<string>("ADDRESS2"),
                                        Institution_Address3 = p.Field<string>("ADDRESS3"),
                                        ZipCode = p.Field<string>("POSTEL_ZIPCODE"),
                                        Email = p.Field<string>("EMAILID"),
                                        CountryId = p.Field<long>("COUNTRYID"),
                                        CountryName = p.Field<string>("COUNTRY_NAME"),
                                        StateId = p.Field<long>("STATEID"),
                                        StateName = p.Field<string>("StateName"),
                                        CityId = p.Field<long>("CITYID"),
                                        CityName = p.Field<string>("LocationName"),
                                        //Photo = p.Field<string>("LOGO_NAME"),
                                        //FileName = p.Field<string>("LOGO_FILENAME"),
                                        //Photo_Fullpath = p.Field<string>("LOGO_FULLPATH"),
                                      

                                    }).FirstOrDefault();
            return INS;
        }

        /// <summary>
        /// Deactivate a institution
        /// </summary>
        /// <param name="Id">Id of a institution</param>
        /// <returns>Deactivated institution details</returns>
        public void InstitutionDetails_Delete(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            ClsDataBase.Update("[MYCORTEX].INSTITUTION_SP_INACTIVE", param);
        }

        /// <summary>
        /// Activate a Institution
        /// </summary>
        /// <param name="Id">Id of the institution</param>
        /// <returns>Activated Institution details</returns>
        public void InstitutionDetails_Active(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            ClsDataBase.Update("[MYCORTEX].INSTITUTION_SP_ACTIVE", param);

        }

        /// <summary>
        /// Activate a Institution
        /// </summary>
        /// <param name="Id">Id of the institution</param>
        /// <returns>Activated Institution details</returns>
        public void InstitutionDefaultData_Insert(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTIONID", Id));
            ClsDataBase.Update("[MYCORTEX].CREATEINSTITUTIONMASTER_SP", param);

        }

        /// <summary>
        /// upload a photo blob data in table
        /// </summary>
        /// <param name="Id">Id of institution</param>
        /// <returns>sucess/failure status</returns>
        public void Institution_PhotoUpload(byte[] imageFile, int Id)
        {
            DataEncryption encrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            if (imageFile != null)
            {
                param.Add(new DataParameter("@BLOBDATA", encrypt.EncryptFile(imageFile)));
            }
            else
            {
                param.Add(new DataParameter("@BLOBDATA", null));
            }
            ClsDataBase.Update("[MYCORTEX].INSTITUTIONPHOTO_SP_INSERTUPDATE", param);
        }

        /// <summary>
        /// get a instituion photo blob
        /// </summary>
        /// <param name="Id">Id of the institution</param>
        /// <returns>Photo blob of a institution </returns>
        public PhotoUploadModal Institution_GetPhoto(long Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].INSTITUTION_SP_GETPHOTO", param);
            //if (!Convert.IsDBNull(dt.Rows[0]["PhotoBlob"]))
            if (dt.Rows.Count>0)
            {
                if (!Convert.IsDBNull(dt.Rows[0]["PhotoBlob"]))
                { 
                    byte[] returnPhoto = (byte[])dt.Rows[0]["PhotoBlob"];
                    return new PhotoUploadModal
                    {
                        Id = Id,
                        PhotoBlob = decrypt.DecryptFile(returnPhoto)
                    };
                }
                else
                {
                    return new PhotoUploadModal
                    {
                    };
                }
            }
            else
            {
                return new PhotoUploadModal
                {
                } ;
            }
        }   

    }
}