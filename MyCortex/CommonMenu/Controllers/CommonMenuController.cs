using MyCortex.CommonMenu.Models;
using MyCortex.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.IO;
using MyCortex.Repositories.Menu;
  
using MyCortex.Provider;

namespace MyCortex.CommonMenu.Controllers
{
    [CheckSessionOutFilter]
    public class CommonMenuController : ApiController
    {
        static readonly ICommonMenuRepository repository = new CommonMenuRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        /// <summary>
        /// menu list based on user login
        /// </summary>
        /// <param name="Id">user id</param>
        /// <returns>menu list with page URL</returns>
        [HttpGet]
        public IList<CommonMenuModel> CommonMenu_Listall(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<CommonMenuModel> model;
            try
            {
                 

                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CommonMenu_Listall(Id);
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// Module list based on user login
        /// </summary>
        /// <param name="InsId">Institution Id</param>
        /// <returns>menu list with page URL</returns>
        [HttpGet]
        public IList<CommonModuleList> CommonModule_List(long InsId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<CommonModuleList> model;
            try
            {
                 

               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.CommonModule_List(InsId);
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

    }
}