import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from './Components/Sidebar'

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8">
       <Outlet />
      </main>
    </div>
  )
}

export default Dashboard;
