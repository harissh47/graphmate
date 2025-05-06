export async function postDatasetChart(data: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Failed to post dataset chart: ${await response.text()}`);
    }

    return await response.json();
}