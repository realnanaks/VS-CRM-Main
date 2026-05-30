// Google Drive Service
// Handles all interactions with Google Drive API

import { DriveFolder, DriveFile } from '../types';

const BASE_API_URL = 'http://localhost:3001/api';

/**
 * Get all folders accessible to the current user
 */
export const getAccessibleFolders = async (): Promise<DriveFolder[]> => {
  try {
    const response = await fetch(`${BASE_API_URL}/drive/folders`);
    if (!response.ok) {
      throw new Error('Failed to fetch folders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
};

/**
 * Get files in a specific folder
 */
export const getFolderFiles = async (folderId: string): Promise<{ folder: any; files: DriveFile[] }> => {
  try {
    const response = await fetch(`${BASE_API_URL}/drive/folders/${folderId}/files`);
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied to this folder');
      }
      throw new Error('Failed to fetch files');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

/**
 * Upload a file to a folder
 */
export const uploadFile = async (folderId: string, file: File, onProgress?: (progress: number) => void): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${BASE_API_URL}/drive/folders/${folderId}/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Download a file
 */
export const downloadFile = async (fileId: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_API_URL}/drive/files/${fileId}`);
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied to this file');
      }
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_API_URL}/drive/files/${fileId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied to delete this file');
      }
      throw new Error('Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get file icon based on mimeType
 */
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '🗜️';
  if (mimeType.includes('text/')) return '📃';
  return '📎';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

/**
 * Format date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};
