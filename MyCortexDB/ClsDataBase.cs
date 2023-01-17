using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Collections;
using System.Data;
using System.Xml;
using System.Data.Common;

namespace MyCortexDB
{
    public class ClsDataBase
    {
        #region Variable Declaration        
        private static SqlConnection connection;
        private SqlDataAdapter adp;
        private DataSet ds = new DataSet();
        private SqlCommand cmd;
        private static readonly string dataProvider = "System.Data.SqlClient"; //ConfigurationManager.AppSettings.Get("DataProvider");
        private static readonly DbProviderFactory factory = DbProviderFactories.GetFactory(dataProvider);
        #endregion

        #region Constructer
        //Default Constructer
        public ClsDataBase()
        {
            connection = new SqlConnection(ClsDataBase.GetConnectionString());

        }
        #endregion


        /// Populates a DataSet according to a stored procedure.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Populated DataSet.</returns>
        //public static DataSet GetDataSet(string storedProcedureName, IList<DataParameter> parameters)
        //{
        //    SqlCommand command = new SqlCommand();
        //    command.Connection = connection;
        //    command.CommandType = CommandType.StoredProcedure;
        //    command.CommandText = storedProcedureName;
        //    foreach (DataParameter parameter in parameters)
        //    {
        //        DbParameter dbparameter = command.CreateParameter();
        //        dbparameter.ParameterName = parameter.ParameterName;
        //        dbparameter.Value = parameter.Value;

        //        command.Parameters.Add(dbparameter);
        //    }

        //    using (DbDataAdapter adapter = factory.CreateDataAdapter())
        //    {
        //        adapter.SelectCommand = command;
        //        DataSet ds = new DataSet();
        //        adapter.Fill(ds);
        //        return ds;
        //    }
        //}

        /// <summary>
        /// Populates a DataTable according to a given stored procedure
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Populated DataTable.</returns>
        //public static DataTable GetDataTable(string storedProcedureName, IList<DataParameter> parameters)
        //{
        //    return GetDataSet(storedProcedureName, parameters).Tables[0];
        //}
        /// <summary>
        /// Populates a DataTable according to a given stored procedure
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <returns>Populated DataTable.</returns>
        //public static DataTable GetDataTable(string storedProcedureName)
        //{
        //    return GetDataSet(storedProcedureName, new List<DataParameter>()).Tables[0];
        //}

        /// <summary>
        /// Executes Update stored procedure in the database.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Number of rows affected.</returns>
        public static void Save(string storedProcedureName, IList<DataParameter> parameters)
        {
            SqlCommand command = new SqlCommand();
            command.Connection = connection;
            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = storedProcedureName;
            foreach (DataParameter parameter in parameters)
            {
                DbParameter dbparameter = command.CreateParameter();
                dbparameter.ParameterName = parameter.ParameterName;
                dbparameter.Value = parameter.Value;

                command.Parameters.Add(dbparameter);
            }

            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();
        }

        //New


        #region Data Update handlers

        /// <summary>
        /// Executes Update stored procedure in the database.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Number of rows affected.</returns>
        public static int Update(string storedProcedureName, IList<DataParameter> parameters)
        {

            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    foreach (DataParameter parameter in parameters)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = parameter.ParameterName;
                        dbparameter.Value = parameter.Value;

                        command.Parameters.Add(dbparameter);
                    }

