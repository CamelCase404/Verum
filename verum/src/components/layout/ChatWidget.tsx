import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ArrowLeft } from "lucide-react";
import { chatApi } from "@/api";
import { useAppStore } from "@/store/useAppStore";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = useAppStore(s => s.user);

  // Загрузка списка чатов при открытии
  useEffect(() => {
    if (isOpen && !activeConv) {
      chatApi.getConversations().then(res => setConversations(res.data)).catch(console.error);
    }
  }, [isOpen, activeConv]);

  // Загрузка сообщений и поллинг (каждые 3 сек)
  useEffect(() => {
    if (!activeConv) return;
    
    const fetchMessages = () => {
      chatApi.getMessages(activeConv.id).then(res => {
        setMessages(res.data);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }).catch(console.error);
    };
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConv]);

  const sendMessage = async () => {
    if (!text.trim() || !activeConv) return;
    try {
      await chatApi.sendMessage(activeConv.id, text);
      setText("");
      const res = await chatApi.getMessages(activeConv.id);
      setMessages(res.data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null; // Не показываем чат гостям

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-surface border border-line rounded-2xl shadow-2xl w-[350px] h-[500px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Шапка */}
          <div className="bg-surface-2 p-4 border-b border-line flex items-center justify-between">
            {activeConv ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveConv(null)} className="text-ink-3 hover:text-ink"><ArrowLeft size={18} /></button>
                <span className="font-semibold text-sm">{activeConv.other_name}</span>
              </div>
            ) : (
              <span className="font-semibold text-sm">Сообщения</span>
            )}
            <button onClick={() => setIsOpen(false)} className="text-ink-3 hover:text-ink"><X size={18} /></button>
          </div>

          {/* Контент */}
          <div className="flex-1 overflow-y-auto bg-bg p-3 space-y-3">
            {!activeConv ? (
              conversations.length > 0 ? (
                conversations.map(c => (
                  <button key={c.id} onClick={() => setActiveConv(c)} className="w-full text-left p-3 bg-surface border border-line rounded-xl hover:bg-surface-2 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{c.other_name}</span>
                      {c.unread > 0 && <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{c.unread}</span>}
                    </div>
                    <div className="text-xs text-ink-3 truncate">{c.last_message}</div>
                  </button>
                ))
              ) : (
                <div className="text-center text-ink-3 text-sm mt-10">Нет активных чатов</div>
              )
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex ${m.is_mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-xl text-sm ${m.is_mine ? "bg-accent text-white rounded-br-sm" : "bg-surface-2 text-ink rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          {activeConv && (
            <div className="p-3 bg-surface border-t border-line flex gap-2">
              <input 
                value={text} 
                onChange={e => setText(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Написать..." 
                className="flex-1 bg-bg-2 rounded-lg px-3 py-2 text-sm outline-none" 
              />
              <button onClick={sendMessage} className="bg-accent text-white p-2 rounded-lg hover:bg-accent-2"><Send size={16} /></button>
            </div>
          )}
        </div>
      )}

      {/* Кнопка открытия */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent-2 transition-transform hover:scale-105"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
