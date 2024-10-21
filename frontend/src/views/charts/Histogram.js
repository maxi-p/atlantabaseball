import React from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import {
  CCard,
  CCol,
  CRow,
  CSpinner,
  CFormSelect
} from '@coreui/react';

const options = [
  "launchAngle",
  "exitDirection",
  "exitSpeed",
  "hangTime",
  "hitDistance",
];

const HistogramWithPercentiles = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [option, setOption] = React.useState("launchAngle");

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

  // Function to calculate statistics
  const calculateStatistics = (values) => {
    if (!values.length) return {};

    values.sort((a, b) => a - b);
    const min = values[0];
    const max = values[values.length - 1];
    const median = values[Math.floor(values.length / 2)];
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const p95 = values[Math.floor(values.length * 0.95)];

    return { min, q1, median, q3, p95, max };
  };

  // Prepare histogram data
  const histogramData = () => {
    const selectedOption = data.map(entry => entry[option]);
    const stats = calculateStatistics(selectedOption);

    // Create bins for the histograms
    const bins = [
      { name: 'Min', range: [stats.min, stats.q1] },
      { name: '25th Percentile', range: [stats.q1, stats.median] },
      { name: 'Median', range: [stats.median, stats.q3] },
      { name: '75th Percentile', range: [stats.q3, stats.p95] },
      { name: '95th Percentile', range: [stats.p95, stats.max] },
    ];

    return bins.map(bin => {
      return {
        x: selectedOption.filter(angle => angle >= bin.range[0] && angle < bin.range[1]),
        type: 'histogram',
        name: bin.name,
        marker: { color: getColorByName(bin.name) },
        opacity: 0.8, // Increased opacity for better visibility
        histnorm: 'density',
        xbins: { size: 5 }, // Reduced bin size for better overlap
      };
    });
  };

  const getColorByName = (name) => {
    switch (name) {
      case 'Min': return 'rgba(255, 0, 0, 0.5)';
      case '25th Percentile': return 'rgba(0, 255, 0, 0.5)';
      case 'Median': return 'rgba(0, 0, 255, 0.5)';
      case '75th Percentile': return 'rgba(255, 255, 0, 0.5)';
      case '95th Percentile': return 'rgba(255, 165, 0, 0.5)';
      default: return 'rgba(200, 200, 200, 0.5)';
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 d-flex justify-content-center align-items-center">
          <CFormSelect
            onChange={e => setOption(e.target.value)}
            value={option}
          >
            {options.map(value => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </CFormSelect>
          {loading || !data ? <CSpinner className="mx-auto" /> : (<Plot
            data={histogramData()}
            layout={{
              title: `${option} Histogram with Percentiles`,
              xaxis: {
                title: `${option}`,
              },
              yaxis: {
                title: 'Density',
              },
              barmode: 'overlay',
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

export default HistogramWithPercentiles;
