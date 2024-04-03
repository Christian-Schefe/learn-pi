const backendUrl = 'https://learn-pi-backend.shuttleapp.rs/scores';

export interface Entry {
  id: number;
  score: number;
}

export async function saveScore(score: number): Promise<number> {
  const response = await fetch(backendUrl, {
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
