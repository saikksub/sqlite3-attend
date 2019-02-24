
const forEach = require('async-foreach').forEach

module.exports = {
  getTableDataFromTable: function (table) {
    // Stores column and its type
    const withTypes = []
    // Stores ONLY name of columns
    const withOnlyNames = []
    if (table.keys.constructor === [].constructor) {
      table.keys.forEach((key) => {
        if (key && key.name && key.type) {
          withTypes.push(`${key.name} ${key.type}`)
          withOnlyNames.push(`${key.name}`)
        }
      })
    }
    return {
      withTypes,
      withOnlyNames
    }
  },
  /**
 * Update table with columns
 * This will add new column, if not exits
 */
updateTable: function ({ database, table, columns, schema }) {
  return new Promise((resolve, reject) => {
    // Iterate each individual columns
    forEach(columns, function (columnName, index) {
      const asyncDone = this.async()
      database.run(
        `SELECT ${columnName} FROM ${table.name}`,
        (err) => {
          if (err) {
            // Column does not exists
            // Create column
            database.run(
              `ALTER TABLE ${table.name} ADD ${schema.split(', ')[index]}`,
              (err) => {
                if (err) {
                  asyncDone()
                } else {
                  asyncDone()
                }
              }
            )
          } else {
            asyncDone()
          }
        }
      )
    }, function () {
      resolve()
    })
  })
}
}