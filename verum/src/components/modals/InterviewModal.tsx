import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loader2, Play } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

export function InterviewModal({ onClose }: { onClose: () => void }) {
  const { updateProfile } = useAppStore();
  const [step, setStep] = useState<"start" | "loading">("start");

  const startTest = () => {
    setStep("loading");
    // Имитация прохождения собеседования (в будущем здесь будет запрос к API)
    setTimeout(() => {
      updateProfile({
        tested: true,
        scores: { arch: 85, code: 92, ai: 88, adapt: 80 }
      });
      toast("Собеседование успешно пройдено!");
      onClose();
    }, 2500);
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-8 text-center">
        {step === "start" ? (
          <>
            <div className="w-16 h-16 bg-accent-soft text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Play size={28} />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Пройти собеседование</h2>
            <p className="text-ink-2 text-sm leading-relaxed mb-8">
              Искусственный интеллект проверит ваше архитектурное мышление, навыки ревью кода и способность адаптироваться. Это займет около 20 минут.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={onClose}>Отмена</Button>
              <Button variant="accent" onClick={startTest}>Начать тест</Button>
            </div>
          </>
        ) : (
          <div className="py-10">
            <Loader2 size={48} className="animate-spin text-accent mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-2">Анализируем ваши ответы...</h3>
            <p className="text-ink-3 text-sm">Пожалуйста, подождите</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
