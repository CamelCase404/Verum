import { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { toast } from "@/components/layout/ToastContainer";

export function AddProjectModal({ onClose }: { onClose: () => void }) {
  const { addProject } = useAppStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast("Пожалуйста, выберите изображение");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      toast("Заполните название и описание");
      return;
    }
    addProject({
      id: Date.now().toString(),
      title,
      description,
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    });
    toast("Проект добавлен");
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Добавить проект</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink-2">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Atlas UI"
              className="w-full border border-line-2 rounded-xl px-4 py-3 bg-surface outline-none focus:border-accent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink-2">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Что это за проект и какие задачи решает?"
              className="w-full border border-line-2 rounded-xl px-4 py-3 bg-surface outline-none focus:border-accent transition-all min-h-[80px] resize-y"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink-2">Обложка проекта</label>
            {image ? (
              <div className="relative rounded-xl overflow-hidden border border-line aspect-video">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging ? "border-accent bg-accent/5" : "border-line-2 hover:border-accent/50 hover:bg-surface-2"
                }`}
              >
                <UploadCloud size={32} className="mx-auto text-ink-4 mb-3" />
                <div className="text-[14px] font-medium text-ink mb-1">Нажмите или перетащите файл</div>
                <div className="text-[12px] text-ink-3">PNG, JPG до 5MB</div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="accent" onClick={handleSave}>Добавить</Button>
        </div>
      </div>
    </Modal>
  );
}
