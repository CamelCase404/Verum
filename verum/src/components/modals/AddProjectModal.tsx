import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Loader2, UploadCloud, Trash2 } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

export function AddProjectModal({ onClose, backendUser, onRefresh }: { onClose: () => void, backendUser: any, onRefresh: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) return toast("Введите название проекта");
    
    setLoading(true);
    try {
      // 1. Загружаем все выбранные картинки
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const uploadRes = await authApi.uploadImage(file);
        uploadedUrls.push(uploadRes.url);
      }

      // 2. Формируем объект проекта
      const newProject = { 
        id: Date.now().toString(), 
        title, 
        description, 
        cover: uploadedUrls[0] || "", // Первая картинка идет как обложка
        images: uploadedUrls // Все картинки в массив
      };
      
      const currentProjects = backendUser?.projects || [];
      
      await authApi.updateProfile({ projects: [...currentProjects, newProject] });
      toast("Проект добавлен");
      onRefresh();
      onClose();
    } catch (e: any) {
      toast(e.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-line rounded-2xl p-6 w-full max-w-[calc(100vw-2rem)] sm:max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
        <h2 className="text-xl font-bold mb-4">Добавить проект</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Название</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-bg-2 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" placeholder="Мой проект" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Описание</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-bg-2 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" placeholder="О чем этот проект?" />
          </div>
          
          {/* Загрузка картинок проекта */}
          <div>
            <label className="text-sm font-medium mb-1 block">Галерея проекта</label>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-line group">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(i)} 
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">Обложка</span>}
                </div>
              ))}
              
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="aspect-video rounded-lg border border-dashed border-line-2 flex flex-col items-center justify-center text-ink-4 hover:bg-surface-2 transition-colors"
              >
                <UploadCloud size={20} />
                <span className="text-[10px] mt-1">Добавить</span>
              </button>
            </div>
            
            <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <p className="text-[11px] text-ink-3">Первая картинка станет обложкой проекта.</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-line">
          <button onClick={onClose} className="px-4 py-2 rounded-lg font-medium hover:bg-surface-2 transition-colors">Отмена</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-2 transition-colors flex items-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />} Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  );
}
