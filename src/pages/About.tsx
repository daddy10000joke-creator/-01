import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { User, Award, ShieldCheck, MessageSquare } from 'lucide-react';

const About = () => {
  const { settings } = useSettings();

  const strengths = [
    { icon: <MessageSquare />, title: '상담 따로, 현장 따로 아님', desc: '첫 상담을 진행한 제가 직접 현장을 지키며 소통합니다.' },
    { icon: <ShieldCheck />, title: '하청 위주 구조 아님', desc: '검증된 직영 팀과 함께 높은 시공 퀄리티를 유지합니다.' },
    { icon: <Award />, title: '15년 이상의 현장 경력', desc: '수많은 현장에서 쌓은 노하우로 어떠한 변수도 해결합니다.' },
    { icon: <User />, title: '빠르고 정확한 소통', desc: '현장 상황을 실시간으로 공유하며 투명하게 진행합니다.' },
  ];

  return (
    <div className="pt-32 pb-24">
      {/* Profile Section */}
      <section className="px-4 max-w-7xl mx-auto mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100">
              <img
                src={settings?.about_image || "https://picsum.photos/seed/profile/800/1000"}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-3xl hidden md:block">
              <p className="text-sm font-medium opacity-80 mb-1">Taylor Design CEO</p>
              <p className="text-2xl font-bold">{settings?.about_name}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-6">디자인을 이해하는<br />실무형 시공 전문가</h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {settings?.about_bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-3xl font-bold text-primary">15+</p>
                <p className="text-sm text-slate-500">경력 연차</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">300+</p>
                <p className="text-sm text-slate-500">완료 프로젝트</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Strengths Section */}
      <section className="bg-slate-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">테일러 디자인의 약속</h2>
            <p className="text-slate-500">우리가 신뢰를 얻는 방식</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                  {s.icon}
                </div>
                <h4 className="font-bold mb-3">{s.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Field Photos */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">현장의 기록</h2>
          <p className="text-slate-500">도면이 현실이 되는 순간들을 직접 관리합니다.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={`https://picsum.photos/seed/field${i}/800/800`}
                alt="Field"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
