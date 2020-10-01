using System.Web.Mvc;

namespace MyCortex
{
    public class CustomRazorViewEngine:RazorViewEngine
    {
        public CustomRazorViewEngine()
        {
            ViewLocationFormats = new string[]
            {
            "~/{1}/Views/{0}.cshtml",
            };

            PartialViewLocationFormats = new string[]
            {
            "~/{1}/Views/{0}.cshtml"
            };
        }
    }
}