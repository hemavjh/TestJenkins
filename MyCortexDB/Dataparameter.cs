using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.Common;
using System.ComponentModel;

namespace MyCortexDB
{
    public sealed class DataParameter : DbParameter, IDbDataParameter, IDataParameter
    {

        private DbType _dbType;
        private ParameterDirection _parameterDirection;
        private string _parameterName = String.Empty;
        private string _sourceColumn = String.Empty;
        private DataRowVersion _sourceVersion;
        private object _value = null;
        private byte _precision = 0;
        private byte _scale = 0;
        private int _size = 0;
        private int _offSet = 0;
        private int _localeId = 0;
        private bool _isNullable = false;
        private bool _sourceColumnNullMapping = false;
        private string _xmlSchemaCollectionDatabase = string.Empty;
        private string _xmlSchemaCollectionOwningSchema = string.Empty;
        private string _xmlSchemaCollectionName = string.Empty;

        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class.
        public DataParameter() { }
        //
        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class
        //     that uses the parameter name and a value of the new System.Data.SqlClient.SqlParameter.
        //
        // Parameters:
        //   parameterName:
        //     The name of the parameter to map.
        //
        //   value:
        //     An System.Object that is the value of the System.Data.SqlClient.SqlParameter.
        public DataParameter(string parameterName, object value)
        {
            _parameterName = parameterName;
            _value = value;
        }
        //
        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class
        //     that uses the parameter name and the data type.
        //
        // Parameters:
        //   parameterName:
        //     The name of the parameter to map.
        //
        //   dbType:
        //     One of the System.Data.SqlDbType values.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The value supplied in the dbType parameter is an invalid back-end data type.
        public DataParameter(string parameterName, DbType dbType)
        {
            _parameterName = parameterName;
            _dbType = dbType;
        }
        //
        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class
        //     that uses the parameter name, the System.Data.SqlDbType, and the size.
        //
        // Parameters:
        //   parameterName:
        //     The name of the parameter to map.
        //
        //   dbType:
        //     One of the System.Data.SqlDbType values.
        //
        //   size:
        //     The length of the parameter.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The value supplied in the dbType parameter is an invalid back-end data type.
        public DataParameter(string parameterName, DbType dbType, int size)
        {
            _parameterName = parameterName;
            _dbType = dbType;
            _size = size;
        }
        //
        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class
        //     that uses the parameter name, the System.Data.SqlDbType, the size, and the
        //     source column name.
        //
        // Parameters:
        //   parameterName:
        //     The name of the parameter to map.
        //
        //   dbType:
        //     One of the System.Data.SqlDbType values.
        //
        //   size:
        //     The length of the parameter.
        //
        //   sourceColumn:
        //     The name of the source column.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The value supplied in the dbType parameter is an invalid back-end data type.
        public DataParameter(string parameterName, DbType dbType, int size, string sourceColumn)
        {
            _parameterName = parameterName;
            _dbType = dbType;
            _size = size;
            _sourceColumn = sourceColumn;
        }
        //
        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class
        //     that uses the parameter name, the type of the parameter, the size of the
        //     parameter, a System.Data.ParameterDirection, the precision of the parameter,
        //     the scale of the parameter, the source column, a System.Data.DataRowVersion
        //     to use, and the value of the parameter.
        //
        // Parameters:
        //   parameterName:
        //     The name of the parameter to map.
        //
        //   dbType:
        //     One of the System.Data.SqlDbType values.
        //
        //   size:
        //     The length of the parameter.
        //
        //   direction:
        //     One of the System.Data.ParameterDirection values.
        //
        //   isNullable:
        //     true if the value of the field can be null; otherwise false.
        //
        //   precision:
        //     The total number of digits to the left and right of the decimal point to
        //     which System.Data.SqlClient.SqlParameter.Value is resolved.
        //
        //   scale:
        //     The total number of decimal places to which System.Data.SqlClient.SqlParameter.Value
        //     is resolved.
        //
        //   sourceColumn:
        //     The name of the source column.
        //
        //   sourceVersion:
        //     One of the System.Data.DataRowVersion values.
        //
        //   value:
        //     An System.Object that is the value of the System.Data.SqlClient.SqlParameter.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The value supplied in the dbType parameter is an invalid back-end data type.
        public DataParameter(string parameterName, SqlDbType dbType, int size, ParameterDirection direction, bool isNullable, byte precision, byte scale, string sourceColumn, DataRowVersion sourceVersion, object value)
        {
            _parameterName = parameterName;
            _parameterDirection = direction;
            _isNullable = IsNullable;
            _precision = precision;
            _scale = scale;
            _sourceColumn = sourceColumn;
            _sourceVersion = sourceVersion;
            _value = value;
        }
        //
        // Summary:
        //     Initializes a new instance of the System.Data.SqlClient.SqlParameter class
        //     that uses the parameter name, the type of the parameter, the length of the
        //     parameter the direction, the precision, the scale, the name of the source
        //     column, one of the System.Data.DataRowVersion values, a Boolean for source
        //     column mapping, the value of the SqlParameter, the name of the database where
        //     the schema collection for this XML instance is located, the owning relational
        //     schema where the schema collection for this XML instance is located, and
        //     the name of the schema collection for this parameter.
        //
        // Parameters:
        //   parameterName:
        //     The name of the parameter to map.
        //
        //   dbType:
        //     One of the System.Data.SqlDbType values.
        //
        //   size:
        //     The length of the parameter.
        //
        //   direction:
        //     One of the System.Data.ParameterDirection values.
        //
        //   precision:
        //     The total number of digits to the left and right of the decimal point to
        //     which System.Data.SqlClient.SqlParameter.Value is resolved.
        //
        //   scale:
        //     The total number of decimal places to which System.Data.SqlClient.SqlParameter.Value
        //     is resolved.
        //
        //   sourceColumn:
        //     The name of the source column.
        //
        //   sourceVersion:
        //     One of the System.Data.DataRowVersion values.
        //
        //   sourceColumnNullMapping:
        //     true if the source column is nullable; false if it is not.
        //
        //   value:
        //     An System.Object that is the value of the System.Data.SqlClient.SqlParameter.
        //
        //   xmlSchemaCollectionDatabase:
        //     The name of the database where the schema collection for this XML instance
        //     is located.
        //
        //   xmlSchemaCollectionOwningSchema:
        //     The owning relational schema where the schema collection for this XML instance
        //     is located.
        //
        //   xmlSchemaCollectionName:
        //     The name of the schema collection for this parameter.
        public DataParameter(string parameterName, DbType dbType, int size, ParameterDirection direction, byte precision, byte scale,
            string sourceColumn, DataRowVersion sourceVersion, bool sourceColumnNullMapping, object value,
            string xmlSchemaCollectionDatabase, string xmlSchemaCollectionOwningSchema, string xmlSchemaCollectionName)
        {
            _parameterName = parameterName;
            _dbType = dbType;
            _parameterDirection = direction;
            _precision = precision;
            _scale = scale;
            _sourceColumn = sourceColumn;
            _sourceVersion = sourceVersion;
            _sourceColumnNullMapping = sourceColumnNullMapping;
            _value = value;
            _xmlSchemaCollectionDatabase = xmlSchemaCollectionDatabase;
            _xmlSchemaCollectionOwningSchema = xmlSchemaCollectionOwningSchema;
            _xmlSchemaCollectionName = xmlSchemaCollectionName;

        }
        //
        // Summary:
        //     Gets a string that contains the System.Data.SqlClient.SqlParameter.ParameterName.
        //
        // Returns:
        //     A string that contains the System.Data.Parameter.ParameterName.
        public override string ToString()
        {
            return this.ParameterName;
        }

