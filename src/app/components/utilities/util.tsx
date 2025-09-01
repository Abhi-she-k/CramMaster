


const checkResponse = async (res: Response) => {
    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      throw new Error(`HTTP: ${res.status}, API: ${data.status ?? 'unknown'}, Message: ${data.error ?? data.message}`);
    }
    return data;
  };