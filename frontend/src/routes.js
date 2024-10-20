import React from 'react'

// Base
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const TestTables = React.lazy(() => import('./views/base/tables/TestTable'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/tables', name: 'Tables', element: Tables },
  { path: '/test-tables', name: 'TestTables', element: TestTables },
]

export default routes
