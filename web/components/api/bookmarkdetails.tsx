import axios from 'axios';

export async function fetchBookmarks(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart/bookmark/details`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw new Error('Failed to fetch bookmarks');
  }
} 