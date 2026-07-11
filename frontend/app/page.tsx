"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Search, RefreshCw, Plus, X, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface HostedZone {
  id: number;
  name: string;
  type: string;
  description: string;
}

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<number | null>(null);
  
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Public");

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchZones = () => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/zones`)
      .then(res => {
        setZones(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching zones:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openCreateModal = () => {
    setDomainName("");
    setDescription("");
    setType("Public");
    setIsModalOpen(true);
  };

  const openEditModal = (zone: HostedZone) => {
    setEditingZoneId(zone.id);
    setDomainName(zone.name);
    setDescription(zone.description || "");
    setType(zone.type);
    setIsEditModalOpen(true);
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/zones/`, {
        name: domainName,
        description: description,
        type: type
      });
      
      setIsModalOpen(false);
      fetchZones();
    } catch (err) {
      console.error("Failed to create zone:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZoneId) return;
    setIsSubmitting(true);
    
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/zones/${editingZoneId}`, {
        name: domainName,
        description: description,
        type: type
      });
      
      setIsEditModalOpen(false);
      fetchZones();
    } catch (err) {
      console.error("Failed to update zone:", err);
      alert("Failed to update zone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteZone = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the hosted zone ${name}?`)) {
      return;
    }
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/zones/${id}`);
      fetchZones();
    } catch (err) {
      console.error("Failed to delete zone:", err);
      alert("Failed to delete the hosted zone.");
    }
  };

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredZones.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedZones = filteredZones.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hosted zones</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Hosted zones contain records that dictate how traffic is routed for your domains and subdomains.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded shadow-sm">
        <div className="p-4 border-b border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800">Hosted zones ({filteredZones.length})</h2>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Find hosted zones" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button onClick={fetchZones} className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={openCreateModal}
              className="bg-[#ff9900] hover:bg-[#e88b00] text-white px-4 py-1.5 font-bold rounded text-sm flex items-center gap-1 transition-colors"
            >
              <Plus size={16} /> Create hosted zone
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b border-gray-300 text-sm">
                <th className="p-3 font-bold">Domain name</th>
                <th className="p-3 font-bold border-l border-gray-200">Type</th>
                <th className="p-3 font-bold border-l border-gray-200">Description</th>
                <th className="p-3 font-bold border-l border-gray-200 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Loading hosted zones...</td>
                </tr>
              ) : paginatedZones.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    {searchTerm ? "No hosted zones match your search." : "No hosted zones found. Click \"Create hosted zone\" to get started."}
                  </td>
                </tr>
              ) : (
                paginatedZones.map((zone) => (
                  <tr key={zone.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium">
                      <Link href={`/zones/${zone.id}`} className="text-[#0073bb] hover:underline cursor-pointer">
                        {zone.name}
                      </Link>
                    </td>
                    <td className="p-3 border-l border-gray-200 text-gray-700">{zone.type}</td>
                    <td className="p-3 border-l border-gray-200 text-gray-500">{zone.description || "-"}</td>
                    <td className="p-3 border-l border-gray-200 text-center flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEditModal(zone)}
                        className="text-[#0073bb] hover:text-[#005a93] font-medium text-sm px-2 py-1 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteZone(zone.id, zone.name)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Delete Hosted Zone"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-t border-gray-300 flex items-center justify-end gap-4 bg-gray-50">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button 
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {(isModalOpen || isEditModalOpen) && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity"
          onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-bold text-gray-900">
                {isEditModalOpen ? "Edit hosted zone" : "Create hosted zone"}
              </h2>
              <button 
                type="button" 
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} 
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleUpdateZone : handleCreateZone} className="flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Domain name <span className="text-red-600">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Enter the name of the domain you want to route traffic for (e.g., example.com).</p>
                  <input 
                    type="text" 
                    required
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Type</label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="type" 
                        value="Public"
                        checked={type === "Public"}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-bold text-sm">Public hosted zone</div>
                        <div className="text-xs text-gray-500">Determines how traffic is routed on the internet.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="type" 
                        value="Private"
                        checked={type === "Private"}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-bold text-sm">Private hosted zone</div>
                        <div className="text-xs text-gray-500">Determines how traffic is routed within Amazon VPCs.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-4 py-1.5 border border-gray-400 font-bold rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#ff9900] hover:bg-[#e88b00] text-white px-4 py-1.5 font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : (isEditModalOpen ? "Save changes" : "Create hosted zone")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}