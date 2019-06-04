---
sidebar: auto
sidebarDepth: 1
---

# What is sqlite3-attend?

Sqlite3-attend is a wrapper with asynchronous API to perform CRUD operations on sqlite3 databases. It is just a wrapper around [sqlite3](https://www.npmjs.com/package/sqlite3) library.

Using sqlite3-attend, you can perform CRUD operations such as **Create, Read, Update and Delete**, without having to write or learn SQL commands.

These **CRUD operations** are performed on **SQL databases** using **NoSQL style data structures** (key-value pair).

## Getting started

### Installation

``` bash
npm i --save sqlite3-attend
```

### Usage

``` JavaScript
const Sqlite3Attend = require('sqlite3-attend')

const sql = new Sqlite3Attend({
  path: './', // Path to create (or) open SQL database
  name: 'myDatabase' //Name of the database without '.db' extension
})
```
> No SQL database will be created from the above snippet. It just creates an object to expose the necessary API to initialize the database and perform operations on it.

This will create an sqlite3 object. Now define SQL schematic as `Array` object as follows:
``` JavaScript
const sqlSchema = [
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
]
```

Each object in the `sqlSchema` is having `name` of the table and it's `columns`.

Now let's initialize the SQL database using `init` asynchronous API.

``` JavaScript
let isSqlReady = false

sql.init(sqlSchema)
  .then(() => {
    console.log('SQL database is initialized and is ready to use')
    isSqlReady = true
  })
  .catch(err => {
    console.error(err)
  })
```

::: danger
Perform SQL operations only after `init` is successfully initialized.
:::

Now write data into the table `users` using `writeTable` API.

``` JavaScript
// Only if sql is initialized successfully
if (isSqlReady) {
  sql.writeTable({
    name: 'users',
    data: [
      {
        name: 'user1',
        email: 'user1@domain.com'
      },
      {
        name: 'user2',
        email: 'user2@domain.com'
      },
      {
        name: 'user3',
        email: 'user3@domain.com'
      },
      {
        name: 'user3',
        email: 'user3@domain.com'
      },
      {
        name: 'user4',
        email: 'user4@domain.com'
      },
      {
        name: 'user5',
        email: 'user5@domain.com'
      }
    ]
  })
}
```

## API

List of API available:
* `writeTable` - Write/Append data into specified table
* `readFullTable` - Read full specified table
* `readRowByObject` - Read specified row from specified table with `Object` as condition.
* `updateTableByObject` - Update specified row from specified table with `Object` as condition.
* `deleteRowByObject` - Delete specified row from specified table with `Object` as condition.
* `clearFullTable` - Clear entire specified table
* `getHandle` - Get `sqlite3` handle to perform SQL commands

### Write table

``` JavaScript
sql.writeTable({
  name: 'users',
  data: [
    {
      name: 'user1',
      email: 'user1@domain.com'
    },
    {
      name: 'user2',
      email: 'user2@domain.com'
    }
  ]
}).then(() => {
  console.log('done!')
}).catch(err => {
  // Failed to perform operation
  console.error(err)
})
```

### Read full table

``` JavaScript
sql.readFullTable({
  name: 'users',
  limit: 10, // (Optional) Limit the query results
  offset: 2  // (Optional) Results from offset along with limit
}).then((data) => {
  // resultant data is an Array.
  // If there are no entries available, then array length is zero.
  console.log('full table', data)
}).catch(err => {
  // Failed to perform operation
  console.error(err)
})
```

* `limit` Number - the number of results on specified table `name`
* `offset` Number - from where to start reading database on specified table `name`

::: warning
`limit` and `offset` are optional. But, you have to provide `limit` if you want to use `offset`.
:::

### Read table by object

``` JavaScript
sql.readRowByObject({
  name: 'users',
  limit: 10, // (Optional) Limit the query results
  offset: 2,  // (Optional) Results from offset along with limit
  where: {
    name: 'user1'
  }
}).then((data) => {
  // resultant data is an Array.
  // If there are no entries matched, then array length is zero.
  console.log('Users with name "kiran": ', data)
}).catch(err => {
  // Failed to perform operation
  console.error(err)
})
```

`where` is an object condition.

### Update table by object

``` JavaScript
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
}).catch(err => {
  // Failed to perform operation
  console.error(err)
})
```

### Delete row by object

``` JavaScript
sql.deleteRowByObject({
  name: 'users',
  where: {
    name: 'Kiran Sai'
  }
}).then(() => {
  console.log('Deleted')
}).catch(err => {
  // Failed to perform operation
  console.error(err)
})
```

### Clear full table

``` JavaScript
sql.clearFullTable({
  name: 'users'
}).then(() => {
  console.log('Entire table is cleared')
}).catch(err => {
  // Failed to perform operation
  console.error(err)
})
```

### Get Sqlite3 handle

``` JavaScript
sql.getHandle()
```

This will return sql database handle and exposes sqlite3 library API. You can write your own SQL commands and perform more customized operations than CRUD. **You need learn/use SQL commands to perform operations using sqlite3 library**. Visit [sqlite3](https://www.npmjs.com/package/sqlite3) for more information.