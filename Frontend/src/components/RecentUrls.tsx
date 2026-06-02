import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Copy,
  ExternalLink,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { getRecentUrls } from '../api/urlApi';
import { getErrorMessage } from '../api/axios';
import type { ShortUrl } from '../types/api';
import { copyToClipboard, formatDate, truncateUrl } from '../utils/helpers';
import { AnalyticsPanel } from './AnalyticsPanel';
import { GlassCard } from './GlassCard';
import { LoadingSpinner } from './LoadingSpinner';

interface RecentUrlsProps {
  refreshKey: number;
}

export function RecentUrls({ refreshKey }: RecentUrlsProps) {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  async function loadUrls() {
    setLoading(true);
    try {
      const data = await getRecentUrls();
      setUrls(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUrls();
  }, [refreshKey]);

  async function handleCopy(shortUrl: string) {
    const ok = await copyToClipboard(shortUrl);
    if (ok) toast.success('Copied to clipboard');
    else toast.error('Failed to copy');
  }

  return (
    <>
      <GlassCard delay={0.15} className="mt-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent links</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Your recently created short URLs
            </p>
          </div>
          <button
            type="button"
            onClick={loadUrls}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size={28} />
          </div>
        ) : urls.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16 text-center">
            <Link2 className="mb-3 text-zinc-600" size={32} />
            <p className="text-sm text-zinc-400">No links yet</p>
            <p className="mt-1 text-xs text-zinc-600">
              Create your first short URL above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {urls.map((url, index) => (
                <motion.div
                  key={url.shortCode}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: index * 0.04 }}
                  className="group rounded-xl border border-white/8 bg-black/20 p-4 transition hover:border-white/15 hover:bg-black/30"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-violet-300 transition hover:text-violet-200"
                        >
                          /{url.shortCode}
                        </a>
                        {url.status && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                            {url.status}
                          </span>
                        )}
                        {typeof url.clicks === 'number' && (
                          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                            {url.clicks} clicks
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm text-zinc-400" title={url.originalUrl}>
                        {truncateUrl(url.originalUrl, 64)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600">
                        Created {formatDate(url.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(url.shortUrl)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/5"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/5"
                      >
                        <ExternalLink size={14} />
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelectedCode(url.shortCode)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/25"
                      >
                        <BarChart3 size={14} />
                        Analytics
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      <AnalyticsPanel
        shortCode={selectedCode}
        onClose={() => setSelectedCode(null)}
      />
    </>
  );
}
