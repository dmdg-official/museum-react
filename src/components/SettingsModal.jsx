import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('DMDG_GEMINI_KEY') || '');
      setSavedNotice('');
    }
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('DMDG_GEMINI_KEY', trimmed);
      setSavedNotice('Gemini API 키가 이 브라우저에 안전하게 저장되었습니다.');
    } else {
      localStorage.removeItem('DMDG_GEMINI_KEY');
      setSavedNotice('저장된 Gemini API 키가 삭제되었습니다. 기본 내장 콘텐츠로 동작합니다.');
    }
  };

  const handleClear = () => {
    localStorage.removeItem('DMDG_GEMINI_KEY');
    setApiKey('');
    setSavedNotice('API 키가 초기화되었습니다.');
  };

  const handleTestVoice = () => {
    if (!window.speechSynthesis) {
      setSavedNotice('이 브라우저는 음성 합성(TTS)을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance('소담 라이브 음성 테스트입니다. 따뜻한 마음의 소리가 들리시나요?');
    utter.lang = 'ko-KR';
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    setSavedNotice('음성 테스트를 재생했습니다. 소리가 나지 않으면 기기 음량과 무음 스위치를 확인하세요.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-slate-800"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div>
                <h3 className="serif text-xl font-bold text-blue-950">⚙️ 소담 라이브 환경 설정</h3>
                <p className="text-xs text-slate-500 mt-1">모든 설정은 서버가 아닌 내 브라우저(LocalStorage)에만 저장됩니다.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm"
                aria-label="설정 닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="sodam-gemini-key" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gemini API 키 (선택 사항 — AI 도슨트·시조 생성용)
                </label>
                <input
                  id="sodam-gemini-key"
                  name="geminiApiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza... (미입력 시 행복한가 & 기본 큐레이션 사용)"
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  오늘의 마중물은 API 키 없이도 <b>행복한가(m-letter.or.kr)</b> 실제 수필·명언과 실시간 연동됩니다.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-[11px] text-amber-900 leading-relaxed">
                <div className="font-bold mb-1">📱 아이폰/아이패드(iOS) 음성 낭독 안내</div>
                <div>
                  iOS 기기에서 낭독 소리가 들리지 않을 때는 기기 측면 <b>무음(진동) 스위치를 해제</b>하고, 제어센터 <b>미디어 음량 및 알림 소리</b>가 켜져 있는지 확인해 주세요.
                </div>
              </div>

              {savedNotice && (
                <div className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
                  {savedNotice}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  저장하기
                </button>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition"
                >
                  🔊 음성 테스트
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
                  >
                    키 삭제
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal;

