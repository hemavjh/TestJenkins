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

    public class EligibilityResponseData
    {
        public int ruleId { get; set; }
        public string ruleMessage { get; set; }
        public bool showQuestionsOnEligAnswer { get; set; }
        public string ruleQuestions { get; set; }
        public long eligibilityId { get; set; }
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

    public class EligibilityDetailResponseData
    {
        public string eligibilityRules { get; set; }
        public string eligibilityRuleCheckResponse { get; set; }
        public string eligibilityCheck { get; set; }
    }

    public class RequestEligibilityDetailResponse
    {
        public int status { get; set; }
        public EligibilityDetailResponseData data { get; set; }
        public Array errors { get; set; }
    }
}