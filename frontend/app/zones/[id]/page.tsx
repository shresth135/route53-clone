"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { RefreshCw, Plus, ArrowLeft, X, Trash2, Search } from "lucide-react";

interface DnsRecord {
  id: number;
  name: string;
  record_type: string;
  value: string;
  ttl: number;
}

export default function DnsRecordsPage() {
  const params = useParams();
  const zoneId = params.id;
  
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recordName, setRecordName] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState(300);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecords = () => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/zones/${zoneId}/records/`)
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching records:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (zoneId) {
      fetchRecords();
    }
  }, [zoneId]);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/zones/${zoneId}/records/`, {
        name: recordName,
        record_type: recordType,
        value: value,
        ttl: ttl
      });
      
      setRecordName("");
      setRecordType("A");
      setValue("");
      setTtl(300);
      setIsModalOpen(false);
      
      fetchRecords();
    } catch (err) {
      console.error("Failed to create record:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the record ${name || '@'}?`)) {
      return;
    }
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/records/${id}`);
      fetchRecords(); 
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete the record. Check your backend console for errors.");
    }
  };

  const filteredRecords = records.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto relative">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#0073bb] hover:underline mb-4 font-bold">
        <ArrowLeft size={16} /> Back to hosted zones
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Records</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage the DNS records for this hosted zone.
        </p>
      </div>

      <div className="bg-white border border-gray-300 rounded shadow-sm">
        <div className="p-4 border-b border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-800">Records ({records.length})</h2>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Find records" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button onClick={fetchRecords} className="p-1.5 border border-gray-300 rounded hover:bg-white text-gray-600 bg-gray-50">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ff9900] hover:bg-[#e88b00] text-white px-4 py-1.5 font-bold rounded text-sm flex items-center gap-1"
            >
              <Plus size={16} /> Create record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b border-gray-300 text-sm">
                <th className="p-3 font-bold">Record name</th>
                <th className="p-3 font-bold border-l border-gray-200">Type</th>
                <th className="p-3 font-bold border-l border-gray-200">Value/Route traffic to</th>
                <th className="p-3 font-bold border-l border-gray-200">TTL (seconds)</th>
                <th className="p-3 font-bold border-l border-gray-200 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Loading records...</td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    {searchTerm ? "No records match your search." : "No records found. Click \"Create record\" to add one."}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-[#0073bb] font-medium">{record.name || "-"}</td>
                    <td className="p-3 border-l border-gray-200 text-gray-700">{record.record_type}</td>
                    <td className="p-3 border-l border-gray-200 text-gray-700 truncate max-w-xs">{record.value}</td>
                    <td className="p-3 border-l border-gray-200 text-gray-700">{record.ttl}</td>
                    <td className="p-3 border-l border-gray-200 text-center">
                      <button 
                        onClick={() => handleDeleteRecord(record.id, record.name)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Delete Record"
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
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h2 className="text-lg font-bold text-gray-900">Create record</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRecord} className="flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Record name
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Enter the subdomain (e.g., www, api). Leave blank for the apex domain.</p>
                  <input 
                    type="text" 
                    value={recordName}
                    onChange={(e) => setRecordName(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., www"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Record type</label>
                  <select 
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="A">A - Routes traffic to an IPv4 address and some AWS resources</option>
                    <option value="AAAA">AAAA - Routes traffic to an IPv6 address and some AWS resources</option>
                    <option value="CNAME">CNAME - Routes traffic to another domain name and to some AWS resources</option>
                    <option value="TXT">TXT - Routes traffic to text strings</option>
                    <option value="MX">MX - Specifies mail servers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">
                    Value <span className="text-red-600">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">IP address or another target value depending on the record type.</p>
                  <textarea 
                    required
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 192.0.2.235"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">TTL (Seconds)</label>
                  <p className="text-xs text-gray-500 mb-2">The amount of time that DNS resolvers should cache this record.</p>
                  <input 
                    type="number" 
                    min="0"
                    value={ttl}
                    onChange={(e) => setTtl(Number(e.target.value))}
                    className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 border border-gray-400 font-bold rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#ff9900] hover:bg-[#e88b00] text-white px-4 py-1.5 font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}