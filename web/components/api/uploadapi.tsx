export async function uploadFile(file: File, datasetRelationId?: string) {
  const formData = new FormData();
  formData.append('file', file);

  // Append dataset_relation_id only if it's provided
  if (datasetRelationId) {
    formData.append('dataset_relation_id', datasetRelationId);
  }

  // Get and log the session cookie
  const sessionCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('session='))
    ?.split('=')[1];
  
  //console.log('Session cookie being sent:', sessionCookie);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/upload`, {
    method: 'POST',
    headers: {
      'Cookie': `session=${sessionCookie || ''}`,
    },
    body: formData,
    credentials: 'include',
  });

  // Log response headers and cookies
  //console.log('Response status:', response.status);
  //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  //console.log('Set-Cookie header:', response.headers.get('set-cookie'));

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  // Save and log any cookies from the response
  const cookies = response.headers.get('set-cookie');
  if (cookies) {
    document.cookie = cookies;
    //console.log('New cookies set:', cookies);
  }

  // Assuming the server returns JSON data
  const data = await response.json();
  //console.log('API Response data:', data);
  return data;
}