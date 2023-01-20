using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCortex.Home.Models
{
        public class Clinician
        {
            public int clinicianId { get; set; }
            public string licenseNo { get; set; }
            public string fullName { get; set; }
            public string specialty { get; set; }
            public int clinicianSpecialtyId { get; set; }
            public string category { get; set; }
            public string title { get; set; }
            public string nationality { get; set; }
            public int nationalityId { get; set; }
            public int emiratesId { get; set; }
            public string passportNumber { get; set; }
            public int gender { get; set; }
            public string email { get; set; }
            public string phoneNumber { get; set; }
            public string facilityLicense { get; set; }
            public string isActive { get; set; }
            public int regulatoryId { get; set; }
            public string expiryDate { get; set; }
        }

        public class ConsultationCategory
        {
            public int consultationCategoryId { get; set; }
            public string description { get; set; }
        }

        public class Data
        {
            public string eligibilityRules { get; set; }
            public string eligibilityRuleCheckResponse { get; set; }
            public EligibilityCheck eligibilityCheck { get; set; }
        }

        public class Denial
        {
            public string denialReason { get; set; }
            public string denialCode { get; set; }
        }

        public class EligibilityCheck
        {
            public Clinician clinician { get; set; }
            public ServiceCategory serviceCategory { get; set; }
            public EligibilityCheckAnswer eligibilityCheckAnswer { get; set; }
            public Denial denial { get; set; }
            public int eligibilityId { get; set; }
            public DateTime transactionDate { get; set; }
            public string eligibilityIdentifier { get; set; }
            public bool result { get; set; }
            public Payer payer { get; set; }
            public string insurerPayer { get; set; }
            public string mobileNumber { get; set; }
            public string emiratesId { get; set; }
            public int eligibilityStatusId { get; set; }
            public ConsultationCategory consultationCategory { get; set; }
            public ReferralClinician referralClinician { get; set; }
            public string referralLetterRefNo { get; set; }
            public string prescriptionReference { get; set; }
            public string userName { get; set; }
            public int insurerPayerId { get; set; }
            public string voiNubmer { get; set; }
            public string voiMessage { get; set; }
            public bool isRuleAnswered { get; set; }
            public string requestCancelledBy { get; set; }
            public string eligibilityEvent { get; set; }
            public string ultrasoundCategory { get; set; }
            public int eligibilityVisitCount { get; set; }
            public ServiceSubCategory serviceSubCategory { get; set; }
        }

        public class EligibilityCheckAnswer
        {
            public int eligibilityCheckAnswerId { get; set; }
            public string idPayer { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string birthDate { get; set; }
            public string nationality { get; set; }
            public DateTime authorizationEndDate { get; set; }
            public string gender { get; set; }
            public string photoPath { get; set; }
            public string comments { get; set; }
            public HealthRiskScoreViewModel healthRiskScoreViewModel { get; set; }
            public List<Object> eligibilityCheckAnswerMembers { get; set; }
        }

        public class HealthRiskScoreViewModel
        {
            public string healthRiskScoreId { get; set; }
            public string healthScore { get; set; }
            public string description { get; set; }
        }

        public class Payer
        {
            public int payerId { get; set; }
            public string payerName { get; set; }
            public string image { get; set; }
            public bool eligibilityIntegration { get; set; }
            public bool hasMemberCheck { get; set; }
            public bool isConsultationCategoryAvailable { get; set; }
            public string inputMask { get; set; }
            public string relatedId { get; set; }
            public string basicFormularyFileId { get; set; }
            public string hasEmiratesIDOrMemberID { get; set; }
            public bool showGhqMessage { get; set; }
        }

        public class ReferralClinician
        {
            public string clinicianId { get; set; }
            public string licenseNo { get; set; }
            public string fullName { get; set; }
            public object specialty { get; set; }
            public string clinicianSpecialtyId { get; set; }
            public string category { get; set; }
            public string title { get; set; }
            public string nationality { get; set; }
            public int nationalityId { get; set; }
            public int emiratesId { get; set; }
            public string passportNumber { get; set; }
            public int gender { get; set; }
            public string email { get; set; }
            public string phoneNumber { get; set; }
            public string facilityLicense { get; set; }
            public string isActive { get; set; }
            public int regulatoryId { get; set; }
            public string expiryDate { get; set; }
        }

        public class RequestEligibilityDetailResponse_bylist
    {
            public int status { get; set; }
            public Data data { get; set; }
            public List<string> errors { get; set; }
        }

        public class ServiceCategory
        {
            public int serviceCategoryId { get; set; }
            public string description { get; set; }
        }

        public class ServiceSubCategory
        {
            public int serviceSubCategoryId { get; set; }
            public string description { get; set; }
            public string category { get; set; }
            public int serviceCategoryId { get; set; }
        }

    public class UpdateAppointment
    {
        public long Appointment_Id { get; set; }
        public int Status { get; set; }
        public int PaymentStatus_Id { get; set; }
    }
    public class FalseEligibility
    {
        public long eligibilityId { get; set; }
      
    }
}
