import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { settings } = useSettings();

  const processes = [
    { title: '현장 방문 상담', desc: '공간의 상태를 직접 확인하고 니즈를 파악합니다.' },
    { title: '공간 분석 및 제안', desc: '전문적인 시각으로 최적의 레이아웃을 제안합니다.' },
    { title: '설계 설명 및 계약', desc: '상세 도면과 자재 리스트를 바탕으로 계약을 진행합니다.' },
    { title: '공사 진행', desc: '설계 의도가 구현되도록 현장을 직접 관리합니다.' },
    { title: '중간 점검', desc: '주요 공정마다 고객님과 함께 퀄리티를 체크합니다.' },
    { title: '마감 체크', desc: '작은 디테일 하나까지 완벽하게 마무리합니다.' },
    { title: '사후 관리 안내', desc: '공사 완료 후에도 지속적인 케어를 약속합니다.' },
  ];

  const filters = [
    '디자인과 완성도를 중요하게 생각하는 분',
    '공사를 맡기고 소통이 단절되기 싫은 분',
    '공간을 오래 사용할 계획인 분',
    '단순 시공이 아닌 감각적인 공간을 원하는 분',
  ];

  return (
    <div className="pb-20">
      <Hero />

      {/* Philosophy Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">디자인 감각을 가진 기술자</h2>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">왜 디자인이 중요한가</h3>
                <p className="text-slate-600 leading-relaxed">
                  {settings?.philosophy_design}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">왜 직접 관리하는가</h3>
                <p className="text-slate-600 leading-relaxed">
                  {settings?.philosophy_const}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">공사 프로세스</h2>
            <p className="text-slate-500">불안을 제거하는 투명하고 체계적인 단계</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {processes.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
              >
                <span className="text-primary/20 text-4xl font-bold mb-4 block">0{i + 1}</span>
                <h4 className="font-bold mb-2 text-sm">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400 italic">* 모든 공사는 정식 계약서 작성을 원칙으로 합니다.</p>
          </div>
        </div>
      </section>

      {/* Filtering Section */}
      <section className="py-24 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">이런 분들과 잘 맞습니다</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filters.map((f, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <CheckCircle2 className="text-emerald-400 shrink-0" />
                <p className="font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">공간에 대한 고민이 있다면<br />먼저 이야기를 들어보겠습니다.</h2>
          <p className="text-slate-500 mb-12">상담은 무료이며, 당신의 공간에 가장 적합한 제안을 드립니다.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href={`tel:${settings?.phone}`}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-primary/20"
            >
              <Phone size={24} />
              {settings?.phone}
            </a>
            <Link
              to="/portfolio"
              className="w-full md:w-auto flex items-center justify-center gap-2 text-primary font-bold hover:underline"
            >
              포트폴리오 보러가기 <ArrowRight size={20} />
            </Link>
          </div>
          <div className="mt-12 text-slate-400 text-sm">
            상담 가능 시간: 평일 09:00 - 18:00 / 토요일 10:00 - 15:00
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
