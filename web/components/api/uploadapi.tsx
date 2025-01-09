export async function uploadFile(file: File, datasetRelationId?: string) {
  const formData = new FormData();
  formData.append('file', file);

  // Append dataset_relation_id only if it's provided
  if (datasetRelationId) {
    formData.append('dataset_relation_id', datasetRelationId);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  // Assuming the server returns JSON data
  const data = await response.json();
  return data;
}