        //
        // Summary:
        //     Gets or sets the name of the System.Data.IDataParameter.
        //
        // Returns:
        //     The name of the System.Data.IDataParameter. The default is an empty string.
        public override string ParameterName
        {
            get { return _parameterName; }
            set { _parameterName = value; }
        }

        //
        // Summary:
        //     Gets or sets the locale identifier that determines conventions and language
        //     for a particular region.
        //
        // Returns:
        //     Returns the locale identifier associated with the parameter
        public int LocaleId
        {
            get { return _localeId; }
            set { _localeId = value; }
        }
        //
        // Summary:
        //     Gets or sets the offset to the System.Data.SqlClient.SqlParameter.Value property.
        //
        // Returns:
        //     The offset to the System.Data.SqlClient.SqlParameter.Value. The default is
        //     0.
        public int Offset
        {
            get { return _offSet; }
            set { _offSet = value; }
        }
        //
        // Summary:
        //     Gets or sets the name of the System.Data.SqlClient.SqlParameter.
        //
        // Returns:
        //     The name of the System.Data.SqlClient.SqlParameter. The default is an empty
        //     string.
        // Summary:
        //     Gets or sets the System.Data.DbType of the parameter.
        //
        // Returns:
        //     One of the System.Data.DbType values. The default is System.Data.DbType.String.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The property was not set to a valid System.Data.DbType.
        public override DbType DbType
        {
            get { return _dbType; }
            set { _dbType = value; }
        }
        //
        // Summary:
        //     Gets or sets a value indicating whether the parameter is input-only, output-only,
        //     bidirectional, or a stored procedure return value parameter.
        //
        // Returns:
        //     One of the System.Data.ParameterDirection values. The default is Input.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The property was not set to one of the valid System.Data.ParameterDirection
        //     values.
        public override ParameterDirection Direction
        {
            get { return _parameterDirection; }
            set { _parameterDirection = value; }
        }
        //
        // Summary:
        //     Gets a value indicating whether the parameter accepts null values.
        //
        // Returns:
        //     true if null values are accepted; otherwise, false. The default is false.
        public override bool IsNullable
        {
            get { return _isNullable; }
            set { _isNullable = value; }
        }
        //
        // Summary:
        //     Gets or sets the name of the source column that is mapped to the System.Data.DataSet
        //     and used for loading or returning the System.Data.IDataParameter.Value.
        //
        // Returns:
        //     The name of the source column that is mapped to the System.Data.DataSet.
        //     The default is an empty string.
        public override string SourceColumn
        {
            get { return _sourceColumn; }
            set { _sourceColumn = value; }
        }
        //
        // Summary:
        //     Sets or gets a value which indicates whether the source column is nullable.
        //     This allows System.Data.SqlClient.SqlCommandBuilder to correctly generate
        //     Update statements for nullable columns.
        //
        // Returns:
        //     true if the source column is nullable; false if it is not.
        public override bool SourceColumnNullMapping
        {
            get { return _sourceColumnNullMapping; }
            set { _sourceColumnNullMapping = value; }
        }
        //
        // Summary:
        //     Gets or sets the System.Data.DataRowVersion to use when loading System.Data.IDataParameter.Value.
        //
        // Returns:
        //     One of the System.Data.DataRowVersion values. The default is Current.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The property was not set one of the System.Data.DataRowVersion values.
        public override DataRowVersion SourceVersion
        {
            get { return _sourceVersion; }
            set { _sourceVersion = value; }
        }
        //
        // Summary:
        //     Gets or sets the value of the parameter.
        //
        // Returns:
        //     An System.Object that is the value of the parameter. The default value is
        //     null.
        [TypeConverter(typeof(StringConverter))]
        public override object Value
        {
            get { return _value; }
            set { _value = value; }
        }

