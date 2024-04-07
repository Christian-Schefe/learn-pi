const backendUrl = 'https://learn-pi-backend.shuttleapp.rs/';

interface Entry {
  id: number;
  score: number;
}

interface Average {
  average_score: number;
}

export async function saveScore(score: number): Promise<number> {
  const response = await fetch(backendUrl + 'scores', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ score: score }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Entry = await response.json();
  console.log('saved: ', json);
  return json.id;
}

export interface AverageData {
  average: number;
  timestamp: number;
}

export async function getAverage(): Promise<AverageData> {
  const response = await fetch(backendUrl + 'stats/avg', {
    method: 'GET',
    mode: 'cors',
  });

  const json: Average = await response.json();
  console.log('got average: ', json);
  return { average: json.average_score, timestamp: Date.now() };
}

export interface ScoreRange {
  range_index: number;
  count_in_range: number;
}

export interface ScoreRangeData {
  ranges: ScoreRange[];
  range_count: number;
  range_size: number;
  total_count: number;
}

export async function getRanges(): Promise<ScoreRangeData> {
  const response = await fetch(backendUrl + 'stats/ranges', {
    method: 'GET',
    mode: 'cors',
  });

  const json: ScoreRangeData = await response.json();
  console.log('got score ranges: ', json);
  return json;
}
