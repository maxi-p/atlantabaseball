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

const Heatmap = () => {
  const [loading, setLoading] = React.useState(true);
  const [heatmapMatrix, setHeatmapMatrix] = React.useState([]);
  const [angleBins, setAngleBins] = React.useState([]);
  const [outcomes, setOutcomes] = React.useState([]);
  const [data, setData] = React.useState(null);
  const [option, setOption] = React.useState("launchAngle")

  React.useEffect(() => {
    if (data) {
      const selectedOption = data.map(entry => entry[option]);
      const minAngle = Math.min(...selectedOption);
      const maxAngle = Math.max(...selectedOption);

      const numBins = 8;
      const binSize = (maxAngle - minAngle) / numBins;

      const bins = Array.from({ length: numBins }, (_, i) => {
        const lowerBound = (minAngle + i * binSize).toFixed(2);
        const upperBound = (minAngle + (i + 1) * binSize).toFixed(2);
        return `${lowerBound} to ${upperBound}`;
      });
      setAngleBins(bins);

      const outcomes = [...new Set(data.map(entry => entry.playOutcome))];
      setOutcomes(outcomes);

      const matrix = Array.from({ length: bins.length }, () => Array(outcomes.length).fill(0));

      const getBinIndex = (angle) => {
        for (let i = 0; i < bins.length; i++) {
          const [lower, upper] = bins[i].split(' to ').map(Number);
          if (angle >= lower && angle < upper) {
            return i;
          }
        }
        return -1;
      };

      data.forEach(entry => {
        const binIndex = getBinIndex(entry.launchAngle);
        const outcomeIndex = outcomes.indexOf(entry.playOutcome);
        if (binIndex !== -1 && outcomeIndex !== -1) {
          matrix[binIndex][outcomeIndex] += 1;
        }
      });

      setHeatmapMatrix(matrix);
    }
  }, [data, option]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/v1/play');
        setData(res.data.plays);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
            data={[
              {
                z: heatmapMatrix,
                x: outcomes,
                y: angleBins,
                type: 'heatmap',
                colorscale: 'YlOrRd',
              },
            ]}
            layout={{
              title: `${option} Heatmap by Outcome`,
              xaxis: { title: 'Outcome' },
              yaxis: {
                title: `${option}  Ranges`,
                automargin: true,
                tickangle: -45,
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
    </CRow>
  );
};

export default Heatmap;
