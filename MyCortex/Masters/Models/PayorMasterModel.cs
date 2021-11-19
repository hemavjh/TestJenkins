using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Masters.Models
{
    public class PayorMasterModel
    {
        public string TotalRecord { get; set; }
        public int RowNumber { get; set; }
        public long Id { get; set; }
        public long InstitutionId { get; set; }
        public string PayorName { get; set; }
        public string ShortCode { get; set; }
        public string ReferCode { get; set; }
        public int Returnval { get; set; }
        public int IsActive { get; set; }
        public int flag { get; set; }
        public long User_Id { get; set; }
        public string Description { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedDT { get; set; }
        public DateTime ModifiedDT { get; set; }
        public int StartRowNumber { get; set; }
        public int EndRowNumber { get; set; }
    }
    public class PayorMasterReturnModels
    {

        public string Status { get; set; }
        public string Message { get; set; }
        public IList<PayorMasterModel> PayorMasterDetail { get; set; }
        public PayorMasterDataPagination _metadata { get; set; }
        public int ReturnFlag { get; set; }
    }
    public class PayorMasterDataPagination
    {
        public long page { get; set; }
        public long per_page { get; set; }
        public long page_count { get; set; }
        public long total_count { get; set; }
        public MasterICDDataLinks Links { get; set; }

    }
}