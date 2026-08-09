import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, Bot, User, Scale, Calculator, ShieldCheck, Heart } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, products, setSelectedProduct, setActiveView } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Assalamu’alaikum! Saya Asisten AI Kurban Nasional. Ada yang bisa saya bantu terkait Fiqih Kurban, rekomendasi bobot & harga hewan, atau pemilihan lokasi distribusi 3T?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Smart Price Recommendation Calculator state
  const [calcType, setCalcType] = useState<'sapi' | 'kambing' | 'domba'>('sapi');
  const [calcWeight, setCalcWeight] = useState<number>(350);

  const estimatedFairPrice =
    calcType === 'sapi'
      ? Math.round(calcWeight * 52000)
      : calcType === 'kambing'
      ? Math.round(calcWeight * 88000)
      : Math.round(calcWeight * 85000);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      const queryLower = userText.toLowerCase();

      if (queryLower.includes('fatwa') || queryLower.includes('online') || queryLower.includes('sah')) {
        aiText = 'Berdasarkan Fatwa MUI, kurban online melalui marketplace terverifikasi adalah SAH secara syari’at dengan akad Wakalah (pemberian kuasa). Seluruh hewan di Kurban Nasional dijamin dengan dokumen SKKH resmi Kementan RI.';
      } else if (queryLower.includes('murah') || queryLower.includes('harga') || queryLower.includes('rekomendasi')) {
        aiText = 'Untuk budget ekonomis, kami merekomendasikan Kambing Etawa Super (Rp 3,2 Jt) atau Sapi Bali (Rp 14,2 Jt) yang diolah menjadi Kornet/Rendang Superqurban tahan 3 tahun.';
      } else if (queryLower.includes('3t') || queryLower.includes('pelosok') || queryLower.includes('distribusi')) {
        aiText = 'Penyaluran ke wilayah 3T (Nusa Tenggara Timur, Papua, Halmahera) sangat dianjurkan karena konsumsi daging di daerah tersebut masih sangat rendah. Anda dapat memilih program Tebar Hewan Pelosok.';
      } else {
        aiText = `Terima kasih Pertanyaannya! Terkait "${userText}", Kurban Nasional telah memverifikasi seluruh stok sapi, kambing, dan domba bersama lembaga resmi seperti Dompet Dhuafa, Rumah Zakat, dan BAZNAS RI. Apakah Anda ingin memilih hewan kurban sekarang?`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating launcher button when chat card is closed */}
      {!isAiModalOpen && (
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3 px-4.5 rounded-full shadow-2xl border-2 border-amber-400 flex items-center gap-2.5 transition-all transform hover:scale-105 group"
          title="Chat AI Asisten Kurban"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide text-emerald-50 font-serif">AI Asisten Kurban</span>
        </button>
      )}

      {/* Opened Chat Window fixed at Bottom Right with 20% blur backdrop */}
      {isAiModalOpen && (
        <>
          {/* Backdrop with 20% opacity and subtle blur */}
          <div 
            onClick={() => setIsAiModalOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs transition-opacity duration-300"
            title="Klik untuk menutup"
          />

          {/* Floating Chat Card - Bottom Right Positioned */}
          <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-lg h-[590px] max-h-[85vh] z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-emerald-200/90 overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="bg-emerald-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 rounded-xl text-emerald-950 font-bold shadow-xs">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-emerald-100">AI Asisten Kurban</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online Active" />
                  </div>
                  <p className="text-[10px] text-emerald-300 font-medium">Konsultasi Syariah & Predictor Harga</p>
                </div>
              </div>

              <button 
                onClick={() => setIsAiModalOpen(false)} 
                className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-900 transition-colors"
                title="Tutup Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kalkulator AI Harga Ideal */}
            <div className="bg-emerald-50/80 p-3 border-b border-emerald-100 text-xs space-y-2 shrink-0">
              <div className="flex justify-between items-center font-bold text-emerald-950">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calculator className="w-3.5 h-3.5 text-amber-600" /> AI Price & Meat Predictor
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Estimasi Fair Price
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={calcType}
                  onChange={(e: any) => setCalcType(e.target.value)}
                  className="bg-white border border-emerald-200 rounded-xl p-1.5 font-bold text-xs text-emerald-950 outline-hidden"
                >
                  <option value="sapi">Sapi</option>
                  <option value="kambing">Kambing</option>
                  <option value="domba">Domba</option>
                </select>

                <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-xl px-2 text-xs">
                  <span className="text-gray-400 text-[10px]">Berat:</span>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-12 font-bold text-emerald-900 outline-hidden text-right text-xs"
                  />
                  <span className="text-[10px] text-gray-500 font-medium">kg</span>
                </div>

                <div className="bg-emerald-900 text-amber-300 p-1.5 rounded-xl font-bold text-center text-xs flex items-center justify-center shadow-xs">
                  Rp {estimatedFairPrice.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0 no-scrollbar">
              <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0">Tanya:</span>
              <button
                onClick={() => setInputQuery('Apakah kurban online sah menurut MUI?')}
                className="bg-white border border-slate-200 text-slate-700 hover:border-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                Fatwa MUI Sah?
              </button>
              <button
                onClick={() => setInputQuery('Rekomendasi sapi untuk budget 15 juta')}
                className="bg-white border border-slate-200 text-slate-700 hover:border-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                Rekomendasi 15 Jt
              </button>
              <button
                onClick={() => setInputQuery('Bagaimana penyaluran hewan ke wilayah 3T NTT?')}
                className="bg-white border border-slate-200 text-slate-700 hover:border-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                Penyaluran 3T
              </button>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[88%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-emerald-950'
                        : 'bg-emerald-900 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-2xl space-y-1 shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-emerald-900 text-white font-medium rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed text-xs">{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-xs italic bg-white p-2.5 rounded-2xl w-fit border border-slate-200">
                  <Bot className="w-4 h-4 text-emerald-800 animate-bounce" />
                  <span>AI Asisten sedang menganalisis data...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ketik pertanyaan seputar kurban..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
              />
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white p-2.5 rounded-xl font-bold shadow-xs transition-colors shrink-0"
                title="Kirim"
              >
                <Send className="w-4 h-4 text-amber-400" />
              </button>
            </form>

          </div>
        </>
      )}
    </>
  );
};
