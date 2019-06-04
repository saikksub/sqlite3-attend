Asynchronous higher level [node-sqlite3](https://github.com/mapbox/node-sqlite3) API for [Node.js](https://nodejs.org/en/).

[![Build Status](https://travis-ci.com/saikksub/sqlite3-attend.svg?branch=master)](https://travis-ci.com/saikksub/sqlite3-attend)
[![npm version](https://badge.fury.io/js/sqlite3-attend.svg)](https://badge.fury.io/js/sqlite3-attend)

## Install
``` bash
  npm i -s sqlite3-attend
```

## Usage
**Note**: the module must be installed before use.
``` javascript
  const Sqlite3Attend = require('sqlite3-attend')
  
  const sql = new Sqlite3Attend({
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
    name: 'users',
    limit: 10, // (Optional) Limit the query results
    offset: 2  // (Optional) Results from offset along with limit
  }).then((data) => {
    // resultant data is an Array.
    // If there are no entries available, then array length is zero.
    console.log('full table', data)
  })
```

## Read table row by object
``` javascript
  sql.readRowByObject({
    name: 'users',
    limit: 10, // (Optional) Limit the query results
    offset: 2,  // (Optional) Results from offset along with limit
    where: {
      name: 'kiran'
    }
  }).then((data) => {
    // resultant data is an Array.
    // If there are no entries matched, then array length is zero.
    console.log('Users with name "kiran": ', data)
  })
```

## Update table row by object
``` javascript
  sql.updateTableByObject({
    name: 'users',
    where: {
      name: 'kiran'
    },
    data: {
      email: 'kiran@gmail.com',
      name: 'Kiran Sai'
    }
  }).then(() => {
    console.log('update complete')
  })
```
## Delete table row by object
``` javascript
  sql.deleteRowByObject({
    name: 'users',
    where: {
      name: 'Kiran Sai'
    }
  }).then(() => {
    console.log('Deleted')
  })
```


## Clear a full table
``` javascript
  sql.clearFullTable({
    name: 'users'
  }).then(() => {
    console.log('Entire table is cleared')
  })
```


## Get SQL database handle (Synchronous method)
``` javascript
  sql.getHandle()
```

`getHandle` will return direct file descriptor of SQL data base. 

# License
[MIT](https://opensource.org/licenses/MIT)

## Author
[saikksub](https://github.com/saikksub)
