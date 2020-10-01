using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class StateMasterModel
    {
        public long Id { get; set; }

        public string StateName { get; set; }

        public string StateCode { get; set; }

        public int IsActive { get; set; }

        public int ModifiedUser_id { get; set; }

        public DateTime Created_Dt { get; set; }

        public IList<CountryMasterModel> ddlCountryName { get; set; }

        public long? CountryId { get; set; }

        public string CountryName { get; set; }
        public long LocationId { get; set; }



    }
}