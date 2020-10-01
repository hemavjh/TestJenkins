using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class LocationMasterModel
    {
        public long Id { get; set; }

        public long LId { get; set; }

        public string LocationName { get; set; }

        public string LocationCode { get; set; }

        public int IsActive { get; set; }
        public int Active { get; set; }

        public int ModifiedUser_id { get; set; }

        public DateTime Created_Dt { get; set; }

        public IList<CountryMasterModel> ddlCountry { get; set; }

        public long? CountryId { get; set; }

        public string CountryName { get; set; }

        public IList<StateMasterModel> ddlstateName { get; set; }

        public long? StateId { get; set; }

        public string StateName { get; set; }


        public int? CompanyId { get; set; }
    }
}