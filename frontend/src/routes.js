import React from 'react'

// Base
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const ScatterPlot = React.lazy(() => import('./views/charts/ScatterPlot'))
const Heatmap = React.lazy(() => import('./views/charts/Heatmap'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/tables', name: 'Tables', element: Tables },
  { path: '/scatter-plot', name: 'Scatter Plot', element: ScatterPlot },
  { path: '/heatmap', name: 'Heatmap', element: Heatmap },
]

export default routes
