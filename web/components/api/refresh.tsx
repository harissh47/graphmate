// web/app/api/refresh.tsx

export const refreshDataset = async (datasetId: string, datasetRelationId: string) => {
    try {
      // Get the session cookie
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
      
      //console.log('Session cookie being sent:', sessionCookie);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/regenerate`, {
        method: 'POST',
        headers: {
          'Cookie': `session=${sessionCookie || ''}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          dataset_id: datasetId,
          dataset_relation_id: datasetRelationId,
        }),
      });
  
      // Log response details for debugging
      //console.log('Response status:', response.status);
      //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      //console.log('Set-Cookie header:', response.headers.get('set-cookie'));

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to refresh dataset: ${errorData}`);
      }
  
      // Save any cookies from the response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        document.cookie = cookies;
        //console.log('New cookies set:', cookies);
      }

      const newData = await response.json();
      //console.log('API Response data:', newData);
      return newData;
    } catch (error) {
      console.error('Error refreshing dataset:', error);
      throw error;
    }
  };