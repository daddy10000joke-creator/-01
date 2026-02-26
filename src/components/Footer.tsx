import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">테일러 디자인</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md">
            공간의 종류는 달라도 완성도의 기준은 같습니다.<br />
            아파트 · 상가 · 주택 인테리어, 상담부터 마감까지 직접 관리합니다.
          </p>
        </div>
        <div className="flex flex-col md:items-end space-y-2">
          <p className="text-sm font-semibold text-slate-900">상담 문의</p>
          <p className="text-2xl font-bold text-primary">{settings?.phone}</p>
          <p className="text-xs text-slate-400">© 2024 Taylor Design. All rights reserved.</p>
          <Link to="/admin" className="text-xs text-slate-300 hover:text-slate-500 mt-4">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
