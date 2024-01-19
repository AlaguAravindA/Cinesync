import React from 'react'

export default function Search() {
  return (
    <div>s
        <div className="flex items-center justify-center min-h-screen">
    <div className="bg-white p-8 rounded shadow-lg w-96">
      <input
        type="text"
        className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
        placeholder="Search..."
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      >
        Search
      </button>
    </div>
  </div>
  </div>
  )
}
