import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col items-center text-center"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Link2 className="text-white" size={22} />
        </div>
        <span className="text-xl font-semibold tracking-tight text-white">ClipURL</span>
      </div>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Short links,{' '}
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
          big insights
        </span>
      </h1>
      <p className="mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
        Create polished short URLs in seconds and track every click with a clean, modern dashboard.
      </p>
    </motion.header>
  );
}
