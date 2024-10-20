import React from 'react'

// Base
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const ScatterPlot = React.lazy(() => import('./views/charts/ScatterPlot'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/tables', name: 'Tables', element: Tables },
  { path: '/scatter-plot', name: 'Scatter Plot', element: ScatterPlot },
]

export default routes
