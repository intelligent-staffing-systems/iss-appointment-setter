'use client';

import { useState } from 'react';
import Papa from 'papaparse'; // CSV parsing
import * as XLSX from 'xlsx'; // Excel parsing
import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function UploadPage() {
  const [data, setData] = useState<any[]>([]); // Data parsed from the file
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // Items moved to the right side
  const [uploadMessage, setUploadMessage] = useState('');
  const [callInProgress, setCallInProgress] = useState<number | null>(null); // Track which call is in progress
  const [callLogs, setCallLogs] = useState<any[]>([]); // Call log after calls
  const [expandedLog, setExpandedLog] = useState<number | null>(null); // Toggle call log details

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      setUploadMessage(`Uploading ${file.name}...`);

      if (fileType === 'csv') {
        // Parse CSV file
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            setData(results.data); // Set parsed data
            setUploadMessage('File uploaded successfully!');
          },
          error: (error) => {
            setUploadMessage(`Error uploading file: ${error.message}`);
          },
        });
      } else if (fileType === 'xlsx') {
        // Parse Excel file
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);
          setData(excelData);
          setUploadMessage('File uploaded successfully!');
        };
        reader.readAsArrayBuffer(file);
      } else {
        setUploadMessage('Unsupported file format. Please upload a CSV or Excel file.');
      }
    }
  };

  // Function to handle moving selected items to the right
  const handleMoveRight = (item: any) => {
    setSelectedItems([...selectedItems, item]); // Add item to right side
    setData(data.filter((d) => d !== item)); // Remove from left side
  };

  // Function to handle calling a contact
  const handleCall = (item: any, index: number) => {
    setCallInProgress(index); // Mark which call is in progress

    // Simulate the call duration
    setTimeout(() => {
      setCallInProgress(null); // Call completed
      setCallLogs([...callLogs, { ...item, time: new Date().toLocaleString() }]); // Add the contact to the call log
      setSelectedItems(selectedItems.filter((d) => d !== item)); // Remove from selected items (right panel)
    }, 2000); // Simulate a 2-second call duration
  };

  // Function to toggle log details
  const toggleLogDetails = (index: number) => {
    setExpandedLog(expandedLog === index ? null : index); // Toggle log view
  };

  return (
    <div className="flex h-full bg-gray-100 p-6 space-x-6">
      {/* Left Side (Uploaded Data) */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Uploaded Data</h2>

        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

          {uploadMessage && <p className="text-sm font-semibold mt-2 text-gray-700">{uploadMessage}</p>}

          {/* Display uploaded data */}
          {data.length > 0 && (
            <div className="overflow-y-auto h-64 border border-gray-200 rounded-lg p-2">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b border-gray-300"
                >
                  <span>{item.first_name || item.name} {item.last_name || ''}</span>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => handleMoveRight(item)}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side (Selected Items) */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Selected Data</h2>

        <div className="overflow-y-auto h-64 border border-gray-200 rounded-lg p-2">
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                <span>{item.first_name || item.name} {item.last_name || ''}</span>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                  onClick={() => handleCall(item, index)}
                  disabled={callInProgress === index}
                >
                  {callInProgress === index ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <FaPhoneAlt />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No items selected.</p>
          )}
        </div>

        {/* Call Logs */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800">Call Log</h3>
          <div className="mt-4 border-t border-gray-300 pt-4">
            {callLogs.length > 0 ? (
              callLogs.map((log, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <span>
                    Called {log.first_name || log.name} {log.last_name || ''} successfully at {log.time}
                  </span>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => toggleLogDetails(index)}
                  >
                    Log
                  </button>

                  {expandedLog === index && (
                    <div className="mt-2 p-2 border rounded-lg bg-gray-100">
                      <p><strong>Call Details:</strong></p>
                      <p>Name: {log.first_name || log.name} {log.last_name || ''}</p>
                      <p>Time: {log.time}</p>
                      <p>Additional details could go here...</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No calls logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
