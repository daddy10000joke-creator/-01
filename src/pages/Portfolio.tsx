import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PortfolioItem } from '../types';
import { cn } from '../lib/utils';
import { MapPin, Maximize, Wrench, Lightbulb, CheckCircle } from 'lucide-react';

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'apartment' | 'commercial' | 'house'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio${filter !== 'all' ? `?category=${filter}` : ''}`);
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [filter]);

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'apartment', name: '아파트' },
    { id: 'commercial', name: '상가' },
    { id: 'house', name: '주택' },
  ];

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">포트폴리오</h1>
        <p className="text-slate-500">공간의 가치를 증명하는 테일러 디자인의 기록들</p>
      </div>

      <div className="flex justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              filter === cat.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 bg-slate-100">
                <img
                  src={item.images[0] || 'https://picsum.photos/seed/placeholder/800/1000'}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {item.category === 'apartment' ? 'Apartment' : item.category === 'commercial' ? 'Commercial' : 'House'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>

                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} className="text-primary" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Maximize size={14} className="text-primary" />
                    <span>{item.size}</span>
                  </div>
                  <div className="col-span-2 flex items-start gap-2 text-slate-500">
                    <Wrench size={14} className="text-primary mt-1 shrink-0" />
                    <span>{item.scope}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex gap-3">
                    <Lightbulb size={18} className="text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Design Intent</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.intent}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle size={18} className="text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Key Points</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.points}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-32 text-slate-400">
          등록된 포트폴리오가 없습니다.
        </div>
      )}
    </div>
  );
};

export default Portfolio;
