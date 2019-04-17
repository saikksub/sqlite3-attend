Asynchronous higher level [node-sqlite3](https://github.com/mapbox/node-sqlite3) API for [Node.js](https://nodejs.org/en/).

[![Build Status](https://travis-ci.com/saikksub/sqlite3-attend.svg?branch=master)](https://travis-ci.com/saikksub/sqlite3-attend)
[![npm version](https://badge.fury.io/js/sqlite3-attend.svg)](https://badge.fury.io/js/sqlite3-attend)

> Note: **sqlite3-attend** is just a wrapper around the **sqlite3** npm package. The internal dependency **sqlite3** has been removed. 

## Install
``` bash
  npm i -S sqlite3
  npm i -s sqlite3-attend
```

## Usage
**Note**: the module must be installed before use.
``` javascript
  const Sqlite3 = require('sqlite3-attend')
  
  const sql = new Sqlite3({
    sqlite3: sqlite3, // Sqlite3 dependency
    path: './', // Path to create (or) open SQL database
    name: 'myDatabase' //Name of the database without '.db' extension
  })

  sql.init([
    {
      name: 'myTable1', // Name of the table
      columns: [
        {
          name: 'col1', // Name of the column
          type: 'TEXT' // Type of the column
        },
        {
          name: 'col2',
          type: 'TEXT'
        },
        {
          name: 'col3',
          type: 'TEXT'
        }
      ]
    },
    {
      name: 'users', // Name of the table
      columns: [
        {
          name: 'name', // Name of the column
          type: 'TEXT' // Type of the column
        },
        {
          name: 'email',
          type: 'TEXT'
        }
      ]
    }
  ]).then(() => {
    // Database initialized
    // Write into Database

    sql.writeTable({
      name: 'users',
      data: [
        {
          name: 'sai',
          email: 'saikksub@gmail.com'
        }
      ]
    })
  
  })
```
## Write a new row into the table
``` javascript
  sql.writeTable({
    name: 'users',
    data: [
      {
        name: 'sai',
        email: 'saikksub@gmail.com'
      },
      {
        name: 'kiran',
        email: 'kiranece2013@gmail.com'
      },
      {
        name: 'Sample name 1',
        email: 'dummyname1@gmail.com'
      }
    ]
  }).then(() => {
    console.log('writeTable is completed')
  }).catch((err) => {
    console.error('writeTable errored', err)
  })
```

## Read full table

``` javascript
  sql.readFullTable({
    name: 'users'
  }).then((data) => {
    // resultant data is an Array.
    // If there are no entries available, then array length is zero.
    console.log('full table', data)
  })
```

## Read table row by value
``` javascript
  sql.readRowByValue({
    name: 'users',
    where: {
      key: 'name',
      value: 'kiran'
    }
  }).then((data) => {
    // resultant data is an Array.
    // If there are no entries matched, then array length is zero.
    console.log('Users with name "kiran": ', data)
  })
```

In the above API, the object `where` is a key containing condition which specifies target table name - `key` and its value - `value`.

The above example will try to find one/more row(s) inside a table `users` which contains `name` match with `kiran`.

## Update table row by value
``` javascript
  sql.updateTableByValue({
    name: 'users',
    where: {
      key: 'name',
      value: 'kiran'
    },
    data: [
      {
        key: 'email',
        value: 'kiran@gmail.com'
      },
      {
        key: 'name',
        value: 'Kiran Sai'
      }
    ]
  }).then(() => {
    console.log('update complete')
  })
```

In the above API, the object `where` is a key containing condition which specifies target table name - `key` and its value - `value`.

The `data` object contains new values to update. This `data` should be an Array of objects. Each object should represent column name and it's value.


## Delete table row by value
``` javascript
  sql.deleteRowByValue({
    name: 'users',
    where: {
      key: 'name',
      value: 'Kiran Sai'
    }
  }).then(() => {
    console.log('Deleted')
  })
```
In the above API, the object `where` is a condition which specifies `key` and `value` of our condition.

In the example, **all** the rows that matches `name` as `Kiran Sai` will be deleted.

## Clear a full table
``` javascript
  sql.clearFullTable({
    name: 'users'
  }).then(() => {
    console.log('Entire table is cleared')
  })
```

`clearFullTable` will clear all the rows of a specified `table`. **This won't delete the table definition**.


## Get SQL database handle (Synchronous method)
``` javascript
  sql.getHandle()
```

`getHandle` will return direct file descriptor of SQL data base. 

# License
[MIT](https://opensource.org/licenses/MIT)

## Author
[saikksub](https://github.com/saikksub)
