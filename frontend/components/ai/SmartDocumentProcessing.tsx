import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2, Eye, Download } from 'lucide-react';
import { mockDocumentExtractions } from '../../data/mockAIData';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export default function SmartDocumentProcessing() {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState(mockDocumentExtractions);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Simulate adding a new document
      const newDoc = {
        id: '3',
        fileName: 'Marketing_Proposal_Q2.docx',
        status: 'completed' as const,
        extractedData: {
          client: 'TechNova Solutions',
          value: 45000,
          duration: '3 months',
          services: 5
        },
        confidence: 91
      };
      setDocuments([...documents, newDoc]);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-emerald-600" size={20} />;
      case 'processing': return <Loader2 className="text-blue-600 animate-spin" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Document Processing</h1>
        <p className="text-slate-500 mt-1">AI-powered document understanding and data extraction</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Documents</h2>
        <div 
          className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50"
          onClick={handleUpload}
        >
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 size={48} className="mx-auto text-indigo-600 animate-spin" />
              <div>
                <p className="text-slate-900 font-medium mb-2">Processing document...</p>
                <p className="text-sm text-slate-500">AI is extracting data from your file</p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <Upload size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-400">Supports PDF, Word, Excel, CSV files</p>
            </>
          )}
        </div>
      </div>

      {/* Processing Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-indigo-600" size={24} />
            <span className="text-sm text-indigo-600 font-medium">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{documents.length}</h3>
          <p className="text-slate-500 text-sm mt-1">Documents Processed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-emerald-600" size={24} />
            <span className="text-sm text-emerald-600 font-medium">Success</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">92%</h3>
          <p className="text-slate-500 text-sm mt-1">Accuracy Rate</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Loader2 className="text-blue-600" size={24} />
            <span className="text-sm text-blue-600 font-medium">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {documents.filter(d => d.status === 'processing').length}
          </h3>
          <p className="text-slate-500 text-sm mt-1">Processing Now</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Download className="text-purple-600" size={24} />
            <span className="text-sm text-purple-600 font-medium">Ready</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {documents.filter(d => d.status === 'completed').length}
          </h3>
          <p className="text-slate-500 text-sm mt-1">Ready to Export</p>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Processed Documents</h2>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="text-slate-400 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{doc.fileName}</h3>
                    <div className="flex items-center gap-3">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1", getStatusColor(doc.status))}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </span>
                      {doc.status === 'completed' && (
                        <span className="text-xs text-slate-500">
                          {doc.confidence}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {doc.status === 'completed' && (
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors" title="Preview">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                )}
              </div>

              {doc.extractedData && doc.status === 'completed' && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Extracted Data:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(doc.extractedData).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {typeof value === 'number' && key.toLowerCase().includes('budget') || key.toLowerCase().includes('spent') || key.toLowerCase().includes('value')
                            ? `$${value.toLocaleString()}`
                            : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="text-indigo-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Intelligent OCR</h3>
          <p className="text-sm text-slate-600">Extract text and data from scanned documents, receipts, and invoices with high accuracy</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="text-purple-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Auto-Classification</h3>
          <p className="text-sm text-slate-600">AI automatically categorizes documents by type and extracts relevant fields</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <Eye className="text-emerald-600" size={24} />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Entity Recognition</h3>
          <p className="text-sm text-slate-600">Identify and extract people, companies, dates, amounts, and other entities</p>
        </div>
      </div>

      {/* Template Builder */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg text-white">
        <h2 className="text-xl font-bold mb-2">Custom Extraction Templates</h2>
        <p className="text-purple-100 mb-4">
          Create custom templates to extract specific data from your unique document formats. Perfect for recurring document types.
        </p>
        <Button className="bg-white text-purple-600 hover:bg-purple-50">
          Build Template
        </Button>
      </div>
    </div>
  );
}
