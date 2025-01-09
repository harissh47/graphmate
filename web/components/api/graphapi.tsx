export async function generateData(id: string): Promise<any> {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/generate-data`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}