import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { chatApi, getToken } from "@/api";
import { Send, ArrowLeft, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "@/components/layout/ToastContainer";

export function Messages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    
    chatApi.getConversations().then(res => {
      setConversations(res.data);
      const chatId = searchParams.get("chat");
      if (chatId) {
        const found = res.data.find((c: any) => c.id.toString() === chatId);
        if (found) setActiveConv(found);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    
    const fetchMessages = () => {
      chatApi.getMessages(activeConv.id).then(res => {
        setMessages(res.data);
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 100);
      }).catch(console.error);
    };
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConv]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast("Фото слишком большое (максимум 2 МБ)");
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if ((!text.trim() && !selectedImage) || !activeConv) return;
    
    setIsUploading(true);
    try {
      let imageUrl = undefined;
      if (selectedImage) {
        const uploadRes = await chatApi.uploadChatImage(activeConv.id, selectedImage);
        imageUrl = uploadRes.url;
      }
      
      await chatApi.sendMessage(activeConv.id, text, imageUrl);
      setText("");
      clearImage();
      
      const res = await chatApi.getMessages(activeConv.id);
      setMessages(res.data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    } catch (e: any) { 
      toast(e.message || "Ошибка отправки"); 
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex w-full h-full overflow-hidden bg-bg">
      
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className={`w-full md:w-[320px] lg:w-[380px] border-r border-line-2 flex-col bg-surface shadow-[2px_0_12px_rgba(0,0,0,0.04)] dark:shadow-[2px_0_12px_rgba(0,0,0,0.4)] z-10 h-full ${activeConv ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-line bg-surface">
          <h1 className="text-xl font-bold tracking-tight">Сообщения</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
             <div className="text-center text-ink-3 text-sm mt-10">Загрузка...</div>
          ) : conversations.map(c => (
            <button 
              key={c.id} 
              onClick={() => { setActiveConv(c); clearImage(); setText(""); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeConv?.id === c.id ? "bg-accent/10 border border-accent/30 shadow-sm" : "hover:bg-surface-2 border border-transparent"}`}
            >
              <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center overflow-hidden flex-shrink-0">
                {c.other_avatar ? <img src={c.other_avatar} className="w-full h-full object-cover" /> : c.other_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{c.other_name}</div>
                <div className="text-xs text-ink-3 truncate">{c.last_message}</div>
              </div>
              {c.unread > 0 && <div className="w-5 h-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center flex-shrink-0">{c.unread}</div>}
            </button>
          ))}
          {!loading && conversations.length === 0 && <div className="text-center text-ink-3 text-sm mt-10">Нет активных чатов</div>}
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className={`flex-1 flex flex-col bg-bg relative h-full min-h-0 overflow-hidden ${activeConv ? "flex" : "hidden md:flex"}`}>
        {activeConv ? (
          <>
            <div className="p-3 border-b border-line bg-surface flex items-center gap-3 shadow-sm z-10">
              <button onClick={() => setActiveConv(null)} className="md:hidden text-ink-3 hover:text-ink"><ArrowLeft size={20} /></button>
              <button onClick={() => navigate(`/profile/${activeConv.other_id}`)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center overflow-hidden">
                  {activeConv.other_avatar ? <img src={activeConv.other_avatar} className="w-full h-full object-cover" /> : activeConv.other_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{activeConv.other_name}</div>
                  <div className="text-[11px] text-accent">Перейти в профиль</div>
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex ${m.is_mine ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-[15px] leading-relaxed break-words ${
                    m.is_mine ? "bg-accent text-white rounded-br-sm" : "bg-surface border border-line text-ink rounded-bl-sm"
                  }`}>
                    {m.image_url && (
                      <img src={m.image_url} alt="Attached" className="max-w-full rounded-lg mb-2 object-cover max-h-[300px]" />
                    )}
                    {m.text && <div>{m.text}</div>}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Превью выбранного фото */}
            {imagePreview && (
              <div className="px-3 pt-3 bg-surface flex items-center gap-2">
                <div className="relative">
                  <img src={imagePreview} className="h-16 w-16 object-cover rounded-lg border border-line" />
                  <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
                </div>
                <span className="text-sm text-ink-3">Фото готово к отправке</span>
              </div>
            )}

            <div className="p-2 sm:p-3 bg-surface border-t border-line flex gap-2 items-end shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-2.5 text-ink-3 hover:text-accent transition-colors bg-bg-2 rounded-xl"
                title="Прикрепить фото"
              >
                <ImageIcon size={20} />
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              
              <textarea 
                value={text} 
                onChange={e => setText(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Написать сообщение..." 
                rows={1}
                className="flex-1 bg-bg-2 border border-transparent rounded-xl px-4 py-2.5 text-[15px] outline-none focus:border-accent focus:ring-1 focus:ring-accent caret-accent selection:bg-accent selection:text-white transition-colors resize-none max-h-32 min-h-[44px]" 
              />
              
              <button 
                onClick={sendMessage} 
                disabled={isUploading || (!text.trim() && !selectedImage)} 
                className="p-2.5 bg-accent text-white rounded-xl hover:bg-accent-2 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-ink-3 h-full w-full">
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4"><Send size={24} /></div>
            <p>Выберите чат, чтобы начать общение</p>
          </div>
        )}
      </div>
    </div>
  );
}
