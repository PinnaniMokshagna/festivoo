import { motion } from 'framer-motion';
import { Upload, Star } from 'lucide-react';

const portfolioImages = [
  'https://images.pexels.com/photos/32315685/pexels-photo-32315685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/37058552/pexels-photo-37058552.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/35042459/pexels-photo-35042459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/25956380/pexels-photo-25956380.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/19021379/pexels-photo-19021379.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/33539320/pexels-photo-33539320.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export function PortfolioPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-premium sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-dark-900">Portfolio</h3>
          <p className="text-sm text-muted-foreground">Showcase your best work</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md">
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {portfolioImages.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="group relative aspect-square overflow-hidden rounded-xl bg-cream-100"
          >
            <img
              src={url}
              alt="Portfolio work"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {i === 0 && (
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-dark-900/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                <Star className="h-2.5 w-2.5 text-gold-400" />
                Featured
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
