// web/app/upload/DatabasePopup.tsx
'use client'

import React, { useState } from 'react';
import postgresIcon from './assets/postgres.png';
import mysqlIcon from './assets/mysql.png';
import sqliteIcon from './assets/sqlite.png';

interface DatabasePopupProps {
  onClose: () => void;
}

const DATABASES = [
  { name: 'PostgreSQL', icon: postgresIcon },
  { name: 'MySQL', icon: mysqlIcon },
  { name: 'SQLite', icon: sqliteIcon },
];

const DatabasePopup: React.FC<DatabasePopupProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDatabaseClick = (dbName: string) => {
    setSelectedDatabase(dbName);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0 relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Connect to Database</h2>
            {!selectedDatabase && (
              <>
                <p className="mb-4">Select a database to connect:</p>
                <div className="flex justify-around mb-6">
                  {DATABASES.map((db) => (
                    <div
                      key={db.name}
                      className="relative text-center cursor-pointer mx-2"
                      onClick={() => handleDatabaseClick(db.name)}
                    >
                      <img
                        src={db.icon.src}
                        alt={`${db.name} icon`}
                        className="w-full h-auto rounded-2xl"
                      />
                      {/* <p className="absolute inset-0 flex justify-center items-center text-center text-white font-bold">{db.name}</p> */}
                    </div>
                  ))}
                </div>
              </>
            )}
            {selectedDatabase && (
              <>
                <h3 className="text-lg font-semibold mb-2">Connect to {selectedDatabase}</h3>
                <p className="mb-4">Enter the required {selectedDatabase} credentials:</p>
                <form>
                  <p className="w-full mb-3 p-2 border rounded bg-gray-100">{selectedDatabase}</p>
                  <input
                    type="text"
                    placeholder="Host"
                    className="w-full mb-3 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Port"
                    className="w-full mb-3 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Database Name"
                    className="w-full mb-3 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full mb-3 p-2 border rounded"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-3 p-2 border rounded"
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedDatabase(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                      aria-label="Back"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      aria-label="Connect"
                    >
                      Connect
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePopup;