const fs = require('fs')
const path = require('path')
const SqliteAttend = require('../index')

const dbPath = path.join(
  process.cwd(),
  'myDatabase.db'
)

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

const sql = new SqliteAttend({
  path: './',
  name: 'myDatabase'
})

test('test CRUD', async () => {
  try {
    await sql.init([
      {
        name: 'test',
        columns: [
          {
            name: 'name',
            type: 'TEXT'
          },
          {
            name: 'timestamp',
            type: 'TEXT'
          },
          {
            name: 'num',
            type: 'TEXT'
          },
          {
            name: 'counter',
            type: 'TEXT'
          }
        ]
      }
    ])
    const data = []
    for (let i = 1; i <= 100; i++) {
      data.push({
        name: `dummy ${i}`,
        timestamp: new Date().getTime(),
        counter: `${i}`,
        num: `${i}`.split('')[0]
      })
    }
    await sql.writeTable({
      name: 'test',
      data
    })
    let result = await sql.readFullTable({
      name: 'test'
    })
    console.table(result)

    result = await sql.readRowByObject({
      name: 'test',
      limit: 10,
      offset: 8,
      where: {
        num: '3'
      }
    })
    console.table(result)
  } catch (error) {
    throw error
  }
})