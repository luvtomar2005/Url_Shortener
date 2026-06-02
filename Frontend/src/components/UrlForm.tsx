import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createShortUrl } from '../api/urlApi';
import { getErrorMessage } from '../api/axios';
import type { ShortUrl } from '../types/api';
import { GlassCard } from './GlassCard';
import { LoadingSpinner } from './LoadingSpinner';

interface UrlFormProps {
  onCreated: (url: ShortUrl) => void;
}

export function UrlForm({ onCreated }: UrlFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = originalUrl.trim();
    if (!trimmed) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const result = await createShortUrl({
        originalUrl: trimmed,
        customAlias: customAlias.trim() || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });
      onCreated(result);
      toast.success('Short URL created successfully');
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="originalUrl" className="mb-2 block text-sm font-medium text-zinc-300">
            Destination URL
          </label>
          <input
            id="originalUrl"
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/your-long-link"
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="customAlias" className="mb-2 block text-sm font-medium text-zinc-300">
            Custom alias <span className="text-zinc-500">(optional)</span>
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-violet-500/60 focus-within:ring-2 focus-within:ring-violet-500/20">
            <span className="shrink-0 text-sm text-zinc-500">/</span>
            <input
              id="customAlias"
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
              placeholder="my-link"
              disabled={loading}
              maxLength={20}
              className="w-full bg-transparent text-white placeholder:text-zinc-500 outline-none disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="expiresAt" className="mb-2 block text-sm font-medium text-zinc-300">
            Expiration date <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            disabled={loading}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60 [color-scheme:dark]"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoadingSpinner size={18} className="text-white" />
              Shortening…
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Shorten URL
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </motion.button>
      </form>
    </GlassCard>
  );
}
