export async function postDatasetChart(data: any): Promise<any> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error('Failed to post dataset chart');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error posting dataset chart:', error);
        throw error;
    }
}