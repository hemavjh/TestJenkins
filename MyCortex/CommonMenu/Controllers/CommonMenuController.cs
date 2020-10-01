﻿using MyCortex.CommonMenu.Models;
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
using log4net;

namespace MyCortex.CommonMenu.Controllers
{
    public class CommonMenuController : ApiController
    {
        static readonly ICommonMenuRepository repository = new CommonMenuRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// menu list based on user login
        /// </summary>
        /// <param name="Id">user id</param>
        /// <returns>menu list with page URL</returns>
        [HttpGet]
        public IList<CommonMenuModel> CommonMenu_Listall(long Id)
        {
            IList<CommonMenuModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.CommonMenu_Listall(Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

    }
}