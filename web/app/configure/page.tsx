'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Upload, Trash, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
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
import { refreshDataset } from '../../components/api/refresh'; // Import the refresh function
import { useDatasetStore } from '../datastorage/dataStore';

// Add interface for column type
interface Column {
  columnName: string;
  column_name?: string;
  columnDescription?: string;
  column_description?: string;
  columnDataDescription?: string;
  column_data_description?: string;
  columnDataType?: string;
  column_data_type?: string;
}

export default function App() {
  const [fileName, setFileName] = useState<string>('');
  const storeDatasets = useDatasetStore((state) => state.datasets);
  const setStoreDatasets = useDatasetStore((state) => state.setDatasets);
  
  // Initialize datasets from store
  const [datasets, setDatasets] = useState<Array<{
    fileName: string;
    response: any;
    color: string;
  }>>(storeDatasets);

  // Update both local state and store when datasets change
  const updateDatasets = useCallback((newDatasets: Array<{
    fileName: string;
    response: any;
    color: string;
  }>) => {
    setDatasets(newDatasets);
    setStoreDatasets(newDatasets);
  }, [setStoreDatasets]);

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
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Define operator options
  const operatorOptions = ['=', '>', '<'];

  // Add new state for managing multiple relations
  const [relations, setRelations] = useState<{
    file1: string;
    column1: string;
    operator: string;
    file2: string;
    column2: string;
  }[]>([]);

  // Add new state to store table names
  const [tableNames, setTableNames] = useState<{ [key: string]: string }>({});

  // Add new state for error message
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Update the getColumnNames function
  const getColumnNames = (fileName: string) => {
    const dataset = datasets.find(dataset => dataset.fileName === fileName);
    return dataset ? dataset.response.columns.map((column: Column) => column.columnName || column.column_name || '') : [];
  };

  useEffect(() => {
    // Check if all datasets are not edited
    const allUpdated = editedDatasets.every((edited) => !edited);
    setIsUpdated(allUpdated);
  }, [editedDatasets]);
 
  useEffect(() => {
    // Remove sessionStorage usage
    if (datasetRelationId) {
      //console.log('Using datasetRelationId:', datasetRelationId);
    }
  }, [datasetRelationId]);
 
  useEffect(() => {
    // Check if there are no datasets
    if (!datasets || datasets.length === 0) {
      //console.log('No datasets available - redirecting to upload page');
      router.push('/upload');
    }
  }, [datasets, router]);
 
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
        const response = await uploadFile(file, datasetRelationId ?? undefined);
        
        const newDataset = {
          fileName: file.name,
          response: {
            ...response,
            dataset_relation_id: response.dataset_relation_id,
            table_name: response.table_name || '',
            db_type: response.db_type || '',
            columns: response.columns.map((column: any) => ({
              columnName: column.columnName || column.column_name || '',
              columnDescription: column.columnDescription || column.column_description || '',
              columnDataDescription: column.columnDataDescription || column.column_data_description || '',
              columnDataType: column.columnDataType || column.column_data_type || ''
            }))
          },
          color: `hsl(${Math.random() * 360}, 100%, 90%)`
        };

        updateDatasets([...datasets, newDataset]);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };
 
  const handleRemoveDataset = (index: number) => {
    const datasetToRemove = datasets[index];
    
    // Filter out relations that include the removed dataset
    setRelations(prevRelations => 
        prevRelations.filter(relation => 
            relation.file1 !== datasetToRemove.fileName && 
            relation.file2 !== datasetToRemove.fileName
        )
    );

    setDatasetToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDataset = () => {
    if (datasetToDelete !== null) {
      const updatedDatasets = datasets.filter((_, i) => i !== datasetToDelete);
      updateDatasets(updatedDatasets);
      
      // If no datasets remain after deletion, redirect to upload page
      if (updatedDatasets.length === 0) {
        router.push('/upload');
      }
      
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

        //console.log('PUT response:', updatedData);

        setEditedDatasets((prevEdited) => {
            const newEdited = [...prevEdited];
            newEdited[datasetIndex] = false;
            return newEdited;
        });

        // Update the datasets in Zustand store instead of sessionStorage
        updateDatasets([...datasets]);

    } catch (error) {
        console.error('Error updating dataset:', error);
    }
  };
 
  const handleRefreshDataset = async (datasetIndex: number) => {
    setSpinningRefresh((prevSpinning) => {
      const newSpinning = [...prevSpinning];
      newSpinning[datasetIndex] = true;
      return newSpinning;
    });

    try {
      const dataset = datasets[datasetIndex];
      const { datasetId = '', dataset_relation_id = '' } = dataset.response;

      const refreshedData = await refreshDataset(datasetId, dataset_relation_id);
      //console.log('Received refreshed data:', refreshedData);

      const updatedDatasets = datasets.map((currentDataset, index) => {
        if (index === datasetIndex) {
          return {
            ...currentDataset,
            response: {
              ...refreshedData,
              datasetId,
              dataset_relation_id,
              columns: refreshedData.columns.map((column: any) => ({
                columnName: column.columnName || column.column_name || '',
                columnDescription: column.columnDescription || column.column_description || '',
                columnDataDescription: column.columnDataDescription || column.column_data_description || '',
                ...column
              }))
            }
          };
        }
        return currentDataset;
      });

      // Update Zustand store instead of sessionStorage
      updateDatasets(updatedDatasets);

      // Reset edited states
      setEditedColumns(prev => ({
        ...prev,
        [datasetIndex]: {}
      }));

      setEditedDatasets(prev => {
        const newEdited = [...prev];
        newEdited[datasetIndex] = false;
        return newEdited;
      });

      setLastUpdateTime(Date.now());

    } catch (error) {
      console.error('Error refreshing dataset:', error);
    } finally {
      setSpinningRefresh((prevSpinning) => {
        const newSpinning = [...prevSpinning];
        newSpinning[datasetIndex] = false;
        return newSpinning;
      });
    }
  };
 
  const handleToggleCollapse = (datasetIndex: number) => {
    setCollapsedDatasets((prevCollapsed) => {
      const newCollapsed = [...prevCollapsed];
      newCollapsed[datasetIndex] = !newCollapsed[datasetIndex];
      return newCollapsed;
    });
  };
 
  const handleContinueClick = async () => {
    if (isUpdated && projectName) {
        setLoading(true);
        setErrorMessage('');
        try {
            // Format relations into required string format
            const formattedRelations = relations
                .map(formatRelationString)
                .filter(relation => relation !== '');

            // Create the payload with the new structure
            const payload = {
                project_name: projectName,
                dataset_relation: formattedRelations,
                data: datasets.map(dataset => ({
                    datasetDescription: dataset.response.datasetDescription || '',
                    columns: dataset.response.columns.map((column: Column) => ({
                        columnName: column.columnName || column.column_name || '',
                        columnDescription: column.columnDescription || column.column_description || '',
                        columnDataDescription: column.columnDataDescription || column.column_data_description || '',
                        columnDataType: column.columnDataType || column.column_data_type || ''
                    })),
                    datasetName: dataset.response.datasetName || '',
                    datasetId: dataset.response.datasetId || '',
                    dataset_relation_id: dataset.response.dataset_relation_id || '',
                    table_name: dataset.response.table_name || '',
                    db_type: dataset.response.db_type || ''
                }))
            };

            //console.log('Payload being sent to continue API:', payload);
            const response = await postDatasetChart(payload);
            //console.log('Response from continue API:', response);
            
            // Store the response in the global state regardless of format
            useDatasetStore.getState().setContinueApiResponse(response);
            useDatasetStore.getState().setProjectName(projectName);
            
            router.push('/generate');
        } catch (error: any) {
            console.error('Error posting dataset chart:', error);
            if (error.message?.includes('Project name') && error.message?.includes('already exists')) {
                setErrorMessage('Project name already exists. Please choose a different name.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setErrorMessage('An error occurred while processing your request.');
            }
        } finally {
            setLoading(false);
        }
    }
  };
 
  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };
 
  // Add this function to handle adding new relation
  const addNewRelation = () => {
    setRelations([...relations, {
      file1: '',
      column1: '',
      operator: '',
      file2: '',
      column2: ''
    }]);
  };

  // Add this function to handle removing a relation
  const removeRelation = (index: number) => {
    const newRelations = relations.filter((_, i) => i !== index);
    setRelations(newRelations);
  };

  // Add this function to update a specific relation
  const updateRelation = (index: number, field: string, value: string) => {
    const newRelations = [...relations];
    newRelations[index] = {
      ...newRelations[index],
      [field]: value
    };
    setRelations(newRelations);
  };

  // Add function to format relation string
  const formatRelationString = (relation: {
    file1: string;
    column1: string;
    file2: string;
    column2: string;
  }) => {
    const dataset1 = datasets.find(d => d.fileName === relation.file1);
    const dataset2 = datasets.find(d => d.fileName === relation.file2);
    
    if (!dataset1 || !dataset2) return '';

    const table1 = dataset1.response.table_name;
    const table2 = dataset2.response.table_name;

    return `${table1}.${relation.column1} = ${table2}.${relation.column2}`;
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
            <label htmlFor="projectName" className="block text-base font-medium text-gray-700">
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
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}
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
                    <tbody key={`${datasetIndex}-${lastUpdateTime}`}>
                      {dataset.response.columns.map((column: any, index: number) => (
                        <tr key={`${index}-${lastUpdateTime}`} className="border-t relative">
                          <td className="py-3 px-4 text-gray-700 relative">
                            {column.columnName || column.column_name}
                          </td>
                          <td className="py-3 px-4 relative">
                            <Input
                              key={`desc-${index}-${lastUpdateTime}`}
                              value={column.columnDescription || column.column_description || ''}
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
                              key={`data-desc-${index}-${lastUpdateTime}`}
                              value={column.columnDataDescription || column.column_data_description || ''}
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
            accept=".csv, .xls, .xlsx"
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
        <div className="px-6 w-[800px]">
          <h3 className="text-2xl font-semibold mb-8 text-gray-800">Dataset Relations</h3>
          <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4">
            {relations.map((relation, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm relative">
                <button 
                  onClick={() => removeRelation(index)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-5 gap-4 items-end">
                    {/* First File and Column Group */}
                    <div className="space-y-3 col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Dataset 1</label>
                      <select
                        value={relation.file1}
                        onChange={(e) => updateRelation(index, 'file1', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select dataset</option>
                        {datasets.map((dataset, i) => (
                          <option key={i} value={dataset.fileName}>{dataset.fileName}</option>
                        ))}
                      </select>

                      <select
                        value={relation.column1}
                        onChange={(e) => updateRelation(index, 'column1', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={!relation.file1}
                      >
                        <option value="">Select column</option>
                        {getColumnNames(relation.file1).map((columnName: string, i: number) => (
                          <option key={i} value={columnName}>{columnName}</option>
                        ))}
                      </select>
                    </div>

                    {/* Centered Equals Sign */}
                    <div className="flex justify-center items-center">
                      <span className="text-2xl font-medium text-gray-600">=</span>
                    </div>

                    {/* Second File and Column Group */}
                    <div className="space-y-3 col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Dataset 2</label>
                      <select
                        value={relation.file2}
                        onChange={(e) => updateRelation(index, 'file2', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select dataset</option>
                        {datasets
                          .filter(dataset => dataset.fileName !== relation.file1) // Exclude selected Dataset 1
                          .map((dataset, i) => (
                            <option key={i} value={dataset.fileName}>{dataset.fileName}</option>
                          ))}
                      </select>

                      <select
                        value={relation.column2}
                        onChange={(e) => updateRelation(index, 'column2', e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={!relation.file2}
                      >
                        <option value="">Select column</option>
                        {getColumnNames(relation.file2).map((columnName: string, i: number) => (
                          <option key={i} value={columnName}>{columnName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addNewRelation}
              className="w-full p-3 mt-6 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              {relations.length === 0 ? 'Add Relation' : 'Add Another Relation'}
            </button>
          </div>
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