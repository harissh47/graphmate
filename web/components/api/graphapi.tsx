export async function generateData(id: string): Promise<any> {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/generate-data`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Cookie': document.cookie
          },
          credentials: 'include', // This enables sending and receiving cookies
          body: JSON.stringify({ id }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      // Save any cookies from the response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
          document.cookie = cookies;
      }

      const data = await response.json();
      //console.log('Success:', data);
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}