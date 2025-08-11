import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const MobileOnlyWarning = () => (
  <div id="mobile-only-warning">
    <div>
      <strong>Mobile Only</strong>
      <div style={{ marginTop: 12 }}>
        This app is only available on mobile devices.<br />
        Please use a phone or resize your window.
      </div>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <MobileOnlyWarning />
  </React.StrictMode>
);
