using MyCortex.Masters.Models;
using MyCortex.User.Model;
using MyCortex.User.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Admin.Models;
using System.Data;

namespace MyCortex.Repositories
{
    interface IUserRepository
    {
        IList<DoctorInstitutionModel> DoctorInstitutionList();
        IList<DepartmentModel> DepartmentList();
        IList<InsuranceServiceCategoryModel> InsuranceServiceCategory();
        IList<InsuranceConsultationCategoryModel> InsuranceConsultationCategory();
        IList<ClinicianDetail_list> ClinicianDetails(long INSTITUTION_ID);
        IList<DepartmentModel> CloneDepartmentList(string search);
        IList<DepartmentModel> DepartmentListByInstitution(long Institution_Id);
        IList<DocumentTypeModel> DocumentTypeList();
        IList<NotesTypeModel> NotesTypeList();
        IList<BusinessUser_UserTypeListModel> BusinessUser_UserTypeList();
        IList<BusinessUser_UserTypeListModel> Clone_BusinessUser_UserTypeList(string search);
        UserModel Admin_InsertUpdate(Guid Login_Session_Id, UserModel insobj);
        long PatientChronicEdit(Guid Login_Session_Id, PatientChronicModel obj);
        long PatientGroupEdit(Guid Login_Session_Id, PatientGroupModel obj);
        UserModel Add_Dummy_Users(UserModel insobj);
        UserModel UserDetails_View(long Id, Guid Login_Session_Id, Int32 Language_Id);
        UserModel GetUserDetails(long Id, Guid Login_Session_Id, long Logged_User_Id);
        UserReturnModel UserDetails_InActive(long Id);
        UserReturnModel UserDetails_Active(long Id);
        IList<ItemizedUserDetailsModel> UserDetails_List(long Id, long InstitutionId, int? IsActive, Guid Login_Session_Id, int UserType_Id);
        IList<ItemizedUserDetailsModel> Doctor_Group_CCCG_List(long DoctorId, long InstitutionId, int? IsActive, Guid Login_Session_Id);
        UserList Patient_List(long? Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int? IsActive, long? INSTITUTION_ID, int StartRowNumber, int EndRowNumber,string SearchQuery,string SearchEncryptedQuery);
        List<ItemizedUserDetailsModel> Search_Patient_List(int? IsActive, long? INSTITUTION_ID, int StartRowNumber, int EndRowNumber, string NATIONALITY_ID, String SearchQuery, string PATIENTNO, string INSURANCEID, string MOBILE_NO, string EMAILID, string FIRSTNAME, string LASTNAME, string MRNNO, int? AdvanceFilter);
        GroupCreateModel GroupMaster_Insert(GroupCreateModel insobj);
        long AssignedGroup_Insert(List<AssignedGroupModel> obj);
        ItemizedUserDetailsModel PatientBasicDetailsList(long PatientId);
        IList<ItemizedUserDetailsModel> PatientGroupNameList(long? PatientId);
        IList<PatientAllergiesNameListModels> PatientAllergiesNameList(long? PatientId);
        long GetInstitutionForWebURL(string request);
        //long GetInstitutionFromShortName(string INSTITUTION_CODE);
        IList<InstitutionShortCode> GetInstitutionFromShortName(string INSTITUTION_CODE);

        int Get_Exist_AnyUnEncryptedUser();

