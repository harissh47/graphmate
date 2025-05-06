export async function bookmarkChart(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
      
    if (!response.ok) {
      throw new Error('Failed to bookmark the chart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in bookmarking the chart:', error);
    throw new Error('Failed to bookmark the chart');
  }
}