                    connection.Open();
                    return command.ExecuteNonQuery();
                }
            }
        }
        /// <summary>
        /// Executes Update status stored procedure in the database.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <param name="userId">User Id required to create temp #USER_ID table for different uses such as tally posting </param>
        /// <returns>Number of rows affected.</returns>
        public static int Update(string storedProcedureName, IList<DataParameter> parameters, int userId)
        {
            int noOfRowsAffected = 0;
            using (DbConnection connection = factory.CreateConnection())
            {

                connection.ConnectionString = ClsDataBase.GetConnectionString();
                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    foreach (DataParameter parameter in parameters)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = parameter.ParameterName;
                        dbparameter.Value = parameter.Value;

                        command.Parameters.Add(dbparameter);
                    }
                    connection.Open();
                    noOfRowsAffected = command.ExecuteNonQuery();
                }

                return noOfRowsAffected;
            }
        }
        /// <summary>
        /// Executes Batch Update stored procedure  in the database.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <param name="dtInsertRows">Data table filled with records to be inserted.</param>
        /// <returns>Total no. of records affected.</returns>
        public static DataTable UpdateBatch(string storedProcedureName, IList<DataParameter> parameters,
            DataTable dtExistingRows)
        {
            DataTable conflictRows;
            int recordsAffected = 0;

            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();
                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    command.UpdatedRowSource = UpdateRowSource.None;

                    foreach (DataParameter parameter in parameters)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = parameter.ParameterName;
                        dbparameter.DbType = parameter.DbType;
                        dbparameter.Size = parameter.Size;
                        dbparameter.SourceColumn = parameter.SourceColumn;

                        command.Parameters.Add(dbparameter);
                    }
                    using (DbDataAdapter adapter = factory.CreateDataAdapter())
                    {
                        adapter.InsertCommand = command;
                        adapter.UpdateBatchSize = dtExistingRows.Rows.Count;
                        connection.Open();
                        recordsAffected = adapter.Update(dtExistingRows);
                    }
                }
            }

            return new DataTable();
        }
        /// <summary>
        /// Executes Insert stored procedure  in the database. Optionally returns new identifier.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <param name="getId">Value indicating whether newly generated identity is returned.</param>
        /// <returns>Newly generated identity value (autonumber value).</returns>
        public static int Insert(string storedProcedureName, IList<DataParameter> parameters, bool getId)
        {
            int id = -1;

            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    foreach (DataParameter parameter in parameters)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = parameter.ParameterName;
                        dbparameter.Value = parameter.Value;

                        command.Parameters.Add(dbparameter);
                    }
                    // Check if new identity is needed.
                    if (getId)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = "@Identity";
                        dbparameter.Direction = ParameterDirection.ReturnValue;
                        command.Parameters.Add(dbparameter);
                    }

                    connection.Open();
                    command.ExecuteNonQuery();

                    if (getId)
                        id = int.Parse(command.Parameters[command.Parameters.Count - 1].Value.ToString());
                }

            }

            return id;
        }
        /// <summary>
        /// Executes Insert stored procedure  in the database. 
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        public static void Insert(string storedProcedureName, IList<DataParameter> parameters)
        {
            Insert(storedProcedureName, parameters, false);
        }

        #endregion

        #region Data Retrieve Handlers

        /// <summary>
        /// Populates a DataSet according to a stored procedure.
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Populated DataSet.</returns>
        public static DataSet GetDataSet(string storedProcedureName, IList<DataParameter> parameters)
        {
            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    command.CommandTimeout = 0;
                    foreach (DataParameter parameter in parameters)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = parameter.ParameterName;
                        dbparameter.Value = parameter.Value;

                        command.Parameters.Add(dbparameter);
                    }

                    using (DbDataAdapter adapter = factory.CreateDataAdapter())
                    {
                        adapter.SelectCommand = command;

                        DataSet ds = new DataSet();
                        adapter.Fill(ds);

                        return ds;
                    }
                }
            }
        }
        /// <summary>
        /// Populates a DataTable according to a given stored procedure
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Populated DataTable.</returns>
        public static DataTable GetDataTable(string storedProcedureName, IList<DataParameter> parameters)
        {
            return GetDataSet(storedProcedureName, parameters).Tables[0];
        }
        /// <summary>
        /// Populates a DataTable according to a given stored procedure
        /// </summary>
        /// <param name="storedProcedureName">Stored procedure name.</param>
        /// <returns>Populated DataTable.</returns>
        public static DataTable GetDataTable(string storedProcedureName)
        {
            return GetDataSet(storedProcedureName, new List<DataParameter>()).Tables[0];
        }


        /// <summary>
        /// Populates a DataRow according to a given stored procedure
        /// </summary>
        /// <param name="spName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Populated DataTable.</returns>
        public static DataRow GetDataRow(string storedProcedureName, IList<DataParameter> parameters)
        {
            DataRow row = null;

            DataTable dt = GetDataTable(storedProcedureName, parameters);
            if (dt.Rows.Count > 0)
            {
                row = dt.Rows[0];
            }

            return row;
        }

        /// <summary>
        /// Executes a Sql statement and returns a scalar value.
        /// </summary>
        /// <param name="spName">Stored procedure name.</param>
        /// <param name="parameters">List of parameters of type DataParameter.</param>
        /// <returns>Scalar value.</returns>
        public static object GetScalar(string storedProcedureName, IList<DataParameter> parameters)
        {
            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    foreach (DataParameter parameter in parameters)
                    {
                        DbParameter dbparameter = command.CreateParameter();
                        dbparameter.ParameterName = parameter.ParameterName;
                        dbparameter.Value = parameter.Value;

                        command.Parameters.Add(dbparameter);
                    }

                    connection.Open();
                    return command.ExecuteScalar();
                }
            }
        }

        public static object GetScalar(string storedProcedureName)
        {
            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = storedProcedureName;
                    connection.Open();
                    return command.ExecuteScalar();
                }
            }
        }
        #endregion

        #region Utility methods
        /// <summary>
        /// Escapes an input string for database processing, that is, 
        /// surround it with quotes and change any quote in the string to 
        /// two adjacent quotes (i.e. escape it). 
        /// If input string is null or empty a NULL string is returned.
        /// </summary>
        /// <param name="s">Input string.</param>
        /// <returns>Escaped output string.</returns>
        public static string Escape(string s)
        {
            if (String.IsNullOrEmpty(s))
                return "NULL";
            else
                return "'" + s.Trim().Replace("'", "''") + "'";
        }

        /// <summary>
        /// Escapes an input string for database processing, that is, 
        /// surround it with quotes and change any quote in the string to 
        /// two adjacent quotes (i.e. escape it). 
        /// Also trims string at a given maximum length.
        /// If input string is null or empty a NULL string is returned.
        /// </summary>
        /// <param name="s">Input string.</param>
        /// <param name="maxLength">Maximum length of output string.</param>
        /// <returns>Escaped output string.</returns>
        public static string Escape(string s, int maxLength)
        {
            if (String.IsNullOrEmpty(s))
                return "NULL";
            else
            {
                s = s.Trim();
                if (s.Length > maxLength) s = s.Substring(0, maxLength - 1);
                return "'" + s.Trim().Replace("'", "''") + "'";
            }
        }
        /// <summary>
        /// Gets the Connection string either from mapped xml file or Windows Registry. 
        /// </summary>
        /// <returns></returns>
        private static string GetConnectionString()
        {

            //return System.Configuration.ConfigurationManager.ConnectionStrings["Connection"].ToString();
            //return DBConnectionStringBuilder.ConnectionString;
            return "server=SQL5080.site4now.net;database=DB_A66DEE_mycortexdemo;uid=DB_A66DEE_mycortexdemo_admin;password=vjh@0304;";
        }
        #endregion

        /// <summary>
        /// Executes Update statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <returns>Number of rows affected.</returns>
        public static int Update(string sql)
        {
            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandText = sql;

                    connection.Open();
                    return command.ExecuteNonQuery();
                }
            }
        }
        /// <summary>
        /// Executes Insert statements in the database. Optionally returns new identifier.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <param name="getId">Value indicating whether newly generated identity is returned.</param>
        /// <returns>Newly generated identity value (autonumber value).</returns>
        public static int Insert(string sql, bool getId)
        {

            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandText = sql;

                    connection.Open();
                    command.ExecuteNonQuery();

                    int id = -1;

                    // Check if new identity is needed.
                    if (getId)
                    {
                        // Execute db specific autonumber or identity retrieval code
                        // SELECT SCOPE_IDENTITY() -- for SQL Server
                        // SELECT @@IDENTITY -- for MS Access
                        // SELECT MySequence.NEXTVAL FROM DUAL -- for Oracle
                        string identitySelect;
                        switch (dataProvider)
                        {
                            // Access
                            case "System.Data.OleDb":
                                identitySelect = "SELECT @@IDENTITY";
                                break;
                            // Sql Server
                            case "System.Data.SqlClient":
                                identitySelect = "SELECT SCOPE_IDENTITY()";
                                break;
                            // Oracle
                            case "System.Data.OracleClient":
                                identitySelect = "SELECT MySequence.NEXTVAL FROM DUAL";
                                break;
                            default:
                                identitySelect = "SELECT @@IDENTITY";
                                break;
                        }
                        command.CommandText = identitySelect;
                        id = int.Parse(command.ExecuteScalar().ToString());
                    }
                    return id;
                }
            }
        }

        /// <summary>
        /// Executes Insert statements in the database.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        public static void Insert(string sql)
        {
            Insert(sql, false);
        }
        /// <summary>
        /// Populates a DataSet according to a Sql statement.
        /// </summary>
        /// <param name="sql">Sql statement.</param>
        /// <returns>Populated DataSet.</returns>
        public static DataSet GetDataSet(string sql)
        {
            using (DbConnection connection = factory.CreateConnection())
            {
                connection.ConnectionString = ClsDataBase.GetConnectionString();

                using (DbCommand command = factory.CreateCommand())
                {
                    command.Connection = connection;
                    command.CommandType = CommandType.Text;
                    command.CommandText = sql;

                    using (DbDataAdapter adapter = factory.CreateDataAdapter())
                    {
                        adapter.SelectCommand = command;

                        DataSet ds = new DataSet();
                        adapter.Fill(ds);

                        return ds;
                    }
                }
            }
        }

        public static bool checkConnection()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(ClsDataBase.GetConnectionString()))
                {
                    if (conn.Database == "")
                        throw new Exception("Invalid DB connection");
                    conn.Open();
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }


    }
}
