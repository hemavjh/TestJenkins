using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Masters.Models;

namespace MyCortex.User.Model
{
    public class MedicationModel
    {
        public MedicationModel()
        {


        }
        public long Id { get; set; }
        public string Name { get; set; }
        public int? IsActive { get; set; }
        public long PatientId { get; set; }
        public long DrugId { get; set; }
        public long FrequencyId { get; set; }
        public long RouteId { get; set; }
        public decimal NoOfDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public long Created_By { get; set; }
        public DateTime Created_Dt { get; set; }
        public int flag { get; set; }
        public string FrequencyName { get; set; }
        public string RouteName { get; set; }
     //   public IList<DrugDBMasterModel> DrugDBDetails { get; set; }
        public DrugDBMasterModel DrugDBDetails { get; set; }
      }
        public class FrequencyDetails_List
        {
            public long? Id { get; set; }
            public string FrequencyName { get; set; }
            public string ShortCode { get; set; }
            public int No_of_Slots { get; set; }
            public decimal  Days { get; set; }
            public int IsActive { get; set; }
        }

        public class RouteDetails_List
        {
            public long? Id { get; set; }
            public string RouteName { get; set; }
            public int IsActive { get; set; }
        }

        public class MedicationReturnModels
        {
            public int ReturnFlag { get; set; }
            public string Status { get; set; }
            public string Message { get; set; }
            public IList<MedicationModel> MedicationDetails { get; set; }
       
        }

   
}