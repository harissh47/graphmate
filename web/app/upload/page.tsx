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

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isDatabasePopupOpen, setIsDatabasePopupOpen] = useState(false);
  const [datasetRelationId, setDatasetRelationId] = useState<string | null>(null); // Initialize as null

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
        // Do not pass datasetRelationId for the initial upload
        const response = await uploadFile(file);

        // Set the datasetRelationId from the response if it's the first upload
        if (!datasetRelationId) {
          setDatasetRelationId(response.dataset_relation_id);
          sessionStorage.setItem("datasetRelationId", response.dataset_relation_id); // Store in sessionStorage
        }

        // Ensure the response is not undefined before storing
        if (response) {
          sessionStorage.setItem("uploadResponse", JSON.stringify(response));
          sessionStorage.setItem("datasetId", response.datasetId);

          // Create and store the datasets key in sessionStorage
          const datasets = [{
            fileName: file.name,
            response: response,
            color: `hsl(${Math.random() * 360}, 100%, 90%)`
          }];
          sessionStorage.setItem("datasets", JSON.stringify(datasets));

          // Log datasetId and relationId in the console
          console.log(`Dataset ID: ${response.datasetId}, Initial Relation ID: ${response.dataset_relation_id}`);
        }

        // Process the file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0] as string[];

            // Store headers and file name in session storage for later use
            sessionStorage.setItem("fileHeaders", JSON.stringify(headers));
            sessionStorage.setItem("fileName", file.name);

            // Navigate to configuration page
            router.push("/configure");
          } catch (err) {
            setError("Error processing file. Ensure it is a valid Excel or CSV file.");
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        setError("Failed to upload file. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [router, datasetRelationId] // Add datasetRelationId to dependencies
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
    <div
      className="h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #bfdbfe, #ffffff, #dbeafe)" }}
    >
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto mt-8 sm:mt-20">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center">
              Upload Your Data
            </h1>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Flex container for drag-and-drop and database upload */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed rounded-xl p-6 sm:p-12 text-center cursor-pointer
                transition-colors duration-200
                ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="text-sm sm:text-base font-medium">Drag & drop your file here</p>
                <p className="text-xs sm:text-sm text-gray-600">or click to select a file</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Supported formats: Excel (.xlsx, .xls) and CSV
                </p>
              </div>
            </div>

            {/* Database Icon */}
            <div
              onClick={openDatabasePopup}
              className="flex-1 border-2 border-dashed rounded-xl p-6 sm:p-12 text-center cursor-pointer
                transition-colors duration-200 border-gray-300 hover:border-blue-500
              "
            >
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="text-sm sm:text-base font-medium">Database</p>
                <p className="text-xs sm:text-sm text-gray-600">Click to configure database connection</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}
        </div>
      </main>

      {/* Database Popup */}
      {isDatabasePopupOpen && <DatabasePopup onClose={closeDatabasePopup} />}

      {/* Footer */}
      <Footer />
    </div>
  );
}
