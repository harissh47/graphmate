export async function unbookmarkChart(id: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart/unbookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
       if (!response.ok) {
        throw new Error('Failed to unbookmark the chart');
      }
    } catch (error) {
      console.error('Error in unbookmarking the chart:', error);
    }
}