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
  const [betaPassword, setBetaPassword] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (betaPassword === '2025') {
      setIsVerified(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleDatabaseClick = (dbName: string) => {
    setSelectedDatabase(dbName);
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all relative max-h-[95vh] overflow-y-auto scrollbar-hide">
            {!isVerified ? (
              <div className="p-6 sm:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Beta Access Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Please enter your beta access credentials to continue
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Beta Access Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={betaPassword}
                        onChange={(e) => setBetaPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-all duration-200 pl-10"
                        placeholder="Enter your password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Contact your administrator if you need access
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 
                             text-white font-medium transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             dark:focus:ring-offset-gray-800"
                  >
                    Verify Access
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedDatabase ? `Connect to ${selectedDatabase}` : 'Select Database'}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      BETA
                    </span>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {!selectedDatabase ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {DATABASES.map((db) => (
                      <button
                        key={db.name}
                        onClick={() => handleDatabaseClick(db.name)}
                        className="group relative p-6 sm:p-8 hover:bg-gray-50 dark:hover:bg-gray-700 
                                 transition-all duration-200 border-2 border-gray-200 dark:border-gray-600 
                                 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg"
                      >
                        <div className="flex flex-col items-center justify-center h-full space-y-3">
                          <img
                            src={db.icon.src}
                            alt={`${db.name} icon`}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain group-hover:scale-110 transition-transform duration-200"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {db.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <form className="flex flex-col flex-1">
                      <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                        {/* Host and Port row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Host
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter host"
                              required
                              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                       transition-all duration-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Port
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter port"
                              required
                              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                       transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Remaining fields */}
                        {['Database Name', 'Username', 'Password', 'Table Name'].map((field) => (
                          <div key={field} className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {field}
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type={field === 'Password' ? (showPassword ? 'text' : 'password') : 'text'}
                                placeholder={`Enter ${field.toLowerCase()}`}
                                required
                                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition-all duration-200"
                              />
                              {field === 'Password' && (
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                        <button
                          type="button"
                          onClick={() => setSelectedDatabase(null)}
                          className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                   text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                                   transition-colors duration-200 text-sm sm:text-base"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-4 sm:px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 
                                   text-white font-medium transition-colors duration-200 text-sm sm:text-base"
                        >
                          Connect
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePopup;