'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Upload, Trash, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Header from "../Header";
import Footer from "../Footer"; // Import the Footer component
import Link from 'next/link';
import { uploadFile } from '../../components/api/uploadapi';
import { ButtonNew } from "@/components/ui/buttonnew";
import Modal from './Modal';
import { useRouter } from 'next/navigation';
import { updateDataset } from '../../components/api/updateputapi';
import { postDatasetChart } from '../../components/api/continueapi'; // Import the API function
import NewModal from './newModal'; // Import the new modal
 
export default function App() {
  const [fileName, setFileName] = useState<string>('');
  const [datasets, setDatasets] = useState<{ fileName: string, response: { columns: any[]; datasetId?: string; dataset_relation_id?: string; [key: string]: any }, color: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(true);
  const [editedDatasets, setEditedDatasets] = useState<boolean[]>([]);
  const [collapsedDatasets, setCollapsedDatasets] = useState<boolean[]>([]);
  const [spinningRefresh, setSpinningRefresh] = useState<boolean[]>([]);
  const [editedColumns, setEditedColumns] = useState<{ [key: number]: { [key: number]: boolean } }>({});
  const [isRelationModalOpen, setIsRelationModalOpen] = useState<boolean>(false);
  const [relationText, setRelationText] = useState<string>('');
  const [lastRelationId, setLastRelationId] = useState<string | null>(null);
  const [datasetRelationId, setDatasetRelationId] = useState<string | null>(null); // Initialize as null
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [datasetToDelete, setDatasetToDelete] = useState<number | null>(null);
  const [datasetColors, setDatasetColors] = useState<string[]>([]); // New state for dataset colors
  const [projectName, setProjectName] = useState<string>(''); // Add state for project name
  const [selectedFile1, setSelectedFile1] = useState<string>('');
  const [selectedColumn1, setSelectedColumn1] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [selectedFile2, setSelectedFile2] = useState<string>('');
  const [selectedColumn2, setSelectedColumn2] = useState<string>('');

  // Define operator options
  const operatorOptions = ['=', '>', '<'];

  // Function to get column names based on selected file
  const getColumnNames = (fileName: string) => {
    const dataset = datasets.find(dataset => dataset.fileName === fileName);
    return dataset ? dataset.response.columns.map(column => column.columnName) : [];
  };

  useEffect(() => {
    const storedFileName = sessionStorage.getItem('fileName');
    const storedUploadResponse = sessionStorage.getItem('uploadResponse');
    const storedRelationId = sessionStorage.getItem('datasetRelationId');

    console.log('Retrieved from sessionStorage:', {
      storedFileName,
      storedUploadResponse,
      storedRelationId,
    });

    if (storedFileName) {
      setFileName(storedFileName);
    }
    if (storedUploadResponse) {
      try {
        const parsedResponse = JSON.parse(storedUploadResponse);
        setDatasets([{
          fileName: storedFileName || '',
          response: parsedResponse,
          color: `hsl(${Math.random() * 360}, 100%, 90%)`
        }]);
      } catch (error) {
        console.error('Error parsing upload response:', error);
      }
    }

    if (storedRelationId) {
      setLastRelationId(storedRelationId);
    }
  }, []);
 
  useEffect(() => {
    // Check if all datasets are not edited
    const allUpdated = editedDatasets.every((edited) => !edited);
    setIsUpdated(allUpdated);
  }, [editedDatasets]);
 
  useEffect(() => {
    const storedRelationId = sessionStorage.getItem('datasetRelationId');
    if (storedRelationId) {
      setDatasetRelationId(storedRelationId);
      console.log('Retrieved datasetRelationId from sessionStorage:', storedRelationId);
    }
  }, []);
 
  const handleAddDatasetClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
 
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        console.log('Current datasetRelationId before upload:', datasetRelationId);

        // Convert null to undefined for the uploadFile function
        const response = await uploadFile(file, datasetRelationId ?? undefined);

        const color = `hsl(${Math.random() * 360}, 100%, 90%)`; // Generate color
        const newDataset = {
          fileName: file.name,
          response: {
            ...response,
            dataset_relation_id: response.dataset_relation_id // Ensure the relation ID is set
          },
          color: color
        };
        setDatasets((prevDatasets) => {
          const updatedDatasets = [...prevDatasets, newDataset];
          sessionStorage.setItem('datasets', JSON.stringify(updatedDatasets)); // Store all datasets in session
          return updatedDatasets;
        });

        setDatasetColors((prevColors) => [...prevColors, color]); // Save the color

        console.log(`Added dataset - Dataset ID: ${response.datasetId}, Using Initial Relation ID: ${response.dataset_relation_id}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };
 
  const handleRemoveDataset = (index: number) => {
    setDatasetToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDataset = () => {
    if (datasetToDelete !== null) {
      setDatasets((prevDatasets) => {
        const updatedDatasets = prevDatasets.filter((_, i) => i !== datasetToDelete);
        
        // Update session storage with the new datasets
        sessionStorage.setItem('datasets', JSON.stringify(updatedDatasets));

        if (updatedDatasets.length === 0) {
          sessionStorage.clear();
          router.push('/upload');
        }

        return updatedDatasets;
      });
      setDatasetToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };
 
  const handleColumnChange = (datasetIndex: number, columnIndex: number, field: string, value: string) => {
    const updatedColumns = [...datasets[datasetIndex].response.columns];
    updatedColumns[columnIndex][field] = value;
    const updatedDatasets = [...datasets];
    updatedDatasets[datasetIndex].response.columns = updatedColumns;
    setDatasets(updatedDatasets);

    // Mark the specific column as edited
    setEditedColumns((prevEdited) => ({
      ...prevEdited,
      [datasetIndex]: {
        ...prevEdited[datasetIndex],
        [columnIndex]: true,
      },
    }));

    // Mark the specific dataset as edited
    setEditedDatasets((prevEdited) => {
      const newEdited = [...prevEdited];
      newEdited[datasetIndex] = true;
      return newEdited;
    });
    setIsUpdated(false);
  };
 
  const handleUpdateClick = async (datasetIndex: number) => {
    const dataset = datasets[datasetIndex].response;
    try {
        const updatedData = await updateDataset({
            datasetDescription: dataset.datasetDescription,
            columns: dataset.columns,
            datasetName: dataset.datasetName,
            datasetId: dataset.datasetId ?? '',
            dataset_relation_id: dataset.dataset_relation_id ?? '',
        });

        // Print the response data to the console
        console.log('PUT response:', updatedData);

        // Mark the dataset as updated
        setEditedDatasets((prevEdited) => {
            const newEdited = [...prevEdited];
            newEdited[datasetIndex] = false;
            return newEdited;
        });

        // Save the updated datasets to sessionStorage
        sessionStorage.setItem('datasets', JSON.stringify(datasets));

    } catch (error) {
        console.error('Error updating dataset:', error);
    }
  };
 
  const handleRefreshDataset = (datasetIndex: number) => {
    setSpinningRefresh((prevSpinning) => {
      const newSpinning = [...prevSpinning];
      newSpinning[datasetIndex] = true;
      return newSpinning;
    });

    // Logic to refresh the dataset
    console.log(`Refreshing dataset at index ${datasetIndex}`);

    // Simulate a delay for the refresh action
    setTimeout(() => {
      setSpinningRefresh((prevSpinning) => {
        const newSpinning = [...prevSpinning];
        newSpinning[datasetIndex] = false;
        return newSpinning;
      });
    }, 1000); // Adjust the timeout duration as needed
  };
 
  const handleToggleCollapse = (datasetIndex: number) => {
    setCollapsedDatasets((prevCollapsed) => {
      const newCollapsed = [...prevCollapsed];
      newCollapsed[datasetIndex] = !newCollapsed[datasetIndex];
      return newCollapsed;
    });
  };
 
  const handleContinueClick = async () => {
    if (isUpdated) {
        setLoading(true);
        try {
            const storedDatasets = sessionStorage.getItem('datasets');
            const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
            const projectName = projectNameInput?.value || '';

            if (storedDatasets) {
                const parsedDatasets = JSON.parse(storedDatasets);

                // Extract only the response part of each dataset
                const responses = parsedDatasets.map((dataset: any) => dataset.response);

                // Log the responses being sent
                console.log('Responses being sent to continue API:', responses);

                // Create the payload with the new structure
                const payload = {
                    name: projectName,
                    data: responses
                };

                // Send the payload to the continue API
                const response = await postDatasetChart(payload);
                console.log('Continue API response:', response);

                sessionStorage.setItem('continueApiResponse', JSON.stringify(response));

                router.push('/generate');
            }
        } catch (error) {
            console.error('Error posting dataset chart:', error);
        } finally {
            setLoading(false);
        }
    }
  };
 
  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProjectName = event.target.value;
    setProjectName(newProjectName);
    sessionStorage.setItem('projectName', newProjectName); // Store project name in sessionStorage
  };
 
  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: 'Poppins' }}>
      {/* Header */}
      <Header />
 
      {/* Main Content */}
      <div className="flex-grow p-4 sm:p-6 lg:p-12" style={{ background: "linear-gradient(135deg, #bfdbfe, #ffffff, #dbeafe)" }}>
        <div className="max-w-4xl sm:max-w-7xl mx-auto space-y-8 sm:space-y-10 mt-6 sm:mt-8 lg:mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-center sm:text-left text-gray-800">
              Dataset Configuration
            </h1>
            <ButtonNew
              onClick={handleAddDatasetClick}
              variant="outline"
              size="lg"
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-yellow-200 hover:bg-yellow-300 focus:ring-2 focus:ring-blue-500">
              <Upload className="h-5 w-5" />
              Add Dataset
            </ButtonNew>
          </div>

          {/* Add Project Name Input */}
          <div className="mt-4">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name: <span className="text-red-500">*</span>
            </label>
            <Input
              id="projectName"
              type="text"
              placeholder="Enter project name"
              className="mt-1 block w-full p-2 border border-white-900 rounded-xl bg-white placeholder:text-gray-400"
              required
              value={projectName}
              onChange={handleProjectNameChange}
            />
          </div>
 
          {datasets.map((dataset, datasetIndex) => (
            <div key={datasetIndex} className="bg-white shadow-lg rounded-xl p-4 sm:p-6 space-y-4 relative">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center">
                  <h2
                    className="text-base sm:text-lg font-medium text-gray-700 py-2 px-4 rounded-md flex items-center"
                    style={{ backgroundColor: dataset.color }}
                  >
                    {dataset.response.datasetName || 'Unnamed Dataset'}
                    <Button
                      onClick={() => handleRefreshDataset(datasetIndex)}
                      variant="ghost"
                      size="sm"
                      className={`ml-0 text-gray-500 hover:text-gray-700 px-1 ${spinningRefresh[datasetIndex] ? 'animate-spin' : ''}`}>
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </h2>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <Button
                    onClick={() => handleToggleCollapse(datasetIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700">
                    {collapsedDatasets[datasetIndex] ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                  </Button>
                  {/* {editedDatasets[datasetIndex] && (
                    <ButtonNew
                      onClick={() => handleUpdateClick(datasetIndex)}
                      variant="outline"
                      size="md"
                      rounded="full"
                      className="text-blue-500 hover:text-blue-700 mr-2 bg-blue-100 hover:bg-blue-200">
                      Update
                    </ButtonNew>
                  )} */}
                  <Button
                    onClick={() => handleRemoveDataset(datasetIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700">
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {!collapsedDatasets[datasetIndex] && (
                <div className="space-y-4 relative">
                  <h3 className="text-gray-600 font-semibold">Dataset Description</h3>
                  <div className="relative">
                    <textarea
                      readOnly
                      placeholder="No description available"
                      className="w-full h-28 p-4 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                      value={dataset.response.datasetDescription || ''}
                    />
                    <div className="absolute top-2 right-2 spinner">
                      <div></div>
                    </div>
                  </div>
                  <table className="min-w-full border-t border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="py-3 px-4 text-left">Column Name</th>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-left">Data Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.response.columns.map((column: any, index: number) => (
                        <tr key={index} className="border-t relative">
                          <td className="py-3 px-4 text-gray-700 relative">
                            {column.columnName}
                          </td>
                          <td className="py-3 px-4 relative">
                            <Input
                              defaultValue={column.columnDescription}
                              className="focus:border-black"
                              onChange={(e) => handleColumnChange(datasetIndex, index, 'columnDescription', e.target.value)}
                            />
                            {!editedColumns[datasetIndex]?.[index] && (
                              <div className="absolute top-2 right-2 spinner">
                                <div></div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 relative">
                            <Input
                              defaultValue={column.columnDataDescription}
                              className="focus:border-black"
                              onChange={(e) => handleColumnChange(datasetIndex, index, 'columnDataDescription', e.target.value)}
                            />
                            {!editedColumns[datasetIndex]?.[index] && (
                              <div className="absolute top-2 right-2 spinner">
                                <div></div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
 
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/upload">
              <ButtonNew
                variant="outline"
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Back
              </ButtonNew>
            </Link>
            <div className="flex items-center gap-4">
              {datasets.length >= 2 && (
                <Button
                  onClick={() => setIsRelationModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 rounded-xl">
                  Relation
                </Button>
              )}
              {isUpdated && projectName && (
                <ButtonNew
                  onClick={handleContinueClick}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </ButtonNew>
              )}
              {!isUpdated && (
                <ButtonNew
                  onClick={() => datasets.forEach((_, index) => handleUpdateClick(index))}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Update
                </ButtonNew>
              )}
            </div>
          </div>
 
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".csv, .xlsx"
          />
 
          {loading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
 
      {/* Relation Modal */}
      <Modal isOpen={isRelationModalOpen} onClose={() => setIsRelationModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Enter Relation</h3>
        <div className="space-y-4">
          {/* First Dropdown: File Names */}
          <select
            value={selectedFile1}
            onChange={(e) => setSelectedFile1(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select File</option>
            {datasets.map((dataset, index) => (
              <option key={index} value={dataset.fileName}>{dataset.fileName}</option>
            ))}
          </select>

          {/* Second Dropdown: Column Names of Selected File */}
          <select
            value={selectedColumn1}
            onChange={(e) => setSelectedColumn1(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            disabled={!selectedFile1}
          >
            <option value="">Select Column</option>
            {getColumnNames(selectedFile1).map((columnName, index) => (
              <option key={index} value={columnName}>{columnName}</option>
            ))}
          </select>

          {/* Third Dropdown: Operators */}
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Operator</option>
            {operatorOptions.map((operator, index) => (
              <option key={index} value={operator}>{operator}</option>
            ))}
          </select>

          {/* Fourth Dropdown: File Names */}
          <select
            value={selectedFile2}
            onChange={(e) => setSelectedFile2(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select File</option>
            {datasets.map((dataset, index) => (
              <option key={index} value={dataset.fileName}>{dataset.fileName}</option>
            ))}
          </select>

          {/* Fifth Dropdown: Column Names of Selected File */}
          <select
            value={selectedColumn2}
            onChange={(e) => setSelectedColumn2(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            disabled={!selectedFile2}
          >
            <option value="">Select Column</option>
            {getColumnNames(selectedFile2).map((columnName, index) => (
              <option key={index} value={columnName}>{columnName}</option>
            ))}
          </select>
        </div>
      </Modal>
 
      {/* New Delete Confirmation Modal */}
      <NewModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteDataset}
        message="Are you sure you want to delete this dataset?"
      />
 
      {/* Footer */}
      <Footer />
    </div>
  );
}