        // Summary:
        //     Indicates the precision of numeric parameters.
        //
        // Returns:
        //     The maximum number of digits used to represent the Value property of a data
        //     provider Parameter object. The default value is 0, which indicates that a
        //     data provider sets the precision for Value.
        public byte Precision
        {
            get { return _precision; }
            set { _precision = value; }
        }

        //
        // Summary:
        //     Indicates the scale of numeric parameters.
        //
        // Returns:
        //     The number of decimal places to which System.Data.OleDb.OleDbParameter.Value
        //     is resolved. The default is 0.
        public byte Scale
        {
            get { return _scale; }
            set { _scale = value; }
        }

        //
        // Summary:
        //     The size of the parameter.
        //
        // Returns:
        //     The maximum size, in bytes, of the data within the column. The default value
        //     is inferred from the the parameter value.
        public override int Size
        {
            get { return _size; }
            set { _size = value; }
        }
        // Summary:
        //     Gets the name of the database where the schema collection for this XML instance
        //     is located.
        //
        // Returns:
        //     The name of the database where the schema collection for this XML instance
        //     is located.
        public string XmlSchemaCollectionDatabase
        {
            get { return _xmlSchemaCollectionDatabase; }
            set { _xmlSchemaCollectionDatabase = value; }
        }
        //
        // Summary:
        //     Gets the name of the schema collection for this XML instance.
        //
        // Returns:
        //     The name of the schema collection for this XML instance.
        public string XmlSchemaCollectionName
        {
            get { return _xmlSchemaCollectionOwningSchema; }
            set { _xmlSchemaCollectionOwningSchema = value; }
        }
        //
        // Summary:
        //     The owning relational schema where the schema collection for this XML instance
        //     is located.
        //
        // Returns:
        //     An System.Data.SqlClient.SqlParameter.XmlSchemaCollectionOwningSchema.
        public string XmlSchemaCollectionOwningSchema
        {
            get { return _xmlSchemaCollectionName; }
            set { _xmlSchemaCollectionName = value; }
        }
        // Summary:
        //     Resets the DbType property to its original settings.
        public override void ResetDbType()
        {

        }
    }
}
