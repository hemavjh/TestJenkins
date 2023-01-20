using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Home.Models
{
    public class RequestEligibility
    {
        public string emiratesId { get; set; }
        public string clinicianLicense { get; set; }
        public int consultationCategoryId { get; set; }
        public string countryCode { get; set; }
        public string mobileNumber { get; set; }
        public int payerId { get; set; }
        public string referralLetterRefNo { get; set; }
        public int serviceCategoryId { get; set; }
        public string facilityLicense { get; set; }

    }

    public class RequestCancelEligibility
    {
        public string eligibilityId { get; set; }

    }

    public class EligibilityResponseData
    {
        public int ruleId { get; set; }
        public string ruleMessage { get; set; }
        public bool showQuestionsOnEligAnswer { get; set; }
        public ruleQuestionsData[] ruleQuestions { get; set; }
        public long eligibilityId { get; set; }
    }

    public class ruleQuestionsData
    {
        public int ruleQuestionId { get; set; }
        public string ruleQuestionValue { get; set; }
        public int ruleId { get; set; }
        public int ruleAnswerTypeId { get; set; }
        public ruleAnswersData[] ruleAnswers { get; set; }
    }

    public class ruleAnswersData
    {
        public int ruleAnswerId { get; set; }
        public string ruleAnswerValue { get; set; }
        public int ruleQuestionId { get; set; }
    }

    public class EligibilityResponseError
    {

    }

    public class RequestEligibilityResponse
    {
        public int status { get; set; }
        public EligibilityResponseData data { get; set; }
        public Array errors { get; set; }
    }

    public class RequestCancelEligibilityResponse
    {
        public int status { get; set; }
        public Array data { get; set; }
        public Array errors { get; set; }
    }

    public class EligibilityDetailResponseData
    {
        public string eligibilityRules { get; set; }
        public string eligibilityRuleCheckResponse { get; set; }
        public eligibilityCheck eligibilityCheck { get; set; }
    }

    public class RequestEligibilityDetailResponse
    {
        public int status { get; set; }
        public EligibilityDetailResponseData data { get; set; }
        public Array errors { get; set; }
    }

    public class eligibilityCheck
    {
        public clinician clinician { get; set; }
        public serviceCategory serviceCategory { get; set; }
        public eligibilityCheckAnswer eligibilityCheckAnswer { get; set; }
        public denial denial { get; set; }
        public payer payer { get; set; }
        public consultationCategory consultationCategory { get; set; }
        public referralClinician referralClinician { get; set; }
        public bool result { get; set; }
        public string transactionDate { get; set; }
        public string eligibilityIdentifier { get; set; }
        public long eligibilityId { get; set; }
        public string referralLetterRefNo { get; set; }
        public string prescriptionReference { get; set; }
        public string userName { get; set; }
        public string voiNubmer { get; set; }
        public string voiMessage { get; set; }
        public string requestCancelledBy { get; set; }
        public string eligibilityEvent { get; set; }
        public string ultrasoundCategory { get; set; }
        public string insurerPayer { get; set; }
        public string mobileNumber { get; set; }
        public string emiratesId { get; set; }
        public int eligibilityStatusId { get; set; }
        public bool isRuleAnswered { get; set; }
        public int insurerPayerId { get; set; }
    }

    public class clinician
    {
        public long clinicianId { get; set; }
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

    public class serviceCategory
    {
        public int serviceCategoryId { get; set; }
        public string description { get; set; }
    }
    public class eligibilityCheckAnswer
    {
        public long eligibilityCheckAnswerId { get; set; }
        public string idPayer { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string birthDate { get; set; }
        public string nationality { get; set; }
        public string authorizationEndDate { get; set; }
        public string gender { get; set; }
        public string photoPath { get; set; }
        public string comments { get; set; }
        public healthRiskScoreViewModel healthRiskScoreViewModel { get; set; }
        public eligibilityCheckAnswerMembers[] eligibilityCheckAnswerMembers { get; set; }
    }
    public class denial
    {
        public string denialReason { get; set; }
        public string denialCode { get; set; }
    }
    public class payer
    {
        public long payerId { get; set; }
        public string payerName { get; set; }
        public string image { get; set; }
        public bool eligibilityIntegration { get; set; }
        public bool hasMemberCheck { get; set; }
        public bool isConsultationCategoryAvailable { get; set; }
        public string inputMask { get; set; }
        public int relatedId { get; set; }
        public string basicFormularyFileId { get; set; }
        public string hasEmiratesIDOrMemberID { get; set; }
        public bool showGhqMessage { get; set; }
    }
    public class consultationCategory
    {
        public int consultationCategoryId { get; set; }
        public string description { get; set; }
    }
    public class referralClinician
    {
        public string clinicianId { get; set; }
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

    public class healthRiskScoreViewModel
    {
        public string healthRiskScoreId { get; set; }
        public string healthScore { get; set; }
        public string description { get; set; }
    }
    public class eligibilityCheckAnswerMembers
    {
        public string vVip { get; set; }
        public long cardNumber { get; set; }
        public string packageCategory { get; set; }
        public string packageName { get; set; }
        public string cardNetwork { get; set; }
        public string policyName { get; set; }
        public string startDate { get; set; }
        public string expiryDate { get; set; }
        public string attachment { get; set; }
        public long policyId { get; set; }
        public eligibilityBenefitsStructure eligibilityBenefitsStructure { get; set; }
        public eligibilityCheckAnswerBenefits eligibilityCheckAnswerBenefits { get; set; }
    }
    public class eligibilityBenefitsStructure
    {
        public benefitValuesArr[] benefitValuesArrs { get; set; }
    }
    public class benefitValuesArr
    {
        public string code { get; set; }
        public benefitValues[] benefitValues { get; set; }
        public bool isCorrect { get; set; }
    }
    public class benefitValues
    {
        public string code { get; set; }
        public int value { get; set; }
        public int valueTypeId { get; set; }
    }
    public class eligibilityCheckAnswerBenefits
    {
        public string code { get; set; }
        public string benefitValue { get; set; }
    }
}