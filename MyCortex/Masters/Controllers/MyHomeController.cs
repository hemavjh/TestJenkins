using MyCortex.Admin.Models;
using MyCortex.Repositories;
using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Web.Http;
using Newtonsoft.Json;
using MyCortex.Masters.Models;
using MyCortex.Repositories.Masters;
using MyCortex.Provider;

namespace MyCortex.User.Controllers
{
    // [Authorize]
    [CheckSessionOutFilter]
    public class MyHomeController : ApiController
    {
        static readonly IMyHomeRepository repository = new MyHomeRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [HttpGet]
        public IList<TabListModel> Tab_List(int? IsActive, long Institution_Id, Guid Login_Session_Id)
        {
            IList<TabListModel> model;
            try
            {
                model = repository.Tab_List(IsActive, Institution_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
    