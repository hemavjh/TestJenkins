using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyCortex.Login.Model
{
    public class UsersModel
    {
            public int Id { get; set; }
            public int Account_Type_Id { get; set; }
            [Required]
            [StringLength(20)]
            public string Username { get; set; }
            [Required]
            [StringLength(20)]
            [DataType(DataType.Password)]
            public string Password { get; set; }
            [Required]
            [StringLength(100)]
            [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")]
            public string Email { get; set; }
            public DateTime Created_Dt { get; set; }

     
    }
}