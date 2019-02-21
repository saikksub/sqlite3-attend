'use strict'

const sqlite3 = require('sqlite3')
const path = require('path')
const fsExtra = require('fs-extra')
const forEach = require('async-foreach').forEach

function validateConfig (object) {
  return Boolean(
    object && object.constructor === {}.constructor &&
    'name' in object && 'data' in object &&
    object.data.constructor === [].constructor &&
    object.name && typeof object.name === 'string'
  )
}

function validateDataObject (object) {
  return Boolean(
    object && object.constructor === {}.constructor &&
    'key' in object && 'value' in object &&
    typeof object.key === 'string'
  )
}

module.exports = {
  /**
   * Ensures directory is ready for SQL database
   */
  ensureDatabaseDir: function (config) {
    fsExtra.ensureDirSync(config.path)
  },
  /**
   * Ensures SQL database is created
   */
  ensureDb: function (config, callback) {
    const dbFile = path.join(
      config.path,
      config.name && config.name.split('.').length < 2
        ? `${config.name}.db`
        : `${config.name.split('.')[0]}.db`
    )
    const db = new sqlite3.Database(
      dbFile,
      function (err) {
        if (err) {
          callback(err)
        } else {
          callback(null, db)
        }
      }
    )
  },

  /**
   * Read entire rows of specified table
   */
  readFullTable: function (tableName) {
    return new Promise((resolve, reject) => {
      const context = this
      context.db.serialize(function () {
        context.db.all(
          `SELECT * FROM ${tableName}`,
          function (error, rows) {
            if (error) {
              reject(error)
            } else {
              resolve(rows)
            }
          }
        )
      })
    })
  },

  /**
   * Read table with entry/row id
   */
  readTableByID: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.all(
        `SELECT row FROM ${data.table} WHERE id=${data.id}`,
        function (error, row) {
          if (error) {
            callback(error)
          } else {
            callback(null, row)
          }
        }
      )
    })
  },

  /**
   * Write a new entry/row of specified table
   */
  writeTable: function (object) {
    return new Promise((resolve, reject) => {
      const self = this
      if (!validateConfig(object)) {
        reject(new Error('Invalid helper object'))
      }

      forEach(
        object.data,
        function (dataObj) {
          const asyncDone = this.async()
          if (validateDataObject) {
            self.db.run(
              `INSERT INTO ${object.name} (${Object.keys(dataObj).join(', ')})
              VALUES (${Object.values(dataObj).map(value => { return `"${value}"` }).join(', ')})`,
              function (error) {
                if (error) {
                  reject(error)
                }
                asyncDone()
              }
            )
          } else {
            asyncDone()
          }
        },
        function () {
          resolve('done')
        }
      )
    })
    /* const values = data.values.replace(/ /g, '').split(',')
    const context = this
    context.db.serialize(function () {
      context.db.all(
        `SELECT * FROM ${data.table} WHERE key=${values[0]}`,
        function (error, rows) {
          if (error) {
            callback(error)
          } else {
            if (rows.length > 0) {
              context.db.run(
                `UPDATE ${data.table} SET value=${values[1]} WHERE key=${values[0]}`,
                function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log('updated')
                  }
                }
              )
            } else {
              context.db.run(
                `INSERT INTO ${data.table}(${data.keys}) VALUES(${data.values})`,
                function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log('updated')
                  }
                }
              )
            }
          }
        }
      )
    }) */
  },

  /**
   * Update table row of specified id
   */
  updateTableByID: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.run(
        `UPDATE INTO ${data.table} SET ${data.assignments}`,
        function (error) {
          if (error) {
            callback(error)
          } else {
            callback(null)
          }
        }
      )
    })
  },

  /**
   * Delete table row of specified id
   */
  deleteTableById: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.run(
        `DELETE FROM ${data.table} WHERE ${data.condition}`,
        function (error) {
          if (error) {
            callback(error)
          } else {
            callback(null)
          }
        }
      )
    })
  }
}
