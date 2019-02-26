Asynchronous higher level [node-sqlite3](https://github.com/mapbox/node-sqlite3) API for [Node.js](https://nodejs.org/en/).

> This library is not released yet.

# Usage
**Note**: the module must be installed before use.
```
  const Sqlite3 = require('sqlite3-attend')
  
  const sql = new Sqlite3({
    /* Path to create (or) open SQL database */
    path: './',
    /* Name of the database without '.db' extension */
    name: 'myDatabase'
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
```
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

```
  sql.readFullTable({
    name: 'users'
  }).then((data) => {
    // resultant data is an Array.
    // If there are no entries available, then array length is zero.
    console.log('full table', data)
  })
```

## Read table row by value
```
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

In the above API, the object `where` is a condition which specifies `key` and `value` of our condition.

The above example will try to find one or more row(s) that matches `name` as `kiran`, inside a table with name `users`.

## Update table row by value
```
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

In the above API, the object `where` is a condition which specifies `key` and `value` of our condition.

The `data` object contains new values. This `data` object is an Array of objects. Each object should specify `key` (column name) and `value` (column value).


## Delete table row by value
```
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

In the example, **all** the rows that containig `name` as `Kiran Sai` will be deleted.

## Clear a full table
```
  sql.clearFullTable({
    name: 'users'
  }).then(() => {
    console.log('Entire table is cleared')
  })
```

`clearFullTable` will clear all the rows of a specified `table`. **This won't delete the table schematic**.


## Get SQL database handle (Synchronous method)
```
  sql.getHandle()
```

`getHandle` will return direct file descriptor of SQL data base. This method can be used to work with `sqlite3` directly. 

# License
[MIT](https://opensource.org/licenses/MIT)

## Author
[saikksub](https://github.com/saikksub)
