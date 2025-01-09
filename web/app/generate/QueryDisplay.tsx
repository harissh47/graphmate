'use client';

import { useState } from 'react';
import copy from './assets/copy.png';

interface QueryDisplayProps {
    query: string;
    isPromptSelected: boolean;
}

export default function QueryDisplay({ query, isPromptSelected }: QueryDisplayProps) {
    const [showToast, setShowToast] = useState(false);

    // Function to strip the date suffix from the query
    const stripDateSuffix = (query: string) => {
        return query.replace(/(_\d{8}_\d{6})/g, '');
    };

    // Function to copy the query to the clipboard
    const copyToClipboard = () => {
        const cleanedQuery = stripDateSuffix(query);
        navigator.clipboard.writeText(cleanedQuery).then(() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000); // Hide toast after 2 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="w-full bg-gray-900 rounded-xl overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">SQL Query</span>
                <div className="relative flex space-x-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <button onClick={copyToClipboard} className="ml-2 text-gray-400 hover:text-white relative">
                        <img src={copy.src} className="h-5 w-5" alt="Copy Icon" />
                        {/* Popup Toast */}
                        {showToast && (
                            <div className="absolute top-full mt-1 left--5 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity duration-300">
                                ✅ Copied!
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Query Display Section */}
            <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto">
                {isPromptSelected ? stripDateSuffix(query) : 'Select a prompt to view SQL query'}
            </pre>
        </div>
    );
}
