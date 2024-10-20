import React from 'react'
import axios from 'axios'
import Plot from 'react-plotly.js';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import {
  getCoreRowModel,
  flexRender,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// batter
// batterId
// exitDirection
// exitSpeed
// gameDate
// hangTime
// hitDistance
// hitSpinRate
// launchAngle
// pitcher
// pitcherId
// playOutcome
// videoLink
// _id

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDay() + 1 < 10 ? `0${date.getDay() + 1}` : `${date.getDay() + 1}`;
  return `${month}/${day}/${date.getFullYear() - 2000}`;
};

const xyOptions = [
  "Avg_Exit_Speed",
  "Avg_Launch_Angle",
  "Avg_Hit_Distance",
  "Avg_Hang_Time",
  "Avg_Hit_Spin_Rate"
];

const sizeOptions = [
  "Total_Hits",
  "Total_Outs",
  "Hit_Count",
];

const ScatterPlot = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [xAxis, setXAxis] = React.useState("Avg_Exit_Speed");
  const [yAxis, setYAxis] = React.useState("Avg_Launch_Angle");
  const [size, setSize] = React.useState("Total_Hits");
  const [aggregate, setAggregate] = React.useState(null);

  React.useEffect(() => {
    loadPlays();
  }, []);

  const loadPlays = async () => {
    const res = await axios.get('/v1/play');

    const aggregatedData = res.data.plays.reduce((acc, curr) => {
      const batter = curr.batter;

      if (!acc[batter]) {
        acc[batter] = {
          Total_Outs: 0,
          Total_Hits: 0,
          Avg_Exit_Speed: 0,
          Avg_Launch_Angle: 0,
          Avg_Hit_Distance: 0,
          Avg_Hang_Time: 0,
          Avg_Hit_Spin_Rate: 0,
          Hit_Count: 0
        };
      }

      if (curr.playOutcome === 'Out') {
        acc[batter].Total_Outs++;
      } else {
        acc[batter].Total_Hits++;
      }

      acc[batter].Avg_Exit_Speed += curr.exitSpeed;
      acc[batter].Avg_Launch_Angle += curr.launchAngle;
      acc[batter].Avg_Hit_Distance += curr.hitDistance;
      acc[batter].Avg_Hang_Time += curr.hangTime;
      acc[batter].Avg_Hit_Spin_Rate += curr.hitSpinRate;
      acc[batter].Hit_Count++;

      return acc;
    }, {});

    for (const batter in aggregatedData) {
      const batterData = aggregatedData[batter];
      batterData.Avg_Exit_Speed /= batterData.Hit_Count;
      batterData.Avg_Launch_Angle /= batterData.Hit_Count;
      batterData.Avg_Hit_Distance /= batterData.Hit_Count;
      batterData.Avg_Hang_Time /= batterData.Hit_Count;
      batterData.Avg_Hit_Spin_Rate /= batterData.Hit_Count;
    }

    const resultArray = Object.entries(aggregatedData).map(([batter, data]) => ({
      BATTER: batter,
      ...data
    }));

    setAggregate(resultArray);
    setLoading(false);
  };

  React.useEffect(() => {
    if (aggregate) {
      const x = [];
      const y = [];
      const s = [];
      const c = [];
      const t = [];

      aggregate
        .forEach(row => {
          y.push(row[yAxis]);
          x.push(row[xAxis]);
          s.push(row[size]);
          // c.push(row["playOutcome"]);
          t.push(row["BATTER"]);
        });

      setData({
        x,
        y,
        s,
        // c,
        t
      });
    }
  }, [aggregate, xAxis, yAxis, size]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <select
            onChange={e => setXAxis(e.target.value)}
            value={xAxis}
          >
            {xyOptions.map(value => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            onChange={e => setYAxis(e.target.value)}
            value={yAxis}
          >
            {xyOptions.map(value => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            onChange={e => setSize(e.target.value)}
            value={size}
          >
            {sizeOptions.map(value => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
          {loading || !data ? <CSpinner className="mx-auto" /> : (
            <Plot
              data={[
                {
                  type: "scatter",
                  mode: "markers",
                  x: data.x,
                  y: data.y,
                  text: data.t,
                  marker: { size: data.s, sizeref: 0.01, sizemode: "area" },
                  // transforms: [{ type: "groupby", groups: data.c }],
                  hovertemplate:
                    "<b>%{text}</b><br><br>" +
                    "%{yaxis.title.text}: %{y}<br>" +
                    "%{xaxis.title.text}: %{x}<br>" +
                    `${size}: %{marker.size:,}` +
                    "<extra></extra>"
                }
              ]}
              layout={{
                title: "Scatter Plot",
                hovermode: "closest",
                hoverlabel: { bgcolor: "#FFF" },
                legend: { orientation: 'h', y: -0.3 },
                xaxis: {
                  // tickformat: ".0%",
                  title: xAxis,
                  zeroline: false
                },
                yaxis: {
                  title: yAxis,
                  zeroline: false
                }
              }}
              config={{ responsive: true }}
            />)}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ScatterPlot;
