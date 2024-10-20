import React from 'react'

// Base
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const ScatterPlot = React.lazy(() => import('./views/charts/ScatterPlot'))
const Heatmap = React.lazy(() => import('./views/charts/Heatmap'))
const Boxplot = React.lazy(() => import('./views/charts/Boxplot'))
const Histogram = React.lazy(() => import('./views/charts/Histogram'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/tables', name: 'Tables', element: Tables },
  { path: '/scatter-plot', name: 'Scatter Plot', element: ScatterPlot },
  { path: '/heatmap', name: 'Heatmaps', element: Heatmap },
  { path: '/box-plot', name: 'Box Plots', element: Boxplot },
  { path: '/histogram', name: 'Histograms', element: Histogram },
]

export default routes
