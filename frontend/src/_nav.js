import React from 'react'
import CIcon from '@coreui/icons-react'
import {
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
]

export default _nav
