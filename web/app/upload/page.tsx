"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileUp, Database } from "lucide-react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Header from "../Header";
import Footer from "../Footer"; // Import your Footer component
import { uploadFile } from "../../components/api/uploadapi";
import DatabasePopup from "./DatabasePopup";
import { useDatasetStore } from '../datastorage/dataStore';

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isDatabasePopupOpen, setIsDatabasePopupOpen] = useState(false);
  const [datasetRelationId, setDatasetRelationId] = useState<string | null>(null);
  
  // Use useState for all state management
  const [uploadResponse, setUploadResponse] = useState<any>(null);
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Array<{
    fileName: string;
    response: any;
    color: string;
  }>>([]);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const recommendedFiles = [
    { name: 'Book_Dataset.xlsx', description: 'Basic data structure template', link: '/excel/Book_Dataset.xlsx' },
    { name: 'Book_(relation).xls', description: 'Advanced relation template', link: '/excel/Book(relation).xls' },
    { name: 'Employee_Dataset.xlsx', description: 'Basic data structure dataset', link: '/excel/Employee_Data.xlsx' },
  ];

  const addDataset = useDatasetStore((state) => state.addDataset);
  const clearDatasets = useDatasetStore((state) => state.clearDatasets);

  const toggleDatabasePopup = () => {
    setIsDatabasePopupOpen(!isDatabasePopupOpen);
  };

  const openDatabasePopup = () => {
    setIsDatabasePopupOpen(true);
  };

  const closeDatabasePopup = () => {
    setIsDatabasePopupOpen(false);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      try {
        // Clear existing datasets before adding new one
        clearDatasets();

        const response = await uploadFile(file);

        if (!datasetRelationId) {
          setDatasetRelationId(response.dataset_relation_id);
        }

        if (response) {
          const newDataset = {
            fileName: file.name,
            response: {
              ...response,
              datasetId: response.datasetId,
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

          // Add to global store
          addDataset(newDataset);
          
          // Navigate to configure page after successful upload
          router.push("/configure");
        }

        // Remove the file processing section since we already have the data from the API
        setFileName(file.name);

      } catch (err: any) {
        if (err.message?.includes('413') || err.message?.includes('REQUEST ENTITY TOO LARGE')) {
          setError("Dataset too large. Try a smaller one.");
        } else {
          setError("Failed to upload file. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [router, datasetRelationId, addDataset, clearDatasets]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #bfdbfe, #ffffff, #dbeafe)" }}>
      <Header />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto mt-16 sm:mt-12">
          <div className="flex justify-center items-center mb-8 sm:mb-12">
            <h1 className="text-xl sm:text-3xl font-semibold text-center">
              Upload Your Data
            </h1>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Flex container for drag-and-drop and database upload */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"}
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm sm:text-base font-medium">Drag & drop your file here</p>
                <p className="text-xs sm:text-sm text-gray-600">or click to select a file</p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: Excel (.xlsx, .xls) and CSV
                </p>
              </div>
            </div>

            {/* Database Icon */}
            <div
              onClick={openDatabasePopup}
              className="flex-1 border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer
                transition-colors duration-200 border-gray-300 hover:border-blue-500
              "
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm sm:text-base font-medium">Database</p>
                <p className="text-xs sm:text-sm text-gray-600">Click to configure database connection</p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PostgreSQL, MySQL, and SQLite
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Recommended Files Section */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4">Demo Dataset</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recommendedFiles.map((file, index) => (
                <a
                  key={index}
                  href={file.link}
                  download
                  className="block p-3 sm:p-4 border rounded-lg hover:border-blue-500 transition-colors duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <FileUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Database Popup */}
      {isDatabasePopupOpen && <DatabasePopup onClose={closeDatabasePopup} />}

      <Footer />
    </div>
  );
}
