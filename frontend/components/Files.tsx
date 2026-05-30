import React, { useState, useEffect, useRef } from 'react';
import { DriveFolder, DriveFile } from '../types';
import { 
  getAccessibleFolders, 
  getFolderFiles, 
  uploadFile, 
  downloadFile, 
  deleteFile,
  getFileIcon,
  formatFileSize,
  formatDate
} from '../services/drive';

export default function Files() {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<DriveFolder | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load accessible folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessibleFolders = await getAccessibleFolders();
      setFolders(accessibleFolders);
      
      // Auto-select first folder if available
      if (accessibleFolders.length > 0 && !selectedFolder) {
        handleFolderSelect(accessibleFolders[0]);
      }
    } catch (err) {
      setError('Failed to load folders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = async (folder: DriveFolder) => {
    setSelectedFolder(folder);
    setLoading(true);
    setError(null);
    try {
      const result = await getFolderFiles(folder.id);
      setFiles(result.files);
    } catch (err: any) {
      setError(err.message || 'Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !selectedFolder) return;
    
    const file = event.target.files[0];
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await uploadFile(selectedFolder.id, file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Reload files after upload
      await handleFolderSelect(selectedFolder);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileDownload = async (file: DriveFile) => {
    try {
      await downloadFile(file.id, file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to download file');
    }
  };

  const handleFileDelete = async (file: DriveFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;
    
    try {
      await deleteFile(file.id);
      // Reload files after delete
      if (selectedFolder) {
        await handleFolderSelect(selectedFolder);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedFolder || !e.dataTransfer.files.length) return;
    
    const file = e.dataTransfer.files[0];
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      await uploadFile(selectedFolder.id, file, (progress) => {
        setUploadProgress(progress);
      });
      
      // Reload files after upload
      await handleFolderSelect(selectedFolder);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canWrite = selectedFolder?.permissions.includes('write');
  const canDelete = selectedFolder?.permissions.includes('delete');

  if (loading && folders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading folders...</p>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Folders Available</h3>
        <p className="text-gray-600">
          You don't have access to any folders yet. Contact your administrator to get access.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar - Folder List */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Folders</h2>
          <p className="text-sm text-gray-600 mt-1">{folders.length} accessible</p>
        </div>
        
        <div className="p-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => handleFolderSelect(folder)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                selectedFolder?.id === folder.id
                  ? 'bg-indigo-100 text-indigo-900'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-2">📁</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{folder.name}</div>
                  <div className="text-xs text-gray-500 truncate">{folder.path}</div>
                </div>
              </div>
              
              {/* Permission badges */}
              <div className="flex gap-1 mt-1">
                {folder.permissions.includes('read') && (
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Read</span>
                )}
                {folder.permissions.includes('write') && (
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Write</span>
                )}
                {folder.permissions.includes('delete') && (
                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Delete</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - File List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedFolder ? selectedFolder.name : 'Select a Folder'}
              </h1>
              {selectedFolder && (
                <p className="text-sm text-gray-600 mt-1">{selectedFolder.path}</p>
              )}
            </div>
            
            {selectedFolder && canWrite && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                >
                  <span className="mr-2">📤</span>
                  Upload File
                </label>
              </div>
            )}
          </div>

          {/* Search */}
          {selectedFolder && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mx-4 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-900 font-medium">Uploading...</span>
              <span className="text-blue-700">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* File List or Drop Zone */}
        {selectedFolder ? (
          <div
            className="flex-1 overflow-y-auto p-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No files found' : 'Folder is empty'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : canWrite 
                      ? 'Drag and drop files here or click Upload File to get started'
                      : 'No files in this folder yet'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-4xl">{getFileIcon(file.mimeType)}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleFileDownload(file)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Download"
                        >
                          ⬇️
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleFileDelete(file)}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 truncate mb-1" title={file.name}>
                      {file.name}
                    </h4>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{formatFileSize(file.size)}</div>
                      <div>{formatDate(file.modifiedTime)}</div>
                    </div>
                    
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Open in Drive →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Folder</h3>
              <p className="text-gray-600">Choose a folder from the sidebar to view its files</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
