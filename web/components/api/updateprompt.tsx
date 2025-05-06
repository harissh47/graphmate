// web/app/generate/updatePrompt.tsx

export async function updatePromptAPI(id: string, inputPrompt: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart/update-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This enables sending and receiving cookies
    body: JSON.stringify({
      "id": id,
      "llm_prompt": inputPrompt
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update prompt');
  }

  return response.json();
}