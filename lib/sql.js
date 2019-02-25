'use strict'

const sqlite3 = require('sqlite3')
const path = require('path')
const fsExtra = require('fs-extra')
const forEach = require('async-foreach').forEach

function validateConfig (object) {
  return Boolean(
    object && object.constructor === {}.constructor &&
    'name' in object && object.name && 
    typeof object.name === 'string'
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
   * Get SQL Table Context
   */
  getHandle: function () {
    return this.db
  },

  /**
   * Read a full table
   */
  readFullTable: function (object) {
    return new Promise((resolve, reject) => {
      const self = this
      if (!validateConfig(object)) {
        reject(new Error('Invalid helper object'))
      }

      self.db.all(
        `SELECT * FROM ${object.name}`,
        (err, data) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
    })
  },

  /**
   * Read a full table
   */
  readRowByValue: function (object) {
    return new Promise((resolve, reject) => {
      const self = this
      if (!validateConfig(object)) {
        reject(new Error('Invalid helper object'))
      }

      if (!(
        'where' in object && object.where &&
        object.where.constructor === {}.constructor &&
        'key' in object.where && object.where.key &&
        'value' in object.where && object.where.value
      )) {
        // Invalid data
        reject(new Error('Invalid data object'))
      }

      self.db.all(
        `SELECT * FROM ${object.name}
        WHERE ${object.where.key} = "${object.where.value}"`,
        (err, data) => {
          if (err) {
            reject(err)
          }

          resolve(data)
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
      if (!('data' in object && object.data &&
        object.data.constructor === [].constructor)) {
        reject(new Error('Invalid data object'))
      }

      forEach(
        object.data,
        function (dataObj) {
          console.log(dataObj)
          const asyncDone = this.async()
          if (dataObj.constructor === {}.constructor) {
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
  },

  /**
   * Update table row of specified key, value
   */
  updateTableByValue: function (object) {
    return new Promise((resolve, reject) => {
      const self = this
      if (!validateConfig(object)) {
        reject(new Error('Invalid helper object'))
      }

      if (!(
        'where' in object && object.where &&
        object.where.constructor === {}.constructor &&
        'key' in object.where && object.where.key &&
        'value' in object.where && object.where.value &&
        'data' in object && object.data &&
        object.data.constructor === [].constructor
      )) {
        // Invalid data
        reject(new Error('Invalid data object'))
      }

      const values = []
      object.data.forEach((data) => {
        if (
          data && data.constructor === {}.constructor &&
          'key' in data && data.key && 'value' in data
        ) {
          values.push(`${data.key} = "${data.value}"`)
        }
      })
      if (values.length > 0) {
        self.db.run(
          `UPDATE ${object.name}
          SET ${values.join(', ')}
          WHERE ${object.where.key} = "${object.where.value}"`,
          (err) => {
            err && reject(err)
            !err && resolve()
          }
        )
      } else {
        reject(new Error('Invalid data object'))
      }
    })
  },

  /**
   * Delete table row of specified key, value
   */
  deleteRowByValue: function (object) {
    return new Promise((resolve, reject) => {
      const self = this
      if (!validateConfig(object)) {
        reject(new Error('Invalid helper object'))
      }

      if (!(
        'where' in object && object.where &&
        object.where.constructor === {}.constructor &&
        'key' in object.where && object.where.key &&
        'value' in object.where && object.where.value
      )) {
        // Invalid data
        reject(new Error('Invalid data object'))
      }
      self.db.all(
        `SELECT * FROM ${object.name}
        WHERE ${object.where.key} = "${object.where.value}"`,
        (err, data) => {
          if (err) {
            reject(err)
          }
          self.db.run(
            `DELETE FROM ${object.name}
            WHERE ${object.where.key} = "${object.where.value}"`,
            (err) => {
              err && reject(err)
              !err && resolve(data)
            }
          )
        }
      )
    })
  },

  /**
   * Clear full table
   */
  clearFullTable: function (object) {
    return new Promise((resolve, reject) => {
      const self = this
      if (!validateConfig(object)) {
        reject(new Error('Invalid helper object'))
      }
      self.db.run(
        `DELETE FROM ${object.name}`,
        (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    })
  }
}
