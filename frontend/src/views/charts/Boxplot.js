import React from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import {
  CCard,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react';

const options = [
  "launchAngle",
  "exitDirection",
  "exitSpeed",
  "hangTime",
  "hitDistance",
  "hitSpinRate",
];

const Boxplot = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [outcomes, setOutcomes] = React.useState([]);
  const [boxplotData, setBoxplotData] = React.useState(null);
  const [option, setOption] = React.useState("launchAngle");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/v1/play');
        setData(res.data.plays);
        setLoading(false);

        const uniqueOutcomes = [...new Set(res.data.plays.map(entry => entry.playOutcome))];
        setOutcomes(uniqueOutcomes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const sampleData = (array, sampleSize) => {
    if (array.length <= sampleSize) return array;
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, sampleSize);
  };

  React.useEffect(() => {
    if (data) {
      setBoxplotData(outcomes.map(outcome => {
        const values = data
          .filter(entry => entry.playOutcome === outcome)
          .map(entry => entry[option]); // Replace with the statistic you want to visualize

        const sampledValues = sampleData(values, 100);

        return {
          y: sampledValues,
          type: 'box',
          name: outcome,
          boxpoints: 'all', // Show all points
          jitter: 0.5,      // Spread points
          pointpos: -1.8,   // Position of points
        };
      }));
    }
  }, [data, option]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <select
            onChange={e => setOption(e.target.value)}
            value={option}
          >
            {options.map(value => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
          {loading || !data ? <CSpinner className="mx-auto" /> : (<Plot
            data={boxplotData}
            layout={{
              title: `${option} Box Plot by Outcome`,
              yaxis: {
                title: `${option}`,
                automargin: true,
              },
              xaxis: {
                title: 'Outcome',
              },
              width: 800,
              height: 600,
              margin: {
                l: 100,
                r: 50,
                b: 100,
                t: 100,
              },
            }}
            config={{ responsive: true }}
          />)}
        </CCard>
      </CCol>
    </CRow>)
};

export default Boxplot;
