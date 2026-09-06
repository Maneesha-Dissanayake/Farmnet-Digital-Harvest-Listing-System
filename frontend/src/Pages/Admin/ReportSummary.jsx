import React, { useState, useEffect } from 'react';
import Sidebar from './Components/AdminSidebar';
import { Download, FileText, Users, ShieldCheck, Layers, Calendar } from 'lucide-react';

const PlatformReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReportData();
  }, []);

  // Fetch summary report data from backend with authorization headers
  const fetchReportData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/reports/summary', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger browser print dialog to save as PDF
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-600 font-medium">Generating Report...</div>;
  }

  const stats = reportData?.stats || {};

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      
      {/* Sidebar hidden during print using Tailwind print utility */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col overflow-y-auto print:bg-white print:p-0">
        
        {/* Header (Hidden when printing) */}
        <header className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 print:hidden">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">Platform Summary Report</h1>
            <p className="text-gray-500 text-sm mt-1">Comprehensive analytics and system performance overview.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#22c55e] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Download size={18} /> Download / Print PDF
          </button>
        </header>

        {/* Printable Report Container */}
        <div className="p-8 max-w-5xl w-full mx-auto print:p-4 print:max-w-none">
          
          {/* Report Title / Letterhead for Print */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm print:border-none print:shadow-none">
            
            <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">FarmNet Admin Intelligence</h2>
                <p className="text-sm text-gray-500 mt-1">Official Platform Activity & Growth Report</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Generated On:</p>
                <p className="text-sm font-semibold text-gray-700">
                  {reportData?.generatedAt ? (
                    `${new Date(reportData.generatedAt).toLocaleDateString()} ${new Date(reportData.generatedAt).toLocaleTimeString()}`
                  ) : (
                    'Loading date...'
                  )}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                  <Users size={22} />
                  <span className="text-sm font-bold uppercase tracking-wider">Total Users</span>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalUsers || 0}</h3>
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  +{stats.newUsersThisMonth || 0} joined this month
                </p>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <ShieldCheck size={22} />
                  <span className="text-sm font-bold uppercase tracking-wider">Active Listings</span>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900">{stats.activeAds || 0}</h3>
                <p className="text-xs text-blue-700 mt-2 font-medium">
                  +{stats.newAdsThisMonth || 0} ads posted this month
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
                <div className="flex items-center gap-3 text-amber-600 mb-2">
                  <Layers size={22} />
                  <span className="text-sm font-bold uppercase tracking-wider">Pending Moderation</span>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900">{stats.pendingAds || 0}</h3>
                <p className="text-xs text-amber-700 mt-2 font-medium">
                  Awaiting admin review
                </p>
              </div>

            </div>

            {/* Detailed Breakdown Table */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-gray-900 mb-4">Detailed Breakdown</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-600">Total Registered Sellers</td>
                      <td className="p-4 font-bold text-gray-900 text-right">{stats.totalSellers || 0}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-600">Total Registered Buyers</td>
                      <td className="p-4 font-bold text-gray-900 text-right">{stats.totalBuyers || 0}</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-600">Active Crop Categories</td>
                      <td className="p-4 font-bold text-gray-900 text-right">{stats.totalCategories || 0}</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-gray-600">Pending Advertisement Queue</td>
                      <td className="p-4 font-bold text-gray-900 text-right">{stats.pendingAds || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report Footer Note */}
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
              <p>FarmNet Platform Automated Audit Report. Confidential System Document.</p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default PlatformReport;