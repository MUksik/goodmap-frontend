import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const ImageUpload = ({ placeId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage('');
  };

  const resetInput = () => {
    setSelectedFile(null);
    setMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    resetInput();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('placeId', placeId);
    try {
      setIsUploading(true);
      const response = await axios.post('', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      resetInput(); 
    } catch (error) {
      setMessage('Upload failed');
      resetInput(); 
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '320px',
        margin: '16px auto 0',
        padding: '16px',
        border: '1px solid #2c4f5b',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(44,79,91,0.2)',
      }}
    >
      <label
        htmlFor="fileInput"
        style={{
          cursor: 'pointer',
          color: '#0d0e0eff',
          textDecoration: 'underline',
          display: 'inline-block',
          marginBottom: '12px',
          fontWeight: 'normal',
          fontSize: '1.1em',
        }}
      >
        {selectedFile ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'}
      </label>
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
      />

      {selectedFile && (
        <div
          style={{
            marginTop: '10px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1em',
            color: '#333',
          }}
        >
          <span>{selectedFile.name}</span>
          <button
            type="button"
            onClick={handleRemoveFile}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'red',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95em',
              padding: '2px 6px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Usuń zdjęcie"
          >
            Usuń
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={isUploading || !selectedFile}
        style={{
          width: '100%',
          backgroundColor: isUploading || !selectedFile ? '#85a1af' : '#2c4f5b',
          color: 'white',
          border: 'none',
          padding: '12px 0',
          borderRadius: '8px',
          cursor: isUploading || !selectedFile ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '1.1em',
          transition: 'background-color 0.3s ease',
          textAlign: 'center',
        }}
      >
        {isUploading ? 'Wysyłanie...' : 'Wyślij zdjęcie'}
      </button>

      {message && (
        <p
          style={{
            marginTop: '14px',
            color: message.toLowerCase().includes('fail') ? 'red' : 'green',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
};

ImageUpload.propTypes = {
  placeId: PropTypes.string.isRequired,
};
