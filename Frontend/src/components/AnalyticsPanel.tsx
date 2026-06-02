import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Globe, Monitor, X } from 'lucide-react';
import { getAnalytics } from '../api/analyticsApi';
import { getErrorMessage } from '../api/axios';
import type { AnalyticsData } from '../types/api';
import { formatDate } from '../utils/helpers';
import { LoadingSpinner } from './LoadingSpinner';

interface AnalyticsPanelProps {
  shortCode: string | null;
  onClose: () => void;
}

export function AnalyticsPanel({ shortCode, onClose }: AnalyticsPanelProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    if (!shortCode) {
      setData(null);
      setPage(1);
      return;
    }

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const result = await getAnalytics(shortCode!, page, limit);
        setData(result);
      } catch (error) {
        toast.error(getErrorMessage(error));
        onClose();
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [shortCode, page, onClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    if (shortCode) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [shortCode, onClose]);

  const pagination = data?.pagination;

  return (
    <AnimatePresence>
      {shortCode && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[8vh] z-50 mx-auto max-h-[84vh] max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl sm:inset-x-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-title"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 id="analytics-title" className="text-lg font-semibold text-white">
                  Analytics
                </h3>
                <p className="font-mono text-sm text-violet-300">/{shortCode}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                aria-label="Close analytics"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: 'calc(84vh - 73px)' }}>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <LoadingSpinner size={32} />
                </div>
              ) : (
                <>
                  <div className="mb-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Total clicks
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-white">
                        {data?.totalClicks ?? pagination?.total ?? 0}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Page
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-white">
                        {pagination?.page ?? 1}
                        <span className="text-lg text-zinc-500">
                          {' '}
                          / {Math.max(pagination?.totalPages ?? 1, 1)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {!data?.analytics?.length ? (
                    <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
                      <Globe className="mx-auto mb-3 text-zinc-600" size={28} />
                      <p className="text-sm text-zinc-400">No clicks recorded yet</p>
                      <p className="mt-1 text-xs text-zinc-600">
                        Share your link to start collecting analytics
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.analytics.map((entry) => (
                        <div
                          key={entry._id}
                          className="rounded-xl border border-white/8 bg-black/20 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-sm text-zinc-300">
                                <Monitor size={14} className="shrink-0 text-zinc-500" />
                                <span className="truncate">
                                  {entry.userAgent ?? 'Unknown device'}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                                <span>IP: {entry.ipAddress ?? '—'}</span>
                                <span>Referrer: {entry.referrer || 'Direct'}</span>
                              </div>
                            </div>
                            <span className="shrink-0 text-xs text-zinc-600">
                              {formatDate(entry.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        type="button"
                        disabled={!pagination.hasPrevPage || loading}
                        onClick={() => setPage((p) => p - 1)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={!pagination.hasNextPage || loading}
                        onClick={() => setPage((p) => p + 1)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-40"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
