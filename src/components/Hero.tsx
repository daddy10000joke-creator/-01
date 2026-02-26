import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../context/SettingsContext';

const slides = [
  {
    image: 'https://picsum.photos/seed/apt/1920/1080',
    title: '아파트',
    desc: '삶의 질을 높이는 주거 공간'
  },
  {
    image: 'https://picsum.photos/seed/comm/1920/1080',
    title: '상가',
    desc: '브랜드의 가치를 담는 상업 공간'
  },
  {
    image: 'https://picsum.photos/seed/house/1920/1080',
    title: '주택',
    desc: '구조의 한계를 넘는 단독 주택'
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-white/80 text-sm font-medium tracking-widest uppercase mb-4 block">
            Taylor Design Interior
          </span>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
            공간의 종류는 달라도<br />
            완성도의 기준은 같습니다.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
            아파트 · 상가 · 주택 인테리어<br />
            상담부터 마감까지 직접 관리하는 실무형 시공 전문가
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-12 h-1 rounded-full transition-all ${
                  current === i ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