        long GetUserid(string UserName);
        string GetInstitutionName(string INSTITUTION_CODE);
        IList<PatientHealthDataModel> HealthDataDetails_List(long Patient_Id, long OptionType_Id, long Group_Id, long UnitsGroupType, Guid Login_Session_Id,long StartRowNumber, long EndRowNumber,int Active, int IsGraphPlot);
        bool UserChangePwdURL(long Id, string url);
        IList<PatientHealthDataModel> HealthData_List_On_Parameter(long Patient_Id, long OptionType_Id, long Group_Id, long Parameter_Id, long UnitsGroupType, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber, int Active, int IsGraphPlot, Int32 Language_Id);
        IList<PatientHealthDataModel> GoalDataDetails_List(long Patient_Id, Guid Login_Session_Id);
        IList<MasterListModel> GetParameterNameList();
        PatientHealthDataModel PatientHealthData_Insert_Update(Guid Login_Session_Id, PatientHealthDataModel insobj);
        PatientHealthDataModel PatientHealthData_Sync_Insert_Update(Guid Login_Session_Id, PatientHealthDataModel insobj);
        IntegrationAppHistoryModel IntegrationAppHistory_Update(Guid Login_Session_Id, IntegrationAppHistoryModel insobj);
        IntegrationAppHistoryModel IntegrationAppHistory_Details(long Patient_Id, Guid Login_Session_Id);
        IList<PatientAppointmentsModel> PatientAppointmentList(long PatientId, Guid Login_Session_Id, int StartRowNumber, int EndRowNumber, Int32 Language_Id);
        IList<PatientAppointmentsModel> CG_PatientAppointmentList(long Institution_Id, Guid Login_Session_Id, long UserId, string TimeZoneName);
        IList<PatientAppointmentsModel> CG_Confirm_PatientAppointments(CG_PatientAppointmentConfirm obj);
        IList<PatientAppointmentsModel> PatientPreviousAppointmentList(long PatientId, Guid Login_Session_Id, int StartRowNumber, int EndRowNumber, Int32 Language_Id);
        IList<PatientChronicCondition_List> Chronic_Conditions(long PatientId);
        IList<ParametersListModel> GroupParameterNameList(long Patient_Id, long UnitGroupType_Id);
        IList<PatientInstituteModel> GETPATIENTINSTITUTION(long ID);
        IList<PatientHealthDataModel> ParametersDetails_Delete(PatientHealthDataModel noteobj);
        IList<PatientHealthDataModel> ParametersDetails_Active(PatientHealthDataModel noteobj);
        void UserDetails_PhotoUpload(byte[] imageFile, int Id);
        void UserDetails_NationalPhotoUpload(byte[] imageFile, int Id); 
        void UserDetails_InsurancePhotoUpload(byte[] imageFile, int Id);
        void UserDetails_PhotoImageCompress(byte[] imageFile, byte[] imageFile1, int Id,int Created_By);
        PhotoUploadModal UserDetails_GetPhoto(int Id);
        PhotoUploadModal UserDetails_GetNationalPhoto(int Id);
        PhotoUploadModal UserDetails_GetInsurancePhoto(int Id);
        void UserDetails_CertificateUpload(byte[] imageFile, int Id);
        PhotoUploadModal UserDetails_GetCertificate(long Id);

        IList<ProtocolModel> DoctorMonitoringProtocolView(long Patient_Id);
        MonitoringProtocolModel ProtocolMonitoringProtocolView(long Patient_Id); 
         IList<PatientAppointmentsModel> DoctorAppoinmentHistoryList(long PatientId, Guid Login_Session_Id);
        IList<PatientAppointmentsModel> DoctorAppoinmentsList(long PatientId, Guid Login_Session_Id);

        void PatientAssignedProtocol_InsertUpdate(ProtocolModel prtobj);
        IList<ProtocolModel> PatientAssignedProtocolHistorylist(long Patient_Id, Guid Login_Session_Id);

        IList<DecryptUserListModel> DecryptUserDetails(long startno);

        long GetUserCount();

        int NEW_EncryptUserDetails(DataTable dt);
        IList<MasterICDModel> ICD10CategoryList();
        IList<MasterICDModel> ICD10CodeList(long Institution_ID);
        long PatientICD10Details_AddEdit(Guid Login_Session_Id, List<MasterICDModel> obj);
        IList<MasterICDModel> PatientICD10Details_List(long Patient_Id, int Isactive, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber, long Institution_Id, long Page);
        MasterICDModel PatientICD10Details_View(long ID, Guid Login_Session_Id);
        void PatientICD10Details_Active(long ID);
        void PatientICD10Details_InActive(long ID);
        string PatientICD10_Date_Overlapping(Guid Login_Session_Id,List<MasterICDModel> ICD10Groupobj);
        IList<MasterICDModel> ICD10Code_List(string ICD10CodeSearch, long Institution_Id);

