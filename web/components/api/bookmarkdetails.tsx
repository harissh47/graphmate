import axios from 'axios';

export async function fetchBookmarks(userId: string) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart/bookmark/details`, {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw new Error('Failed to fetch bookmarks');
  }
} 