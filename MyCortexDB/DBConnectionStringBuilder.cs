using System;
using Microsoft.Win32;
using System.Web;
using System.IO;
using log4net;

namespace MyCortexDB
{
    /// <remarks>
    /// This class tries to locate DATASTRING.INI which contains mapping between web site and 
    /// database connection string.
    /// </remarks> 
    public static class DBConnectionStringBuilder
    {
        private static string _ConnectionString ;
        private static readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Get the Connection string from reg.
        /// </summary>
        public static string ConnectionString
        {
            get
            {
                _ConnectionString = RegistryConnectionString();
                return _ConnectionString;
            }
            private set
            {
                _ConnectionString = value;
            }
        }

        private static string _ReportServerName;
        /// <summary>
        /// Get the Report Server Name string from reg.
        /// </summary>
        public static string ReportServerName
        {
            get
            {
                if (_ReportServerName == null)
                {
                    _ReportServerName = RegValue(Microsoft.Win32.RegistryHive.LocalMachine, "SOFTWARE\\EIP", "REPORTSERVER");
                }
                return _ReportServerName;
            }
            private set
            {
                _ReportServerName = value;
            }
        }



        /// <summary>
        /// Get the reg. value 
        /// </summary>
        /// <param name="Hive">Parent root path of the reg.</param>
        /// <param name="Key">Key path</param>
        /// <param name="ValueName">Value name to get the string from reg.</param>        
        /// <returns></returns>
        private static string RegValue(RegistryHive Hive, string Key, string ValueName)
        {
            RegistryKey objParent = null;
            RegistryKey objSubkey = null;

            string RegValue = "";
            if (Hive == RegistryHive.ClassesRoot)
                objParent = Registry.ClassesRoot;
            if (Hive == RegistryHive.CurrentConfig)
                objParent = Registry.CurrentConfig;
            if (Hive == RegistryHive.CurrentUser)
                objParent = Registry.CurrentUser;
            if (Hive == RegistryHive.DynData)
                objParent = Registry.DynData;
            if (Hive == RegistryHive.LocalMachine)
                objParent = Registry.LocalMachine;
            if (Hive == RegistryHive.PerformanceData)
                objParent = Registry.PerformanceData;
            if (Hive == RegistryHive.Users)
                objParent = Registry.Users;

            try
            {
                objSubkey = objParent.OpenSubKey(Key);
                
                //if can't be found, object is not initialized
                if (objSubkey != null)
                {
                    RegValue = (objSubkey.GetValue(ValueName)).ToString();
                    
                }
                //else
                //    throw new Exception(string.Format("Key {0} does not exist in Windows registry", Key));
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            finally
            {
                //if no error but value is empty, populate errinfo
                if (RegValue == "")
                {
                    //throw new Exception("No value found for requested registry key");
                }
            }
            return RegValue;
        }

        /// <summary>
        /// Gets the Connection string from Reg. 
        /// </summary>
        /// <returns></returns>
        private static string RegistryConnectionString()
        {
            String Connstr_FromINI = string.Empty;
            //Connstr_FromINI="Server=SQL5080.site4now.net;database=DB_A66DEE_mycortexdemo;uid=DB_A66DEE_mycortexdemo_admin;password=vjh@0304";
            Connstr_FromINI = Read_Ini_File();

            if (string.IsNullOrEmpty(Connstr_FromINI))
            {
                _logger.Error("Connection string empty", null);
                //    StringBuilder ConnectionStr = new StringBuilder();
                //    ConnectionStr.Append("server="
                //                    + RegValue(Microsoft.Win32.RegistryHive.LocalMachine, "SOFTWARE\\EIP", "DBSERVER"));
                //    ConnectionStr.Append(";uid="
                //                    + RegValue(Microsoft.Win32.RegistryHive.LocalMachine, "SOFTWARE\\EIP", "LOGIN"));
                //    ConnectionStr.Append(";pwd="
                //                    + RegValue(Microsoft.Win32.RegistryHive.LocalMachine, "SOFTWARE\\EIP", "PASSWORD"));
                //    ConnectionStr.Append(";database="
                //                    + RegValue(Microsoft.Win32.RegistryHive.LocalMachine, "SOFTWARE\\EIP", "DB"));
                ////ConnectionStr.Append(@"Server=SQL5080.site4now.net;database=DB_A66DEE_mycortexdemo;uid=DB_A66DEE_mycortexdemo_admin;password=vjh@0304");
                //    return ConnectionStr.ToString();
            }
            //else
            //    return Connstr_FromINI.ToString().Replace("Driver={SQL Server};", ""); ;

            return Connstr_FromINI.ToString();
        }

        public static string SetDBRegistryKey { get; set; }

        private static string GetDBRegistryKey()
        {

            string defaultDBRegistryKey = "SOFTWARE\\EIP";
            string dbRegistryKey = DBConnectionStringBuilder.SetDBRegistryKey;

            if (string.IsNullOrEmpty(dbRegistryKey))
            {
                dbRegistryKey = defaultDBRegistryKey;
            }


            return dbRegistryKey;
        }

        private static string Read_Ini_File()
        {
            //local variables
            string FilePath;
            string rDSN = string.Empty;
            
            if (System.Web.HttpContext.Current != null)
            {
                FilePath = System.Web.HttpContext.Current.Request.PhysicalApplicationPath;
                FilePath = FilePath + @"BIN\DATASTRING.INI";
            }
            else
            {
                FilePath = AppDomain.CurrentDomain.BaseDirectory + @"DATASTRING.INI";
            }

            //FilePath = FilePath.Replace(@"\MyCortex\", @"\BIN\DATASTRING.INI");
            // throw new Exception(FilePath);
            // Open the ini file
            FileInfo config_file = new FileInfo(FilePath);

            if (config_file.Exists)
            {

                // read configuration values
                using (StreamReader stream_reader = new StreamReader(config_file.FullName))
                {
                    //local variables
                    string section = "[]";
                    string line;
                    string ServerName;

                    // get server name to find the client 
                    if (System.Web.HttpContext.Current != null)
                    {
                        ServerName = System.Web.HttpContext.Current.Request.ServerVariables["SERVER_NAME"].ToUpper();
                    }
                    else
                    {
                        ServerName = "localhost";
                    }
                    ServerName = "[" + ServerName + "]";


                    // the file is reached.
                    while ((line = stream_reader.ReadLine()) != null)
                    {
                        // set the current section name
                        if (line.StartsWith("[") && line.EndsWith("]") && line != section)
                        {
                            section = line.ToUpper();
                        }
                        // read connection string in second iteration
                        if (section.ToUpper() == ServerName.ToUpper() && section != line.ToUpper())
                        {
                            rDSN = line.ToString().Replace("DSN=Provider=sqloledb;", "").Trim();
                            break;
                        }
                    }

                    if (string.IsNullOrEmpty(rDSN))
                    {
                        _logger.Info("ServerName" + ServerName);
                        _logger.Info("File Path: " + FilePath);
                    }
                }

            }
            
            return rDSN;
        }
    }
}