        IList<AllergyTypeModel> AllergyTypeList(long Institution_Id);
        IList<AllergyenModel> AllergenList(long ALLERGYTYPE_ID, long Institution_Id);
        IList<AllergyOnsetModel> AllergyOnsetList(long Institution_Id);
        IList<AllergySeverityModel> AllergySeverityList(long Institution_Id);
        IList<AllergyReactionModel> AllergyReactionList(long Institution_Id);
        IList<AllergyModel> Allergy_AddEdit(Guid Login_Session_Id,AllergyModel insobj);
        IList<AllergyModel> PatientAllergylist(long Patient_Id, int IsActive, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber);
        AllergyModel PatientAllergyView(long Id, Guid Login_Session_Id);
        IList<AllergyModel> AllergyDetails_InActive(AllergyModel noteobj);
        IList<AllergyModel> AllergyDetails_Active(AllergyModel noteobj);
        IList<DoctorNotesModel> PatientNotes_InsertUpdate(DoctorNotesModel noteobj);
        IList<DoctorNotesModel> PatientNotes_List(long idval, int UserTypeID, int IsActive, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber);
        DoctorNotesModel PatientNotes_View(long Id, Guid Login_Session_Id);

        long MedicationInsertUpdate(Guid Login_Session_Id, List<DrugDBMasterModel> insobj);
        IList<DrugDBMasterModel> MedicationList(long Patient_Id, int Isactive, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber);
        DrugDBMasterModel MedicationView(long Id, Guid Login_Session_Id);
        IList<DrugDBMasterModel> DrugCodeList();
        IList<DrugDBMasterModel> DrugCodeBased_DrugDetails(long DrugCodeId, long Institution_Id);
        IList<DrugDBMasterModel> RouteList(long Institution_Id);
        IList<DrugDBMasterModel> FrequencyList(long Institution_Id);
        DrugDBMasterModel FrequencybasedDetails(long FrequencyId);
        string MedicationInsertUpdateDateOverLapping(Guid Login_Session_Id, List<DrugDBMasterModel> obj);
        IList<DrugDBMasterModel> DrugCodeList(string DrugCodeSearch, long Institution_Id);
        void MedicationDetails_InActive(long Id);
        void MedicationDetails_Active(long Id);


        Patient_OtherDataModel Patient_OtherData_InsertUpdate(long Patient_Id, Guid Login_Session_Id,long Appointment_Id, long Id, string FileName, string DocumentName, string Remarks, byte[] fileData, long Created_By, DateTime? DocumentDates,int Is_Appointment,string Filetype,string DocumentType);
        Patient_OtherDataModel Patient_OtherData_View(long Id,Guid Login_Session_Id);
        AppointmentFeeModel GetAppointmentFee(long Institution_Id, long Department_Id);
        IList<Patient_OtherDataModel> Patient_OtherData_List(long Patient_Id, int IsActive, Guid Login_Session_Id, long StartRowNumber, long EndRowNumber);
        Patient_OtherDataModel Patient_OtherData_GetDocument(long Id);
        IList<Patient_OtherDataModel> Patient_Appointment_GetDocument(long Id);
        Patient_OtherDataModel Patient_OtherData_InActive(long Id, long Modified_By);
        Patient_OtherDataModel Patient_OtherData_Active(long Id, long Modified_By);
        IList<UserGroupDetails_List> GroupBasedUserList_ByUser(long User_Id);

        IList<AllergyModel> AllergyMasterList(int IsActive, long Institution_Id,int StartRowNumber,int EndRowNumber);
        IList<DoctorNotesModel> DoctorNotesDetails_InActive(DoctorNotesModel noteobj);
        IList<DoctorNotesModel> DoctorNotesDetails_Active(DoctorNotesModel noteobj);
        IList<PatientHealthDataModel> PatientLiveData_List(long Patient_Id, DateTime DataTime, Guid Login_Session_Id);
        PatientHealthDataModel PatientHealthData_AlertNotification_List(long HealthData_Id);
        UserModel InstitutionSubscriptionLicensecheck(UserModel obj);
        UserModel Patient_Update(Guid Login_Session_Id, UserModel insobj);
        bool UserSession_Status(string Login_Session_Id);
        IList<CometChat_User> GetCometChatUserList(long InstitutionId);
        long UpdateUserLanguage(long UserId, long LanguageId);
        int Save_User_Eligiblity_Logs(string eligibiltyId, int patient_id, responseModel Obj);
        int Save_Video_Call_Recording_Logs(string conference_id, string recording_url, string Recordingurl);
    }
}