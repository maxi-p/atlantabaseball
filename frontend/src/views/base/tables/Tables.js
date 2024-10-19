import React from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

const Tables = () => {
  const [plays, setPlays] = React.useState([]);
  const [paginatedPlays, setPaginatedPlays] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  React.useEffect(() => {
    loadPlays();
  }, []);

  React.useEffect(() => {
    setPaginatedPlays(plays.slice(page, page + limit));
  }, [plays]);

  const loadPlays = async () => {
    const res = await axios.get('/v1/play');
    setPlays(res.data.plays);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear() - 2000}`;
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Batted Ball Data</strong> <small>Table</small>
          </CCardHeader>
          <CCardBody className="overflow-scroll">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">BATTER</CTableHeaderCell>
                  <CTableHeaderCell scope="col">PITCHER</CTableHeaderCell>
                  <CTableHeaderCell scope="col">GAME_DATE</CTableHeaderCell>
                  <CTableHeaderCell scope="col">LAUNCH_ANGLE</CTableHeaderCell>
                  <CTableHeaderCell scope="col">EXIT_SPEED</CTableHeaderCell>
                  <CTableHeaderCell scope="col">EXIT_DIRECTION</CTableHeaderCell>
                  <CTableHeaderCell scope="col">HIT_DISTANCE</CTableHeaderCell>
                  <CTableHeaderCell scope="col">HANG_TIME</CTableHeaderCell>
                  <CTableHeaderCell scope="col">HIT_SPIN_RATE</CTableHeaderCell>
                  <CTableHeaderCell scope="col">PLAY_OUTCOME</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedPlays.map((play, index) => {
                  return (<CTableRow key={index}>
                    <CTableDataCell>{play.batter}</CTableDataCell>
                    <CTableDataCell>{play.pitcher}</CTableDataCell>
                    <CTableDataCell>{formatDate(play.gameDate)}</CTableDataCell>
                    <CTableDataCell>{play.launchAngle}</CTableDataCell>
                    <CTableDataCell>{play.exitSpeed}</CTableDataCell>
                    <CTableDataCell>{play.exitDirection}</CTableDataCell>
                    <CTableDataCell>{play.hitDistance}</CTableDataCell>
                    <CTableDataCell>{play.hangTime}</CTableDataCell>
                    <CTableDataCell>{play.hitSpinRate}</CTableDataCell>
                    <CTableDataCell>{play.playOutcome}</CTableDataCell>
                  </CTableRow>)
                })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tables
