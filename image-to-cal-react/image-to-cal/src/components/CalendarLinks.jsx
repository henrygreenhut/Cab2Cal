// src/components/CalendarLinks.jsx
import React from 'react';

function CalendarLinks({ icsURL }) {
  // 1. "Download ICS File" button
  const handleDownloadIcs = () => {
    // If the server serves the .ics file at icsURL, you can simply redirect there:
    // The 'download' attribute on an <a> tag also works, but let's do it by JS:
    window.location.href = icsURL;
  };

  // 2. "Add to Google Calendar" button
  //    Google Calendar import requires a publicly accessible .ics URL:
  const handleAddToGoogleCalendar = () => {
    // Direct user to Google Calendar's import page with your icsURL
    // This opens a new tab
    const googleImportURL = `https://www.google.com/calendar/render?cid=${encodeURIComponent(icsURL)}`;
    window.open(googleImportURL, '_blank');
  };

  // 3. "Add to Apple Calendar" button
  //    Typically, Apple Calendar is triggered by opening/downloading the .ics file.
  //    On a Mac or iOS device, opening an .ics file generally prompts the user to import into Calendar.
  const handleAddToAppleCalendar = () => {
    // In many cases, just re-using the .ics download logic is enough.
    // Apple users can open the downloaded .ics in Apple Calendar.
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
