using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MyCortex.User.Model
{
    public class UserModel
    {

        public long Id { get; set; }
        public string PatientId { get; set; }
        public string InstitutionName { get; set; }
        public int? IsActive { get; set; }
        public string Department_Name { get; set; }
        public long? INSTITUTION_ID { get; set; }
        public string INSTITUTION_CODE { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string EMPLOYEMENTNO { get; set; }
        public string EMAILID { get; set; }
        public string GOOGLE_EMAILID { get; set; }
        public string FB_EMAILID { get; set; }
        public string appleUserID { get; set; }
        public string ApprovalFlag { get; set; }
        public int? Patient_Type { get; set; }

        public long? DEPARTMENT_ID { get; set; }
        public string MOBILE_NO { get; set; }
        public string Photo { get; set; }
        public string FileName { get; set; }
        public string Photo_Fullpath { get; set; }
        public string UserName { get; set;}
        public long? UserType_Id { get; set; }
        public long? TITLE_ID { get; set; }
	    public string HEALTH_LICENSE { get; set; }
	    public string FILE_NAME { get; set; }
        public string FILETYPE { get; set; }
        public string FILE_FULLPATH { get; set; }
	    public string  UPLOAD_FILENAME { get; set; }
        public long? GENDER_ID { get; set; }
        public long? NATIONALITY_ID { get; set; }
        public long? ETHINICGROUP_ID { get; set; }
	    public DateTime? DOB { get; set; }
	    public string HOME_AREACODE { get; set; }
	    public string HOME_PHONENO { get; set; }
	    public string MOBIL_AREACODE { get; set; }
        public string POSTEL_ZIPCODE { get; set; }
	    public bool? EMR_AVAILABILITY { get; set; }
	    public string ADDRESS1 { get; set; }
	    public string ADDRESS2 { get; set; }
	    public string ADDRESS3 { get; set; }
        public string Memberid { get; set; }
        public string PolicyNumber { get; set; }
        public string RefernceId { get; set; }
        public string ExpiryDate { get; set; }
        public string PayorId { get; set; }
        public string PlanId { get; set; }
        public string PayorName { get; set; }
        public string PlanName { get; set; }
        public long? COUNTRY_ID { get; set; }
        public long? STATE_ID { get; set; }
        public long? CITY_ID { get; set; }
        public long? MARITALSTATUS_ID { get; set; }
        public long? BLOODGROUP_ID { get; set; }
	    public string PATIENTNO { get; set; }
	    public string INSURANCEID { get; set; }
	    public string MNR_NO { get; set; }
	    public  string NATIONALID  { get; set; }
        public long? SMOKER { get; set; }
        public long? DIABETIC { get; set; }
        public long? HYPERTENSION { get; set; }
        public long? CHOLESTEROL { get; set; }
	    public int? ISACTIVE { get; set; }
	    public int? CREATED_BY { get; set; }
        public int? User_Id { get; set; }
        public string GroupName { get; set; }
        public string GENDER_NAME { get; set; }
        public string Nationality { get; set; } 
	    public DateTime? CREATED_DT { get; set; }
        public string COUNTRY_NAME {get;set; }
        public string EthnicGroup { get; set; }
        public string StateName { get; set; }
        public string LocationName { get; set; }
        public string Institution { get; set; }
        public string LanguageKnown { get; set; }
        public string Createdby_ShortName { get; set; }

        public int? CURRENTLY_TAKEMEDICINE { get; set; }
	    public int? PAST_MEDICALHISTORY { get; set; }
	    public int? FAMILYHEALTH_PROBLEMHISTORY { get; set; }
	    public int? VACCINATIONS { get; set; }
        public long? DIETDESCRIBE_ID { get; set; }
        public long? EXCERCISE_SCHEDULEID { get; set; }
        public string EXCERCISE_TEXT { get; set; }
        public long? ALERGYSUBSTANCE_ID { get; set; }
	    public string ALERGYSUBSTANCE_TEXT { get; set; }
        public long? SMOKESUBSTANCE_ID { get; set; }
	    public string SMOKESUBSTANCE_TEXT { get; set; }
        public long? ALCOHALSUBSTANCE_ID { get; set; }
	    public string ALCOHALSUBSTANCE_TEXT { get; set; }
        public long? CAFFEINATED_BEVERAGESID { get; set; }
	    public string CAFFEINATEDBEVERAGES_TEXT { get; set; }
	    public string EMERG_CONT_FIRSTNAME { get; set; }
	    public string EMERG_CONT_MIDDLENAME { get; set; }
	    public string EMERG_CONT_LASTNAME { get; set; }
        public long? EMERG_CONT_RELATIONSHIP_ID { get; set; }
        public DateTime? LoginTime { get; set; }
        public int? Appointment_Module_Id { get; set; }
        public int? TimeZone_Id { get; set; }
        public string MaritalStatus { get; set; }
        public string BLOODGROUP_NAME { get; set; }
        public string RelationShipName { get; set; }
        public string DietDescribe { get; set; }
        public string AlergySubstance { get; set; }
        public string EXCERCISE_SCHEDULE { get; set; }
        public string SMOKESUBSTANCE { get; set; }
        public string ALCOHALSUBSTANCE { get; set; }
        public string CAFFEINATED_BEVERAGES { get; set; }
        public string ChronicCondition { get; set; }
        public int MenuType { get; set; }
        public int? flag { get; set; }
        public long? Group_Id { get; set; }
        public string PASSWORD { get; set; }
        
        public string Diabetic_Option { get; set; }
        public string HyperTension_Option { get; set; }
        public string Cholesterol_Option { get; set; }

        public string DOB_Encrypt { get; set; }
        public string Emergency_MobileNo { get; set; }
        public long? Protocol_Id { get; set; }
        public string ProtocolName { get; set; }

        public int? Approval_flag { get; set; }

        public long? Modified_By { get; set; }
        public IList<GroupTypeModel> GroupTypeList { get; set; }
        public IList<UserGroupDetails_List> SelectedGroupList { get; set; }

        public IList<InstitutionMasterModel> InstitutionList { get; set; }
        public IList<UserInstitutionDetails_List> SelectedInstitutionList { get; set; }

        public IList<LanguageProficiencyModel> LanguageList { get; set; }
        public IList<UserLangaugeDetails_List> SelectedLanguageList { get; set; }

        public IList<ChronicConditionModel> ChronicConditionList { get; set; }
        public IList<PatientChronicCondition_List> SelectedChronicConnditionList { get; set; }
        public IList<Patient_CurrentMedicalDetails> AddMedicines { get; set; }
        public IList<Patient_FamilyHeealthHistoryDetails> AddHealthProblem { get; set; }
        public IList<Patient_PastMedicalDetails> AddMedicalHistory { get; set; }
        public string PHOTOBLOB_LOW { get; set; }
        public string PHOTOBLOB_THUMB { get; set; }
        public bool IS_MASTER { get; set; }
        public string TAB_PIN { get; set; }
        public string TAB_PHOTO { get; set; }
        public string TAB_FINGERPRINT { get; set; }
        public string MrnPrefix { get; set; }
        //public string FullNameFormula { get; set; }
        public string NationalPhotoFullpath { get; set; }
        public string NationalPhotoFilename { get; set; }
        public string InsurancePhotoFullpath { get; set; }
        public string InsurancePhotoFilename { get; set; }
        public string NationalPhoto { get; set; }
        public string InsurancePhoto { get; set; }
        public int Unitgroup_preference { get; set; }
        public int Language_preference { get; set; }
        public long Payment_preference { get; set; }
        public long Insurance_Preference { get; set; }
        public long UserLanguage_Preference { get; set; }
        public int HiveType { get; set; }

    }

    public class UserReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }        
        public UserModel UserDetails { get; set; }        
    }

    public class UserGroupDetails_List
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public long? Group_Id { get; set; }

        public long? Dept_Id { get; set; }
        public int? IsActive { get; set; }
        public string UserName { get; set; }
        public string GroupName { get; set; }
        public string DeptName { get; set; }
        public string GenderName { get; set; }
    }
    public class UserInstitutionDetails_List
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public long? Institution_Id { get; set; }
        public string Institution { get; set; }
        public int? IsActive { get; set; }
    }

    public class UserLangaugeDetails_List
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public long? Language_Id { get; set; }
        public string Language { get; set; }
        public int? IsActive { get; set; }
    }


    public class PatientChronicCondition_List
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public string ChronicGroup { get; set; }
        public long? Chronic_Id { get; set; }
        public string ChronicCondition { get; set; }

        public int? IsActive { get; set; }
    }

    public class InstitutionShortCode
    {
        public long? INSTITUTION_ID { get; set; }
        public long? PatSignUpFlag { get; set; }

    }
    public class Patient_CurrentMedicalDetails
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public string MedicineName { get; set; }
        public string Remarks { get; set; }
        public int? Status { get; set; }
    }

    public class Patient_PastMedicalDetails
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public string Medical_History { get; set; }
        public string Remarks { get; set; }
        public int? Status { get; set; }
    }
    public class PatientChronicModel
    {
        public IList<PatientChronicCondition_List> EditSelectedChronicCondition { get; set; }
        public IList<ChronicConditionModel> ChronicConditionList { get; set; }
        public long CreatedBy { get; set; }
        public long UserId { get; set; }

    }
    public class PatientGroupModel
    {
        public IList<UserGroupDetails_List> EditSelectedGroupList { get; set; }
        public IList<GroupTypeModel> GroupTypeList { get; set; }
        public long CreatedBy { get; set; }
        public long UserId { get; set; }

    }
    public class Patient_FamilyHeealthHistoryDetails
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public long? Relationship_Id { get; set; }
        public string Health_Problem { get; set; }
        public string Remarks { get; set; }
        public string Relationship_Name { get; set; }
        public int? Status { get; set; }
    }
    public class GroupCreateModel
    {
        public long? Id { get; set; }
        public string CreateGroupName { get; set; }
        public long Institution_Id { get; set; }
        public int? flag { get; set; }
        public string returnMessage { get; set; }
    }
    public class AssignedGroupModel
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
        public string Group_Id { get; set; }
        public int? IsActive { get; set; }
    }
    public class PatientAllergiesNameListModels
    {
        public long? UserId { get; set; }
        public string AllergyName { get; set; }
        public DateTime? ActiveTo { get; set; }
        public long? AllergyDetailsId { get; set; }
        public int IsActive { get; set; }
    }
 
}