import React, { useState, useRef } from 'react';
import { 
  Cloud, Upload, Brain, CheckCircle, Database, PartyPopper,
  ArrowLeft, ArrowRight, Check, X, Edit2, ChevronDown, ChevronRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { 
  LegacyFile, 
  CloudStorageConnection, 
  MigrationSession,
  CountryCode,
  DepartmentId 
} from '../types';
import {
  simulateConnectDrive,
  simulateFileUpload,
  simulateAIClassification,
  simulateDataExtraction,
  simulatePullFromDrive,
  mockLegacyFiles,
  getCountryFlag,
  getDepartmentIcon,
  getDepartmentName,
  formatFileSize,
  createMockMigrationSession
} from '../services/dataMigration';

export default function LegacyMigration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cloudStorage, setCloudStorage] = useState<CloudStorageConnection>({ connected: false });
  const [connecting, setConnecting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<LegacyFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [classificationProgress, setClassificationProgress] = useState(0);
  const [currentClassifyingFile, setCurrentClassifyingFile] = useState('');
  const [importing, setImporting] = useState(false);
  const [migrationSession, setMigrationSession] = useState<MigrationSession | null>(null);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [pullingFromDrive, setPullingFromDrive] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [currentPullingFile, setCurrentPullingFile] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'Connect', icon: Cloud },
    { number: 2, title: 'Upload', icon: Upload },
    { number: 3, title: 'Classify', icon: Brain },
    { number: 4, title: 'Review', icon: CheckCircle },
    { number: 5, title: 'Import', icon: Database },
    { number: 6, title: 'Complete', icon: PartyPopper },
  ];

  // Step 1: Connect Drive
  const handleConnectDrive = async () => {
    setConnecting(true);
    const connection = await simulateConnectDrive();
    setCloudStorage(connection);
    setConnecting(false);
  };

  // Step 2: Upload Files
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    const newFiles: LegacyFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const legacyFile = await simulateFileUpload(file, (progress) => {
        // Update progress for this file
      });
      newFiles.push(legacyFile);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUseMockFiles = () => {
    setUploadedFiles(mockLegacyFiles);
  };

  // Pull from Drive
  const handlePullFromDrive = async () => {
    setPullingFromDrive(true);
    const files = await simulatePullFromDrive((progress, fileName) => {
      setPullProgress(progress);
      setCurrentPullingFile(fileName);
    });
    setUploadedFiles(prev => [...prev, ...files]);
    setPullingFromDrive(false);
    setPullProgress(0);
  };

  // Step 3: Classify Files
  const handleClassify = async () => {
    setClassifying(true);
    await simulateAIClassification(uploadedFiles, (progress, fileName) => {
      setClassificationProgress(progress);
      setCurrentClassifyingFile(fileName);
    });
    setClassifying(false);
    setClassificationProgress(100);
  };

  // Step 4: Review & Edit
  const handleEditFile = (fileId: string, updates: Partial<LegacyFile>) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, ...updates, status: 'approved' } : f
    ));
  };

  const handleApproveAll = () => {
    setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'approved' })));
  };

  // Step 5: Import
  const handleImport = async () => {
    setImporting(true);
    
    // Simulate import delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create migration session with results
    const session = createMockMigrationSession();
    session.status = 'complete';
    session.completedAt = new Date().toISOString();
    session.processedFiles = uploadedFiles.length;
    setMigrationSession(session);
    
    setImporting(false);
    setCurrentStep(6);
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'complete';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return cloudStorage.connected;
      case 2: return uploadedFiles.length > 0;
      case 3: return classificationProgress === 100;
      case 4: return uploadedFiles.every(f => f.status === 'approved' || f.status === 'auto-approved');
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚚 Legacy Data Migration
          </h1>
          <p className="text-gray-600">
            Import your old files into the CRM with AI-powered classification
          </p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.number);
              const Icon = step.icon;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                      ${status === 'complete' ? 'bg-green-500 text-white' : ''}
                      ${status === 'current' ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : ''}
                      ${status === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
                    `}>
                      {status === 'complete' ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">Step {step.number}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded transition-all ${
                      step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* Step 1: Connect */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">☁️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Connect Your Google Drive
                </h2>
                <p className="text-gray-600 mb-6">
                  We'll detect your Echo House folder and prepare for migration
                </p>
              </div>

              {!cloudStorage.connected ? (
                <div className="max-w-md mx-auto">
                  <Button
                    onClick={handleConnectDrive}
                    isLoading={connecting}
                    className="w-full justify-center py-4 text-lg"
                  >
                    <Cloud size={20} className="mr-2" />
                    Connect Google Drive
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    This is a mock connection - no actual OAuth required
                  </p>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Check className="text-green-600" size={24} />
                      <div>
                        <div className="font-semibold text-green-900">Connected Successfully!</div>
                        <div className="text-sm text-green-700">{cloudStorage.email}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">📁</div>
                        <div className="font-semibold text-gray-900">Echo House Folder Detected</div>
                      </div>
                      <div className="text-sm text-gray-600 ml-8">
                        Root folder ready for migration
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-900">
                      <strong>Folder Structure:</strong> 81 folders across 7 countries × 12 departments
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📤</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Legacy Files
                </h2>
                <p className="text-gray-600">
                  Pull from Drive or upload from your computer
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                {/* Pull from Drive */}
                {cloudStorage.connected && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold text-blue-900">Pull from Google Drive</div>
                        <div className="text-sm text-blue-700">
                          Fetch files from your "Legacy Inbox" folder
                        </div>
                      </div>
                      <Button 
                        onClick={handlePullFromDrive}
                        isLoading={pullingFromDrive}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Cloud size={16} className="mr-2" />
                        Pull from Drive
                      </Button>
                    </div>
                    
                    {pullingFromDrive && (
                      <div className="mt-4">
                        <div className="text-sm text-blue-700 mb-2">
                          Fetching: {currentPullingFile}
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${pullProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-700 font-medium mb-2">
                    Or drop files here to upload from computer
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports: Excel, Word, PDF, CSV, Images
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button onClick={handleFileSelect} variant="secondary">
                    Browse Files
                  </Button>
                </div>

                {/* Mock Data Button */}
                <div className="text-center">
                  <Button onClick={handleUseMockFiles} variant="secondary" className="mx-auto">
                    Use Mock Files (12 files)
                  </Button>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="font-semibold text-gray-900 mb-3">
                      Uploaded Files ({uploadedFiles.length})
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="bg-white rounded p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {file.id.startsWith('drive-') ? '☁️' : '📄'}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                                {file.id.startsWith('drive-') && (
                                  <span className="ml-2 text-blue-600">from Drive</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Check className="text-green-600" size={20} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Classify */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Classification
                </h2>
                <p className="text-gray-600">
                  Gemini AI will analyze and categorize your files
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {!classifying && classificationProgress === 0 && (
                  <div className="text-center">
                    <Button onClick={handleClassify} className="px-8 py-4">
                      <Brain size={20} className="mr-2" />
                      Start AI Classification
                    </Button>
                  </div>
                )}

                {classifying && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <div>
                        <div className="font-semibold text-blue-900">Analyzing Files...</div>
                        <div className="text-sm text-blue-700">{currentClassifyingFile}</div>
                      </div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${classificationProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-blue-700 text-right mt-2">
                      {classificationProgress}%
                    </div>
                  </div>
                )}

                {classificationProgress === 100 && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="text-green-600" size={20} />
                        <span className="font-semibold text-green-900">Classification Complete!</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-gray-900">{uploadedFiles.length}</div>
                          <div className="text-xs text-gray-600">Total Files</div>
                        </div>
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-green-600">
                            {uploadedFiles.filter(f => f.status === 'auto-approved').length}
                          </div>
                          <div className="text-xs text-gray-600">Auto-Approved</div>
                        </div>
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-yellow-600">
                            {uploadedFiles.filter(f => f.status === 'needs-review').length}
                          </div>
                          <div className="text-xs text-gray-600">Needs Review</div>
                        </div>
                      </div>
                    </div>

                    {/* Classification Results Preview */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-3">Classification Results</div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {uploadedFiles.slice(0, 5).map(file => (
                          <div key={file.id} className="bg-white rounded p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-xl">{getDepartmentIcon(file.suggestedDepartment!)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{file.name}</div>
                                <div className="text-xs text-gray-500">
                                  {getCountryFlag(file.suggestedCountry!)} {file.suggestedCountry} • {getDepartmentName(file.suggestedDepartment!)}
                                </div>
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              file.confidenceScore! >= 85 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {file.confidenceScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                      {uploadedFiles.length > 5 && (
                        <div className="text-center text-sm text-gray-500 mt-2">
                          +{uploadedFiles.length - 5} more files
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review & Approve
                </h2>
                <p className="text-gray-600">
                  Verify AI suggestions and make corrections
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {uploadedFiles.filter(f => f.status === 'approved' || f.status === 'auto-approved').length} of {uploadedFiles.length} approved
                  </div>
                  <Button onClick={handleApproveAll} variant="secondary" size="sm">
                    Approve All
                  </Button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {uploadedFiles.map(file => (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="text-xl">{getDepartmentIcon(file.suggestedDepartment!)}</div>
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {file.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {getCountryFlag(file.suggestedCountry!)} {file.suggestedCountry}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {getDepartmentName(file.suggestedDepartment!)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              file.confidenceScore! >= 85 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {file.confidenceScore}%
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {file.status === 'auto-approved' || file.status === 'approved' ? (
                              <Check className="text-green-600" size={20} />
                            ) : (
                              <Button
                                onClick={() => handleEditFile(file.id, { status: 'approved' })}
                                size="sm"
                                variant="secondary"
                              >
                                Approve
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Import */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💾</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Import to CRM
                </h2>
                <p className="text-gray-600">
                  Extract data and import into the database
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {!importing && !migrationSession && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="font-semibold text-blue-900 mb-4">Ready to Import</div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-gray-900">{uploadedFiles.length}</div>
                          <div className="text-xs text-gray-600">Files to Process</div>
                        </div>
                        <div className="bg-white rounded p-3">
                          <div className="text-2xl font-bold text-indigo-600">~40</div>
                          <div className="text-xs text-gray-600">Records Expected</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button onClick={handleImport} className="px-8 py-4">
                        <Database size={20} className="mr-2" />
                        Start Import
                      </Button>
                    </div>
                  </div>
                )}

                {importing && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <div>
                        <div className="font-semibold text-indigo-900">Importing Data...</div>
                        <div className="text-sm text-indigo-700">Extracting and validating records</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Complete */}
          {currentStep === 6 && migrationSession && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Migration Complete!
                </h2>
                <p className="text-gray-600">
                  Your legacy data has been successfully imported
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-900">{migrationSession.totalFiles}</div>
                      <div className="text-xs text-gray-600 mt-1">Files Processed</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{migrationSession.extractedRecords?.contacts || 0}</div>
                      <div className="text-xs text-gray-600 mt-1">Contacts</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">{migrationSession.extractedRecords?.campaigns || 0}</div>
                      <div className="text-xs text-gray-600 mt-1">Campaigns</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">{migrationSession.extractedRecords?.deals || 0}</div>
                      <div className="text-xs text-gray-600 mt-1">Deals</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => window.location.hash = 'files'} className="flex-1">
                    View in Files
                  </Button>
                  <Button onClick={() => window.location.hash = 'dashboard'} variant="secondary" className="flex-1">
                    View Dashboard
                  </Button>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => {
                      setCurrentStep(1);
                      setUploadedFiles([]);
                      setClassificationProgress(0);
                      setMigrationSession(null);
                    }}
                    variant="secondary"
                  >
                    Start New Migration
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              variant="secondary"
              disabled={currentStep === 1}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>

            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
