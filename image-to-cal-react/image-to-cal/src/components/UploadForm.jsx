import React, { useState } from 'react';

function UploadForm({ onSuccess, onError, setLoading, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      onError('Please select a file first.');
      return;
    }

    setLoading(true);
    onError('');

    const formData = new FormData();
    formData.append('screenshot', selectedFile);

    try {
      const response = await fetch('https://ai-image-to-cal-production.up.railway.app/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process screenshot on server.');
      }

      const data = await response.json();
      onSuccess(data.icsURL);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Convert to Calendar Events'}
      </button>
    </form>
  );
}

export default UploadForm;
