import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBorderOuter,
  cilChart,
  cilChartLine,
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
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Heatmap',
    to: '/heatmap',
    icon: <CIcon icon={cilBorderOuter} customClassName="nav-icon" />,
  },
]

export default _nav
