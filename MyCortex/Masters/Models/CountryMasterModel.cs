using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class CountryMasterModel
    {

        public long Id { get; set; }

        public string CountryName { get; set; }

        public string CountryCode { get; set; }

        public int IsActive { get; set; }

        public int ModifiedUser_id { get; set; }

        public DateTime Created_Dt { get; set; }
        public long StateId { get; set; }
        public long LocationId { get; set; }
    }

    public class CountryStateLocationModel
    {

        public IList<CountryMasterModel> CountryList { get; set; }
        public IList<StateMasterModel> StateList { get; set; }
        public IList<LocationMasterModel> LocationList { get; set; }
    }

    // to populate Dropdown
    public class ddItemList
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int IsActive { get; set; }
        public string Country_ISO3 { get; set; }
        public string Country_ISO2 { get; set; }
        public string CountryCode { get; set; }
        public string Timezone { get; set; }
    }

    // to populate Dropdown
    public class MasterListModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int IsActive { get; set; }
    }
}