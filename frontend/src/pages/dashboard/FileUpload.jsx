import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadActivityCSV } from '../../redux/slices/activitySlice';
import MainLayout from '../../components/layout/MainLayout';
import './FileUpload.css';

const FileUpload = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const uploadStatus = useSelector(state => state.activities.uploadStatus);
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      dispatch(uploadActivityCSV(file));
    }
  };
  
  return (
    <MainLayout title="Upload Activity Data">
      <div className="file-upload-container">
        <div className="upload-section">
          <h2>Upload Apple Watch Activity Data</h2>
          
          <div className="upload-instructions">
            <p>Upload a CSV file containing your Apple Watch activity data. The file should include the following columns:</p>
            <ul>
              <li><strong>user_id</strong>: Your user identifier (will be replaced with your account ID)</li>
              <li><strong>date</strong>: Activity date in YYYY-MM-DD format</li>
              <li><strong>steps</strong>: Number of steps taken</li>
              <li><strong>distance_km</strong>: Distance traveled in kilometers</li>
              <li><strong>active_minutes</strong>: Minutes of activity</li>
            </ul>
          </div>
          
          <div 
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">📂</div>
            <p>Drag and drop your CSV file here, or click to select</p>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="file-input"
            />
            
            {file && (
              <div className="selected-file">
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
          
          <button 
            className="upload-button"
            onClick={handleUpload}
            disabled={!file || uploadStatus.loading}
          >
            {uploadStatus.loading ? 'Uploading...' : 'Upload File'}
          </button>
          
          {uploadStatus.error && (
            <div className="upload-error">
              Error: {uploadStatus.error.message || 'Failed to upload file'}
            </div>
          )}
          
          {uploadStatus.success && (
            <div className="upload-success">
              <h3>Upload Successful!</h3>
              <p>Your activity data has been processed successfully.</p>
              
              {uploadStatus.lastUploadResult && (
                <div className="upload-stats">
                  <div className="stat-item">
                    <span className="stat-label">Processed Records:</span>
                    <span className="stat-value">{uploadStatus.lastUploadResult.results.processed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Skipped Records:</span>
                    <span className="stat-value">{uploadStatus.lastUploadResult.results.skipped}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FileUpload;