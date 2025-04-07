const apiBase = 'http://localhost:3001';

export async function ladeStationen(): Promise<string[]> {
    const res = await fetch(`${apiBase}/stationen`, {
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    return res.json();
  }
  
export async function ladeDokumente(station: string): Promise<string[]> {
    const res = await fetch(`${apiBase}/dokumente/${station}`, {
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors'
    });
    return res.json();
  }
