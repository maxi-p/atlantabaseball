import React from 'react'

// Base
const Tables = React.lazy(() => import('./views/base/tables/Tables'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/tables', name: 'Tables', element: Tables },
]

export default routes
