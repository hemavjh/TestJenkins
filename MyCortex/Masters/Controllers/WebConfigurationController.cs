using log4net;
using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MyCortex.Repositories.Masters;
using MyCortex.Masters.Models;

namespace MyCortex.Masters.Controllers
{

    [Authorize]
    public class WebConfigurationController : ApiController
    {
        static readonly IWebConfigurationRepository repository = new WebConfigurationRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);


        /// <summary>      
        /// Settings  --> AppoinmentSlot details (menu) -- > List Page (result)
        /// to get the list of AppoinmentSlot for the specified filters
        /// Id
        /// </summary>      
        /// <param name="Id">Id of a IsActive</param>        
        /// <returns>Populated List of AppoinmentSlot list Details DataTable</returns>
        [HttpGet]
        public IList<WebConfigurationModel> WebConfiguration_List(int? IsActive)
        {
            IList<WebConfigurationModel> model;
            try
            {
                model = repository.WebConfiguration_List(IsActive);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


    }

}