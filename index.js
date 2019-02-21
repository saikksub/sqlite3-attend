/**
 * SQL database wrapper
 */

'use strict'
const sql = require('./lib/sql')
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
      reject(new Error('Database schema is required.'))
    }
    const context = this
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
            // Check table name is valid
            if (table.name && typeof table.name === 'string') {
              const columnNameType = [] // Stores column and its type
              const columnName = [] // Stores ONLY name of columns
              if (table.keys.constructor === [].constructor) {
                table.keys.forEach((key) => {
                  if (key && key.name && key.type) {
                    columnNameType.push(`${key.name} ${key.type}`)
                    columnName.push(`${key.name}`)
                  }
                })
              }
              if (columnNameType.length > 0) {
                // Remove duplicate schema
                const schema = [...new Set(columnNameType)].join(', ')
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
                      const columns = [... new Set(columnName)]
                      // Update table with columns
                      updateTable({
                        database: context.db, // Database handle
                        table, // Table
                        columns, // Column names
                        schema // Column schema
                      }).then(() => {
                        asyncDone()
                        // Done
                      }).catch((err) => {
                        console.log(err)
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
 * Update table with columns
 * This will add new column, if not exits
 */
function updateTable ({ database, table, columns, schema }) {
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

/**
 * SQL Database commands API
 */
NodeSqlite3.prototype.readFullTable = sql.readFullTable
NodeSqlite3.prototype.readTableEntryID = sql.readTableByID
NodeSqlite3.prototype.writeTable = sql.writeTable
NodeSqlite3.prototype.updateTableByID = sql.updateTableByID
NodeSqlite3.prototype.deleteTableById = sql.deleteTableById

module.exports = NodeSqlite3
