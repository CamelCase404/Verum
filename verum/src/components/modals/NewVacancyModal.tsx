import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/layout/ToastContainer";

export function NewVacancyModal({
 onClose }: { onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [desc, setDesc] = useState("");

  const handleSave = () => {
    if (!title.trim() || !desc.trim()) {
      toast("Заполните все обязательные поля");
      return;
    }
    toast("Вакансия успешно создана и отправлена на модерацию");
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Новая вакансия</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink-2">Должность *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Senior Frontend Developer"
              className="w-full border border-line-2 rounded-xl px-4 py-3 bg-surface outline-none focus:border-accent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink-2">Описание вакансии *</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Опишите задачи, требования, стек и условия работы..."
              className="w-full border border-line-2 rounded-xl px-4 py-3 bg-surface outline-none focus:border-accent transition-all min-h-[120px] resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-ink-2">Зарплата (₽)</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Например: от 200 000 ₽ на руки"
              className="w-full border border-line-2 rounded-xl px-4 py-3 bg-surface outline-none focus:border-accent transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-line">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="accent" onClick={handleSave}>Опубликовать</Button>
        </div>
      </div>
    </Modal>
  );
}
