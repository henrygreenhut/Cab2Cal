import React, { useState } from 'react';
import './App.css';     
import UploadForm from './components/UploadForm';
import CalendarLinks from './components/CalendarLinks';

function App() {
  const [icsURL, setIcsURL] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);


  const handleUploadSuccess = (url) => {
    setIcsURL(url);
    setErrorMsg('');
  };


  const handleUploadError = (msg) => {
    setErrorMsg(msg);
  };

  return (
    <div className="App">
      <h1>Class Schedule to Calendar</h1>

      <UploadForm
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        setLoading={setLoading}
        loading={loading}
      />

      {errorMsg && <p className="ErrorMsg">{errorMsg}</p>}

      {icsURL && !loading && (
        <CalendarLinks icsURL={icsURL} />
      )}
    </div>
  );
}

export default App;
