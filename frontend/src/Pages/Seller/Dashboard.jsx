import React from 'react'
import Sidebar from './Components/Sidebar'

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Harvest Listings</h1>
        {/* Backend listing cards go here */}
      </main>
    </div>
  )
}

export default Dashboard
