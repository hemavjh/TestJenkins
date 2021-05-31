using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class MasterAllergyModel
    {

        public string TotalRecord { get; set; }
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
        public IList<MasterAllergyTypeModel> Allergy_TypeList { get; set; }
        public IList<MasterAllergyenModel> Allergen_List { get; set; }
        public IList<MasterAllergyOnsetModel> AllengyOnset_List { get; set; }
        public IList<MasterAllergySeverityModel> AllengySeverity_List { get; set; }
        public IList<MasterAllergyReactionModel> AllergyReaction_List { get; set; }
        public IList<MasterAllergyDetailsChildModels> SelectedAllergyList { get; set; }
        public int flag { get; set; }
        public int IsActive { get; set; }
        public string Created_By_Name { get; set; }
        public DateTime Created_Dt { get; set; }
        public long Modified_By { get; set; }
        public long InstitutionId { get; set; }
    }
    public class MasterAllergyTypeModel
    {
        public long Id { get; set; }
        public string AllergyTypeName { get; set; }
        public int IsActive { get; set; }
    }
    public class MasterAllergyenModel
    {
        public long Id { get; set; }
        public string AllergenName { get; set; }
        public int IsActive { get; set; }
        public long AllergyTypeId { get; set; }

    }
    public class MasterAllergyOnsetModel
    {
        public long Id { get; set; }
        public string AllergyOnsetName { get; set; }
        public int IsActive { get; set; }
    }
    public class MasterAllergySeverityModel
    {
        public long Id { get; set; }
        public string AllergySeverityName { get; set; }
        public int IsActive { get; set; }
    }
    public class MasterAllergyReactionModel
    {
        public long? Id { get; set; }
        public string AllergyReactionName { get; set; }
        public int IsActive { get; set; }
    }

    public class MasterAllergyReturnModels
    {

        public string Status { get; set; }
        public string Message { get; set; }
        public int ReturnFlag { get; set; }
        public IList<MasterAllergyModel> PatientAllergyDetails { get; set; }
    }


    public class MasterAllergyDetailsChildModels
    {
        public long Id { get; set; }
        public long AllergyDetails_Id { get; set; }
        public long AllergyReaction_Id { get; set; }
        public long ChildId { get; set; }
        public string ReactionName { get; set; }

    }
}