import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { RecentUrls } from './components/RecentUrls';
import { ShortUrlResult } from './components/ShortUrlResult';
import { UrlForm } from './components/UrlForm';
import type { ShortUrl } from './types/api';

function App() {
  const [latestUrl, setLatestUrl] = useState<ShortUrl | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated(url: ShortUrl) {
    setLatestUrl(url);
    setRefreshKey((key) => key + 1);
  }

  return (
    <Layout>
      <Header />
      <div className="space-y-6">
        <UrlForm onCreated={handleCreated} />
        {latestUrl && <ShortUrlResult url={latestUrl} />}
      </div>
      <RecentUrls refreshKey={refreshKey} />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#a78bfa',
              secondary: '#18181b',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#18181b',
            },
          },
        }}
      />
    </Layout>
  );
}

export default App;
