import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { ShortUrl } from '../types/api';
import { copyToClipboard } from '../utils/helpers';
import { GlassCard } from './GlassCard';

interface ShortUrlResultProps {
  url: ShortUrl;
}

export function ShortUrlResult({ url }: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(url.shortUrl);
    if (ok) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  }

  return (
    <GlassCard delay={0.1} className="border-violet-500/20 bg-violet-500/[0.06]">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-300">
        <Check size={16} />
        Your short link is ready
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <p className="truncate font-mono text-sm text-white">{url.shortUrl}</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{url.originalUrl}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <motion.button
            type="button"
            onClick={handleCopy}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </motion.button>

          <motion.a
            href={url.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
          >
            <ExternalLink size={16} />
            Open
          </motion.a>
        </div>
      </div>
    </GlassCard>
  );
}
