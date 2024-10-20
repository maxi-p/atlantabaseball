import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBattery0,
  cilBorderOuter,
  cilChart,
  cilChartLine,
  cilGraph,
  cilSpreadsheet,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Tables',
  },
  {
    component: CNavItem,
    name: 'Table',
    to: '/tables',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Graphs',
  },
  {
    component: CNavItem,
    name: 'Scatter Plots',
    to: '/scatter-plot',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Heatmap',
    to: '/heatmap',
    icon: <CIcon icon={cilBorderOuter} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Box Plots',
    to: '/box-plot',
    icon: <CIcon icon={cilBattery0} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Histograms',
    to: '/histogram',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
]

export default _nav
