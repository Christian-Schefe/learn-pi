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

export async function getAverage(): Promise<{
  average: number;
  timestamp: number;
}> {
  const response = await fetch(backendUrl + 'stats/avg', {
    method: 'GET',
    mode: 'cors',
  });

  const json: Average = await response.json();
  console.log('got average: ', json);
  return { average: json.average_score, timestamp: Date.now() };
}
