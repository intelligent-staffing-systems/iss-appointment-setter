import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSession } from 'next-auth/react'; // Assuming you use next-auth for session handling

// Function to upload selected items to the backend
async function uploadCustomers(userId: string, customers: any[]) {
  console.log('Data being sent to backend:', { user_id: userId, customers }); // Log data sent to the backend

  try {
    const response = await fetch('http://localhost:3001/api/customers/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        customers,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Response from backend:', result); // Log the backend response
    return result;
  } catch (error) {
    console.error('Error uploading data:', error);
    return { status: 'Error', message: 'Failed to upload data' };
  }
}

export default function UploadPage() {
  const { data: session } = useSession(); // Use session hook to get user details
  const [data, setData] = useState<any[]>([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [backendMessages, setBackendMessages] = useState<string[]>([]); // Store messages from backend

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // Extract userId from session
    const userId = session?.userId;
    console.log('Extracted userId from session:', userId);

    if (file && userId) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      setUploadMessage(`Uploading ${file.name}...`);

      if (fileType === 'csv') {
        Papa.parse(file, {
          header: true,
          complete: async (results) => {
            console.log('Parsed CSV data:', results.data); // Log the parsed data
            setData(results.data);
            setUploadMessage('File uploaded successfully! Now sending data to the server...');
            const response = await uploadCustomers(userId, results.data); // Upload parsed data with user ID
            handleBackendResponse(response);
          },
          error: (error) => {
            setUploadMessage(`Error uploading file: ${error.message}`);
          },
        });
      } else if (fileType === 'xlsx') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);
          console.log('Parsed Excel data:', excelData); // Log the parsed data
          setData(excelData);
          setUploadMessage('File uploaded successfully! Now sending data to the server...');
          const response = await uploadCustomers(userId, excelData); // Upload parsed data with user ID
          handleBackendResponse(response);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setUploadMessage('Unsupported file format. Please upload a CSV or Excel file.');
      }
    } else {
      setUploadMessage('Please sign in to upload files or userId is missing.');
    }
  };

  // Handle the backend response and set messages
  const handleBackendResponse = (response: any) => {
    if (response.status === 'Success') {
      setUploadMessage(response.message);

      const added = response.added_customers?.map(
        (cust: { name: string; phone: string }) => `Customer ${cust.name} (${cust.phone}) added successfully.`
      ) || [];

      const duplicates = response.duplicate_customers?.map(
        (dup: { name: string; phone: string; message: string }) =>
          `Name: ${dup.name}, Phone: ${dup.phone}, Message: ${dup.message}`
      ) || [];

      setBackendMessages([...added, ...duplicates]);
    } else {
      setUploadMessage(`Error: ${response.message}`);
      const duplicates = response.duplicate_customers?.map(
        (dup: { name: string; phone: string; message: string }) =>
          `Name: ${dup.name}, Phone: ${dup.phone}, Message: ${dup.message}`
      ) || [];
      setBackendMessages(duplicates);
    }
  };

  return (
    <div className="flex h-full bg-gray-100 p-6 space-x-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload CSV/Excel File</h2>

        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

          {uploadMessage && <p className="text-sm font-semibold mt-2 text-gray-700">{uploadMessage}</p>}

          {/* Display Backend Messages */}
          {backendMessages.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
              <h3 className="font-semibold">Backend Messages:</h3>
              <ul className="list-disc ml-5">
                {backendMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
