const data = [
  {
    batter: "Alonso, Yonder",
    batterId: 475174,
    exitDirection: 38.03,
    exitSpeed: 82.26,
    gameDate: "2018-04-01T04:00:00.000Z",
    hangTime: 0.65,
    hitDistance: 72.89,
    hitSpinRate: 4206.18,
    launchAngle: 5.07,
    pitcher: "Leake, Mike",
    pitcherId: 502190,
    playOutcome: "Out"
  },
  // ... additional data
];

// Aggregation
const aggregatedData = data.reduce((acc, curr) => {
  const batter = curr.batter;

  // Initialize the batter entry if it doesn't exist
  if (!acc[batter]) {
    acc[batter] = {
      Total_Outs: 0,
      Total_Hits: 0,
      Avg_Exit_Speed: 0,
      Avg_Launch_Angle: 0,
      Avg_Hit_Distance: 0,
      Avg_Hang_Time: 0,
      Avg_Hit_Spin_Rate: 0,
      Hit_Count: 0 // To calculate the averages
    };
  }

  // Count outcomes
  if (curr.playOutcome === 'Out') {
    acc[batter].Total_Outs++;
  } else {
    acc[batter].Total_Hits++;
  }

  // Aggregate statistics
  acc[batter].Avg_Exit_Speed += curr.exitSpeed;
  acc[batter].Avg_Launch_Angle += curr.launchAngle;
  acc[batter].Avg_Hit_Distance += curr.hitDistance;
  acc[batter].Avg_Hang_Time += curr.hangTime;
  acc[batter].Avg_Hit_Spin_Rate += curr.hitSpinRate;
  acc[batter].Hit_Count++;

  return acc;
}, {});

// Finalize averages
for (const batter in aggregatedData) {
  const batterData = aggregatedData[batter];
  batterData.Avg_Exit_Speed /= batterData.Hit_Count;
  batterData.Avg_Launch_Angle /= batterData.Hit_Count;
  batterData.Avg_Hit_Distance /= batterData.Hit_Count;
  batterData.Avg_Hang_Time /= batterData.Hit_Count;
  batterData.Avg_Hit_Spin_Rate /= batterData.Hit_Count;
}

// Convert to array if needed
const resultArray = Object.entries(aggregatedData).map(([batter, data]) => ({
  BATTER: batter,
  ...data
}));

console.log(resultArray);
