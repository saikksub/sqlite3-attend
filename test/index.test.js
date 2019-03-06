import test from 'ava'

const Sqlite3Attend = require('../index')

const ARRAY_DATA = [
  {
    a: 'value:a:1',
    b: 'value:b:2'
  },
  {
    a: 'value:a:3',
    b: 'value:b:4'
  },
  {
    a: 'value:a:5',
    b: 'value:b:6'
  }
]

const sql = new Sqlite3Attend({
  path: './',
  name: 'testDatabase'
})

test.before(async t => {
  const res = sql.init([
    {
      name: 'mytable',
      columns: [
        {
          name: 'a',
          type: 'TEXT'
        },
        {
          name: 'b',
          type: 'TEXT'
        },
        {
          name: 'c',
          type: 'TEXT'
        }
      ]
    }
  ])
  t.is(await res)
})

test.serial('clearFullTable', async t => {
  const res = sql.clearFullTable({
    name: 'mytable'
  })
  t.is(await res)
})

test.serial('getHandle', async t => {
  const handle = sql.getHandle()
  if (handle) {
    t.pass()
  } else {
    t.fail()
  }
})

test.serial('writeTable', async t => {
  const writeRes = sql.writeTable({
    name: 'mytable',
    data: Object.assign([], ARRAY_DATA)
  })
  t.is(await writeRes)
})

test.serial('readFullTable', async t => {
  const res = new Promise((resolve, reject) => {
    sql.readFullTable({
      name: 'mytable'
    }).then((data) => {
      data.forEach((dataItem, index) => {
        const result = true
        if (dataItem.a !== ARRAY_DATA[index].a) {
          result = false
        } else if (dataItem.b !== ARRAY_DATA[index].b) {
          result = false
        }
        resolve(result)
      })
      t.is(result, true)
    }).catch(() => {
      reject(false)
    })
  })
  t.is(await res, true)
})

test.serial('updateTableByValue', async t => {
  const res = sql.updateTableByValue({
    name: 'mytable',
    where: {
      key: 'a',
      value: 'value:a:3'
    },
    data: [
      {
        key: 'a',
        value: 'value:a:update:3'
      },
      {
        key: 'b',
        value: 'value:b:update:3'
      }
    ]
  })
  t.is(await res)
})

test.serial('readRowByValue', async t => {
  const res = new Promise((resolve, reject) => {
    sql.readRowByValue({
      name: 'mytable',
      where: {
        key: 'a',
        value: 'value:a:update:3'
      }
    }).then(() => {
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  })
  t.is(await res, true)
})

test.serial('deleteRowByValue', async t => {
  const res = new Promise((resolve, reject) => {
    sql.deleteRowByValue({
      name: 'mytable',
      where: {
        key: 'a',
        value: 'value:a:1'
      }
    }).then(() => {
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  })
  t.is(await res, true)
})
