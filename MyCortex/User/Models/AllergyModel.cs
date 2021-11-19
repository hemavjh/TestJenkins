using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class AllergyModel
    {
        public AllergyModel()
        {

        }
        public string TotalRecord { get; set; }
        public int RowNumber { get; set; }
        public long Id { get; set; }
        public DateTime? OnSetDate { get; set; }
        public long AllergenId { get; set; }
        public long AllergyTypeId { get; set; }
        public long? AllergyOnsetId { get; set; }
        public long? AllergySeverityId { get; set; }
        public string Remarks { get; set; }
        public long Patient_Id { get; set; }
        public long Created_By { get; set; }
        public string AllergyTypeName { get; set; }
        public string AllergenName { get; set; }
        public string AllergyOnsetName { get; set; }
        public string AllergySeverityName { get; set; }
        public string AllergyReactionName { get; set; }
        public IList<AllergyTypeModel> Allergy_TypeList { get; set; }
        public IList<AllergyenModel> Allergen_List { get; set; }
        public IList<AllergyOnsetModel> AllengyOnset_List { get; set; }
        public IList<AllergySeverityModel> AllengySeverity_List { get; set; }
        public IList<AllergyReactionModel> AllergyReaction_List { get; set; }
        public IList<AllergyDetailsChildModels> SelectedAllergyList { get; set; }
        public int flag { get; set; }
        public int IsActive { get; set; }
        public string Created_By_Name { get; set; }
        public DateTime Created_Dt { get; set; }
        public long Modified_By { get; set; }
        public long Institution_Id { get; set; }
        
    }

    public class AllergyTypeModel
    {
        public long Id { get; set; }
        public string AllergyTypeName { get; set; }
        public int IsActive { get; set; }
    }
    public class AllergyenModel
    {
        public long Id { get; set; }
        public string AllergenName { get; set; }
        public int IsActive { get; set; }
        public long AllergyTypeId { get; set; }

    }
    public class AllergyOnsetModel
    {
        public long Id { get; set; }
        public string AllergyOnsetName { get; set; }
        public int IsActive { get; set; }
    }
    public class AllergySeverityModel
    {
        public long Id { get; set; }
        public string AllergySeverityName { get; set; }
        public int IsActive { get; set; }
    }
    public class AllergyReactionModel
    {
        public long? Id { get; set; }
        public string AllergyReactionName { get; set; }
        public int IsActive { get; set; }
    }

    public class PatientAllergyDetailsReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int ReturnFlag { get; set; }
        public IList<AllergyModel> PatientAllergyDetails { get; set; }
        public AllergyDataPagination _metadata { get; set; }
    }
    public class AllergyDetailsChildModels
    {
        public long Id { get; set; }
        public long AllergyDetails_Id { get; set; }
        public long AllergyReaction_Id { get; set; }
        public long ChildId { get; set; }
        public string ReactionName { get; set; }

    }
    public class AllergyDataPagination
    {
        public long page { get; set; }
        public long per_page { get; set; }
        public long page_count { get; set; }
        public long total_count { get; set; }
        public AllergyDataLinks Links { get; set; }

    }

    public class AllergyDataLinks
    {
        public string self { get; set; }
        public string first { get; set; }
        public string previous { get; set; }
        public string next { get; set; }
        public string last { get; set; }
    }
}

