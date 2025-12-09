import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import './BulkMediaUpload.css';

function BulkMediaUpload() {
  const user = useAuthStore((state) => state.user);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select files to upload' });
      return;
    }

    setUploading(true);
    const progress = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        progress[i] = 0;
        setUploadProgress({...progress});

        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (error) throw error;

        progress[i] = 100;
        setUploadProgress({...progress});

        // Save to media library table
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        await supabase.from('media_library').insert([{
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size
        }]);

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        progress[i] = -1; // Error indicator
        setUploadProgress({...progress});
      }
    }

    setUploading(false);
    setMessage({ type: 'success', text: `Successfully uploaded ${Object.values(progress).filter(p => p === 100).length} files!` });
    setTimeout(() => {
      setFiles([]);
      setUploadProgress({});
    }, 2000);
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bulk-upload-v2">
      <div className="page-header">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Bulk Media Upload</h1>
          <p className="text-secondary mt-2">Upload multiple images and videos at once</p>
        </div>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      <div 
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="drop-zone-content">
          <div className="drop-icon">📁</div>
          <h3>Drag & Drop Files Here</h3>
          <p>or click to browse</p>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" className="btn btn-primary">
            Choose Files
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="section-card">
          <div className="files-header">
            <h2 className="text-2xl font-semibold">Selected Files ({files.length})</h2>
            <span className="total-size">Total: {formatSize(totalSize)}</span>
          </div>
          <div className="files-list">
            {files.map((file, i) => (
              <div key={i} className="file-item">
                <div className="file-icon">
                  {file.type.startsWith('image/') ? '🖼️' : '🎥'}
                </div>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatSize(file.size)}</div>
                  {uploadProgress[i] !== undefined && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{
                          width: `${uploadProgress[i] === -1 ? 0 : uploadProgress[i]}%`,
                          background: uploadProgress[i] === -1 ? '#ef4444' : uploadProgress[i] === 100 ? '#10b981' : '#6366f1'
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFile(i)}
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="upload-actions">
            <button className="btn btn-secondary" onClick={() => setFiles([])}>
              Clear All
            </button>
            <button 
              className="btn btn-primary" 
              onClick={uploadFiles}
              disabled={uploading}
            >
              {uploading ? '⬆️ Uploading...' : '⬆️ Upload All'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkMediaUpload;
