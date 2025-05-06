import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dataset/update`;

export const updateDataset = async (dataset: {
  datasetDescription: string;
  columns: Array<{
    columnName: string;
    columnDescription: string;
    columnDataDescription: string;
  }>;
  datasetName: string;
  datasetId: string;
  dataset_relation_id: string;
}) => {
  try {
    //console.log('Sending dataset:', dataset);
    const response = await axios.put(API_URL, dataset, {
      withCredentials: true // This enables sending and receiving cookies
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating dataset:', error);
    throw error;
  }
};