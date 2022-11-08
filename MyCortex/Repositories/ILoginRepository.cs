
using MyCortex.Login.Model;
using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface ILoginRepository
    {
        LoginModel Userlogin_AddEdit( string isMYH,string ShortCode, LoginModel obj);
        //LoginModel Userlogin_AddEdit(int Id, string UserName, string Password);
        long User_LogOut(long UserId, string SessionId);
        long Get_UserInstitution(string EmailId);
        long Get_UserType(string EmailId);
        IList<EmployeeLoginModel> BuildVersion_Details();
        IList<EmployeeLoginModel> GetProduct_Details();
        bool CheckDBConnection();
        IList<EmployeeLoginModel> UserLogged_Details(long Id);
        LoginModel UserDetails_Get_GoogleMail(string EmailId);
        LoginModel UserDetails_Get_FBMail(string EmailId);

        int ChangePassword(long Id, string NewPassword, string OldPassword, string Confirmpassword, long ModifiedUser_Id, long InstitutionId, int PageTypeId);
        ResetPasswordReturnModel ResetPassword(long Id, string NewPassword, string ReenterPassword, long Institution_Id, long createdBy, string EmailId);
        IList<UsertypeModal> Userdetailslist(int UserTypeId,long InstitutionId,int IS_MASTER);
        IList<UsertypeModal> Usertypedetailslist();
        LoginModel GetPasswordHistory_Count(long UserId);
        UsertypeModal LastPasswordChangeTime(long UserId);
        LoginModel Userlogin_Validate(string Username, string Password);


        bool CheckExpiryDate();


    }
}





















