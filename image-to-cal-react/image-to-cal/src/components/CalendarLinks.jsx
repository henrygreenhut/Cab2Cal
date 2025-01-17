import React from 'react';

function CalendarLinks({ icsURL }) {
  const handleDownloadIcs = () => {
    window.location.href = icsURL;
  };

  const handleAddToGoogleCalendar = () => {
    const formattedUrl = icsURL.replace(/^https:\/\//, "");
    const googleImportURL = `https://calendar.google.com/calendar/render?cid=webcal://${encodeURIComponent(formattedUrl)}`;
    const newTab = window.open('', '_blank');
    if (newTab) {
      newTab.location.href = googleImportURL;
    } else {
      alert("Please enable pop-ups for this site to use this feature.");
    }
  };
  const handleAddToAppleCalendar = () => {
    window.location.href = icsURL;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Success! Your ICS file is ready.</h3>

      <button onClick={handleDownloadIcs}>
        Download ICS File
      </button>

      <button onClick={handleAddToGoogleCalendar} style={{ marginLeft: '1rem' }}>
        Add to Google Calendar
      </button>

      <button onClick={handleAddToAppleCalendar} style={{ marginLeft: '1rem' }}>
        Add to Apple Calendar
      </button>
    </div>
  );
}

export default CalendarLinks;
