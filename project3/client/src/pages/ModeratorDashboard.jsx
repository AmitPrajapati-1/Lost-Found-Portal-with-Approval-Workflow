import React, { useState } from 'react';
import { useItems } from '../context/ItemsContext';
import { Shield, Clock, CheckCircle, XCircle, BarChart3, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ModeratorDashboard() {
  const { state, getItemsByStatus, updateItemStatus, deleteItem } = useItems();
  const [activeTab, setActiveTab] = useState('pending');

  const pendingItems = getItemsByStatus('PendingApproval');
  const approvedItems = getItemsByStatus('Approved');
  const claimedItems = getItemsByStatus('Claimed');

  const handleApprove = (itemId) => {
    updateItemStatus(itemId, 'Approved');
  };

  const handleReject = (itemId) => {
    deleteItem(itemId);
  };

  const stats = {
    pending: pendingItems.length,
    approved: approvedItems.length,
    claimed: claimedItems.length,
    total: state.items.length,
  };

  // Moderator item card component
  const ModeratorItemCard = ({ item }) => {
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [recipient, setRecipient] = useState({ name: '', address: '', phone: '' });

    const handleClaimSubmit = (e) => {
      e.preventDefault();
      updateItemStatus(item.id, 'Claimed', null, null, recipient);
      setShowClaimForm(false);
      setRecipient({ name: '', address: '', phone: '' });
      toast.success('Item claimed and recipient info saved!');
    };

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
        {showClaimForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border-2 border-hero">
              <h2 className="text-2xl font-bold mb-4 text-hero">Recipient Details</h2>
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={recipient.name}
                    onChange={e => setRecipient({ ...recipient, name: e.target.value })}
                    className="w-full px-3 py-2 border border-hero rounded-md focus:ring-2 focus:ring-hero focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={recipient.address}
                    onChange={e => setRecipient({ ...recipient, address: e.target.value })}
                    className="w-full px-3 py-2 border border-hero rounded-md focus:ring-2 focus:ring-hero focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={recipient.phone}
                    onChange={e => setRecipient({ ...recipient, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-hero rounded-md focus:ring-2 focus:ring-hero focus:outline-none"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-hero text-white py-2 px-4 rounded-md hover:bg-bgmain transition-colors font-medium"
                  >
                    Save & Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 flex-1">{item.title}</h3>
            <div className="flex space-x-2 ml-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                item.category === 'lost'
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {item.category.toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                item.status === 'PendingApproval'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : item.status === 'Approved'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

          <div className="space-y-2 mb-4 text-sm text-gray-500">
            <div>📅 Date: {new Date(item.date).toLocaleDateString()}</div>
            <div>📍 Location: {item.location}</div>
            <div>👤 Posted by: {item.createdByName}</div>
            <div>⏰ Submitted: {new Date(item.createdAt).toLocaleDateString()}</div>
            {item.claimantName && <div>🏷️ Claimed by: {item.claimantName}</div>}
          </div>

          {item.status === 'PendingApproval' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(item.id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </button>
            </div>
          )}
          {item.status === 'Approved' && (
            <button
              onClick={() => setShowClaimForm(true)}
              className="w-full bg-hero text-white py-2 px-4 rounded-md hover:bg-bgmain transition-colors font-medium mt-2"
            >
              Claim Item
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Claimed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.claimed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-amber-500 text-amber-600 bg-amber-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'approved'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setActiveTab('claimed')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'claimed'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Claimed ({stats.claimed})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                {pendingItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No pending items</h3>
                    <p className="text-gray-600">All items have been reviewed.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingItems.map(item => (
                      <ModeratorItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'approved' && (
              <div>
                {approvedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No approved items</h3>
                    <p className="text-gray-600">No items have been approved yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedItems.map(item => (
                      <ModeratorItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'claimed' && (
              <div>
                {claimedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No claimed items</h3>
                    <p className="text-gray-600">No items have been claimed yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {claimedItems.map(item => (
                      <ModeratorItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                  <p className="text-3xl font-bold mb-2">
                    {stats.total > 0 ? Math.round((stats.claimed / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-blue-100">Items successfully reunited</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Lost vs Found</h3>
                  <div className="space-y-1">
                    <div>Lost: {state.items.filter(i => i.category === 'lost').length}</div>
                    <div>Found: {state.items.filter(i => i.category === 'found').length}</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                  <p className="text-3xl font-bold mb-2">
                    {state.items.filter(item => {
                      const itemDate = new Date(item.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return itemDate > weekAgo;
                    }).length}
                  </p>
                  <p className="text-purple-100">Items this week</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
