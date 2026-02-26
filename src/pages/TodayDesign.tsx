import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TodayDesignItem } from '../types';
import { ArrowRight } from 'lucide-react';

const TodayDesign = () => {
  const [items, setItems] = useState<TodayDesignItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayDesign = async () => {
      try {
        const res = await fetch('/api/today-design');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch today design:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayDesign();
  }, []);

  return (
    <div className="pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">오늘의 디자인</h1>
        <p className="text-slate-500">일상의 구조물에 숨겨진 인테리어의 가능성을 제안합니다.</p>
      </div>

      {loading ? (
        <div className="space-y-24">
          {[1, 2].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-12 animate-pulse">
              <div className="aspect-video bg-slate-100 rounded-3xl" />
              <div className="space-y-4">
                <div className="h-8 bg-slate-100 w-1/2 rounded" />
                <div className="h-24 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-32">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Before</span>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.before_img} alt="Before" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">After</span>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 shadow-2xl shadow-primary/10">
                      <img src={item.after_img} alt="After" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
                  <div className="w-12 h-1 bg-primary mb-8" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <ArrowRight size={14} className="text-primary" />
                      소재 (Material)
                    </h4>
                    <p className="text-slate-600 leading-relaxed pl-6">{item.material}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <ArrowRight size={14} className="text-primary" />
                      디자인 의도 (Intent)
                    </h4>
                    <p className="text-slate-600 leading-relaxed pl-6">{item.intent}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-32 text-slate-400">
          등록된 제안이 없습니다.
        </div>
      )}
    </div>
  );
};

export default TodayDesign;
