/**
 * SQL database wrapper
 */

'use strict'
const sql = require('./lib/sql')
const util = require('./lib/util')
const forEach = require('async-foreach').forEach

/**
 * Sql database wrapper class
 */
const NodeSqlite3 = function (props) {
  if (!(this instanceof NodeSqlite3)) {
    throw new Error('NodeSqlite3 is a class')
  }
  if (!(props && props.constructor === {}.constructor)) {
    throw new Error(`Database "path" and "name" is required.`)
  }
  this.config = props
  this.db = null
}

/**
 * Initialize SQL database
 * Creates/ensures necessary tables for SQL database
 */
NodeSqlite3.prototype.init = function (schema) {
  return new Promise((resolve, reject) => {

    if (!(schema && schema.constructor === [].constructor)) {
      reject(new Error('Invalid database schema. Schema should be an Array.'))
    }

    const context = this

    if (!(schema && schema.constructor === [].constructor)) {
      reject(new Error('Database schema is required.'))
    }

    // Resolve absolute database path
    sql.ensureDatabaseDir(this.config)
  
    // Ensure database is created
    sql.ensureDb(context.config, function (err, db) {
      if (err) {
        // Unable to create database
        reject(err)
      } else {
        // Set database context for handler
        context.db = db

        context.db.serialize(() => {
          // Create required SQL tables
          forEach(schema, function (table) {
            const asyncDone = this.async()
            if (
              table && table.constructor === {}.constructor &&
              'name' in table && table.name && typeof table.name === 'string' &&
              'columns' in table && table.columns && table.columns.constructor === [].constructor
            ) {
              // Generate SQL table definition
              const tableData = util.getTableDataFromTable(table)

              if (tableData.withTypes.length > 0) {
                // Remove duplicate schema
                const schema = [...new Set(tableData.withTypes)].join(', ')
                // Try to create table
                // Create/update table with schema
                context.db.run(
                  `CREATE TABLE ${table.name}(
                    ${schema}
                  )`,
                  (error) => {
                    if (error) {
                      // Table already exists
                      // Update columns if any
                      const columns = [... new Set(tableData.withOnlyNames)]

                      // Update table with columns
                      util.updateTable({
                        database: context.db, // Database handle
                        table, // Table
                        columns, // Column names
                        schema // Column schema
                      }).then(() => {
                        asyncDone()
                        // Done
                      }).catch((err) => {
                        asyncDone()
                      })

                    } else {
                      asyncDone()
                    }
                  }
                )
              } else {
                // keys are empty
                asyncDone()
              }
            } else {
              asyncDone()
            }
          }, function () {
            resolve()
          })
        })
      }
    })
  })
}

/**
 * SQL Database commands API
 */
NodeSqlite3.prototype.getHandle = sql.getHandle
NodeSqlite3.prototype.readFullTable = sql.readFullTable
NodeSqlite3.prototype.updateTableByValue = sql.updateTableByValue
NodeSqlite3.prototype.writeTable = sql.writeTable
NodeSqlite3.prototype.deleteRowByValue = sql.deleteRowByValue
NodeSqlite3.prototype.clearFullTable = sql.clearFullTable
NodeSqlite3.prototype.readRowByValue = sql.readRowByValue

module.exports = NodeSqlite3
