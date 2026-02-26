import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { Lock, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { PortfolioItem, TodayDesignItem } from '../types';

const Admin = () => {
  const { settings, refreshSettings } = useSettings();
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'portfolio' | 'today'>('settings');

  // List states
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [todays, setTodays] = useState<TodayDesignItem[]>([]);

  // Form states
  const [editSettings, setEditSettings] = useState<any>(null);
  const [newPortfolio, setNewPortfolio] = useState({
    category: 'apartment',
    title: '',
    location: '',
    size: '',
    scope: '',
    intent: '',
    points: '',
    images: ['']
  });
  const [newToday, setNewToday] = useState({
    title: '',
    before_img: '',
    after_img: '',
    material: '',
    intent: ''
  });

  const [uploading, setUploading] = useState(false);

  const fetchLists = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/today-design')
      ]);
      setPortfolios(await pRes.json());
      setTodays(await tRes.json());
    } catch (error) {
      console.error('Failed to fetch lists:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        callback(data.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLists();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      setIsLoggedIn(true);
      setEditSettings(settings);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleSaveSettings = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, settings: editSettings })
    });
    if (res.ok) {
      alert('저장되었습니다.');
      refreshSettings();
    }
  };

  const handleAddPortfolio = async () => {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, item: newPortfolio })
    });
    if (res.ok) {
      alert('추가되었습니다.');
      setNewPortfolio({
        category: 'apartment',
        title: '',
        location: '',
        size: '',
        scope: '',
        intent: '',
        points: '',
        images: ['']
      });
      fetchLists();
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      fetchLists();
    }
  };

  const handleAddToday = async () => {
    const res = await fetch('/api/today-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, item: newToday })
    });
    if (res.ok) {
      alert('추가되었습니다.');
      setNewToday({
        title: '',
        before_img: '',
        after_img: '',
        material: '',
        intent: ''
      });
      fetchLists();
    }
  };

  const handleDeleteToday = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/today-design/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      fetchLists();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-primary">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">관리자 로그인</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
            />
            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
              접속하기
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold">관리자 패널</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'settings' ? 'bg-primary text-white' : 'bg-slate-100'}`}
          >
            기본 설정
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'portfolio' ? 'bg-primary text-white' : 'bg-slate-100'}`}
          >
            포트폴리오 관리
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'today' ? 'bg-primary text-white' : 'bg-slate-100'}`}
          >
            오늘의 디자인 관리
          </button>
        </div>
      </div>

      {activeTab === 'settings' && editSettings && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">전화번호</label>
              <input
                value={editSettings.phone}
                onChange={(e) => setEditSettings({ ...editSettings, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">CEO 성함</label>
              <input
                value={editSettings.about_name}
                onChange={(e) => setEditSettings({ ...editSettings, about_name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-slate-500">디자인 철학</label>
              <textarea
                value={editSettings.philosophy_design}
                onChange={(e) => setEditSettings({ ...editSettings, philosophy_design: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-slate-500">시공 철학</label>
              <textarea
                value={editSettings.philosophy_const}
                onChange={(e) => setEditSettings({ ...editSettings, philosophy_const: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-slate-500">CEO 소개</label>
              <textarea
                value={editSettings.about_bio}
                onChange={(e) => setEditSettings({ ...editSettings, about_bio: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-slate-500">CEO 프로필 이미지</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={editSettings.about_image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setEditSettings({ ...editSettings, about_image: url }))}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold"
          >
            <Save size={18} /> 설정 저장
          </button>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">새 포트폴리오 추가</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">카테고리</label>
                <select
                  value={newPortfolio.category}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                >
                  <option value="apartment">아파트</option>
                  <option value="commercial">상가</option>
                  <option value="house">주택</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">제목</label>
                <input
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">위치</label>
                <input
                  value={newPortfolio.location}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">평수/규모</label>
                <input
                  value={newPortfolio.size}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, size: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">공사 범위</label>
                <input
                  value={newPortfolio.scope}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, scope: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">설계 의도</label>
                <textarea
                  value={newPortfolio.intent}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, intent: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">주요 마감 포인트</label>
                <textarea
                  value={newPortfolio.points}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, points: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">이미지 업로드</label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {newPortfolio.images.filter(img => img).map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setNewPortfolio({ ...newPortfolio, images: newPortfolio.images.filter((_, i) => i !== idx) })}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setNewPortfolio({ ...newPortfolio, images: [...newPortfolio.images.filter(i => i), url] }))}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-[10px] text-slate-400 mt-1">직접 URL을 입력하려면 아래 필드를 사용하세요.</p>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">이미지 URL (쉼표로 구분)</label>
                <input
                  value={newPortfolio.images.join(',')}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, images: e.target.value.split(',') })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
            <button
              onClick={handleAddPortfolio}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold"
            >
              <Plus size={18} /> 포트폴리오 추가
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">포트폴리오 목록</h2>
            <div className="grid gap-4">
              {portfolios.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                      <img src={p.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.category} | {p.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePortfolio(p.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'today' && (
        <div className="space-y-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold">새 오늘의 디자인 추가</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">제목</label>
                <input
                  value={newToday.title}
                  onChange={(e) => setNewToday({ ...newToday, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Before 이미지</label>
                <div className="flex items-center gap-4 mb-2">
                  {newToday.before_img && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                      <img src={newToday.before_img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setNewToday({ ...newToday, before_img: url }))}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
                <input
                  placeholder="또는 이미지 URL 입력"
                  value={newToday.before_img}
                  onChange={(e) => setNewToday({ ...newToday, before_img: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">After 이미지</label>
                <div className="flex items-center gap-4 mb-2">
                  {newToday.after_img && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                      <img src={newToday.after_img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setNewToday({ ...newToday, after_img: url }))}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
                <input
                  placeholder="또는 이미지 URL 입력"
                  value={newToday.after_img}
                  onChange={(e) => setNewToday({ ...newToday, after_img: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">소재</label>
                <textarea
                  value={newToday.material}
                  onChange={(e) => setNewToday({ ...newToday, material: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-bold text-slate-500">디자인 의도</label>
                <textarea
                  value={newToday.intent}
                  onChange={(e) => setNewToday({ ...newToday, intent: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 h-24"
                />
              </div>
            </div>
            <button
              onClick={handleAddToday}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold"
            >
              <Plus size={18} /> 제안 추가
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">오늘의 디자인 목록</h2>
            <div className="grid gap-4">
              {todays.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border-2 border-white">
                        <img src={t.before_img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border-2 border-white">
                        <img src={t.after_img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{t.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteToday(t.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
