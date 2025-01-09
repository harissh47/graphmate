export async function bookmarkChart(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
     if (!response.ok) {
      throw new Error('Failed to bookmark the chart');
    }
  } catch (error) {
    console.error('Error in bookmarking the chart:', error);
  }
}