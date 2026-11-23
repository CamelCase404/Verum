import { useEffect, useRef, useState } from "react";
import {
    ArrowRight,
    Loader2,
    CheckCircle2,
    RotateCcw,
    LogOut,
    AlertTriangle,
    Clock,
    ShieldX,
    Camera,
    CameraOff,
    SkipForward,
} from "lucide-react";
import { api, ApiError } from "../api";
import { CodeBlock } from "../components/CodeBlock";
import type { StartPayload, Msg } from "../App";
import type { LevelId } from "../types";

interface Props {
    payload: StartPayload;
    seedMessages: Msg[];
    onFinished: (interviewId: string, level: LevelId) => void;
    onAbort: () => void;
}

const TOTAL_STAGES = 4;
const TOTAL_QUESTIONS = 12;

export default function Interview({
    payload,
    seedMessages,
    onFinished,
    onAbort,
}: Props) {
    const [msgs, setMsgs] = useState<Msg[]>(seedMessages);
    const [currentStage, setCurrentStage] = useState<number>(payload.stage);
    const [currentStageName, setCurrentStageName] = useState<string>(
        payload.stageName,
    );

    const [answeredCount, setAnsweredCount] = useState(0);

    const [answer, setAnswer] = useState("");
    const [busy, setBusy] = useState(false);
    const [finished, setFinished] = useState(false);
    const [failed, setFailed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showSkipModal, setShowSkipModal] = useState(false);
    const [hoverSkip, setHoverSkip] = useState(false);

    const [totalSeconds, setTotalSeconds] = useState(0);
    const interviewStartTime = useRef<number>(Date.now());
    const [answerSeconds, setAnswerSeconds] = useState(0);
    const questionStartTime = useRef<number>(Date.now());

    const scroller = useRef<HTMLDivElement>(null);
    const isFailingRef = useRef(false);
    const isRejectedRef = useRef(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null,
    );
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const chunksRef = useRef<Blob[]>([]);
    // ---------- Камера ----------
    useEffect(() => {
        let active = true;
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (!active) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                setMediaStream(stream);

                const recorder = new MediaRecorder(stream, {
                    mimeType: "video/webm;codecs=vp8,opus",
                });
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };
                recorder.start(1000); // чанки каждую секунду — падение вкладки не убьёт всё видео
                setMediaRecorder(recorder);
                setIsCameraReady(true);
            } catch (err: any) {
                if (!active) return;
                console.error("Camera error:", err);
                setCameraError(
                    err.message || "Нет доступа к камере или микрофону.",
                );
            }
        };

        startCamera();

        return () => {
            active = false;
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    // Эффект для привязки видеопотока к тегу <video>
    useEffect(() => {
        if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
            // Принудительный запуск видео (иногда требуется в некоторых браузерах)
            videoRef.current.play().catch((err) => {
                console.warn("Autoplay prevented:", err);
            });
        }
    }, [mediaStream]);

    // ---------- Таймеры ----------
    useEffect(() => {
        if (finished || failed || !isCameraReady) return;
        const timer = window.setInterval(() => {
            setTotalSeconds(
                Math.floor((Date.now() - interviewStartTime.current) / 1000),
            );
        }, 1000);
        return () => window.clearInterval(timer);
    }, [finished, failed, isCameraReady]);

    useEffect(() => {
        if (finished || busy || failed || !isCameraReady || showSkipModal)
            return;
        questionStartTime.current = Date.now();
        setAnswerSeconds(0);
        const timer = window.setInterval(() => {
            setAnswerSeconds(
                Math.floor((Date.now() - questionStartTime.current) / 1000),
            );
        }, 1000);
        return () => window.clearInterval(timer);
    }, [msgs.length, finished, failed, isCameraReady, showSkipModal]);

    const scrollDown = () => {
        setTimeout(() => {
            if (scroller.current) {
                scroller.current.scrollTop = scroller.current.scrollHeight;
            }
        }, 100);
    };

    const send = async (isSkip = false) => {
        const text = isSkip ? "___SKIP___" : answer.trim();
        if ((!text && !isSkip) || busy || finished || failed) return;

        setBusy(true);
        setError(null);
        setShowSkipModal(false);

        if (!isSkip) {
            setMsgs((m) => [...m, { role: "user", text }]);
            setAnswer("");
            scrollDown();
        } else {
            setMsgs((m) => [...m, { role: "user", text: "[Вопрос пропущен]" }]);
        }

        const spent = Math.floor(
            (Date.now() - questionStartTime.current) / 1000,
        );
        const prevStage = currentStage;

        try {
            const res = await api.answer(
                payload.interviewId,
                text,
                isSkip ? 0 : spent,
            );
            setCurrentStage(res.stage);
            setCurrentStageName(res.stage_name);

            setAnsweredCount((c) => c + 1);

            if (res.rejected) {
                isRejectedRef.current = true;
                setFinished(true);
                setMsgs((m) => [
                    ...m,
                    {
                        role: "ai",
                        text: `❌ Интервью прервано: ${res.reject_reason}`,
                    },
                ]);
                if (mediaRecorder && mediaRecorder.state !== "inactive") {
                    mediaRecorder.stop();
                }
                setTimeout(
                    () => onFinished(payload.interviewId, payload.level),
                    2000,
                );
                return;
            }

            if (res.finished) {
                setFinished(true);
                setMsgs((m) => [
                    ...m,
                    {
                        role: "ai",
                        text: "Интервью завершено. Загружаем видео...",
                    },
                ]);

                // Остановка записи и триггер фоновой асинхронной отгрузки WebM-файла
                if (mediaRecorder && mediaRecorder.state !== "inactive") {
                    mediaRecorder.stop();
                    mediaRecorder.addEventListener("stop", () => {
                        if (
                            !isRejectedRef.current &&
                            chunksRef.current.length > 0
                        ) {
                            const blob = new Blob(chunksRef.current, {
                                type: "video/webm",
                            });
                            const formData = new FormData();
                            formData.append("file", blob, "interview.webm");
                            const apiBase =
                                import.meta.env.VITE_API_URL ||
                                "https://verumskills.ru";
                            const uploadUrl = `${apiBase}/api/media/upload?interview_id=${encodeURIComponent(payload.interviewId)}`;
                            const __token = localStorage.getItem("verum_token");

                            fetch(uploadUrl, {
                                method: "POST",
                                body: formData,
                                headers: __token
                                    ? { Authorization: `Bearer ${__token}` }
                                    : {},
                            }).catch((e) =>
                                console.error("[video] upload error", e),
                            );
                        }
                    });
                }

                onFinished(payload.interviewId, payload.level);
                return;
            }

            if (res.question) {
                let newMsg: Msg = {
                    role: "ai",
                    text: res.question,
                    stageName: res.stage_name,
                };
                if (res.code_snippet) {
                    let cleanCode = res.code_snippet.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
                    newMsg.text = res.question + "\n\n__CODE__" + cleanCode;
                } else if (
                    typeof res.question === "string" &&
                    /\n\s*Код:\s*\n/.test(res.question)
                ) {
                    const p = res.question.split(/\n\s*Код:\s*\n/);

                    if (p.length >= 2 && p[1].trim())
                        newMsg.text = p[0] + "\n\n__CODE__" + p[1];
                } else if (
                    typeof res.question === "string" &&
                    /```/.test(res.question)
                ) {
                    const m = res.question.match(
                        /```[a-zA-Z0-9+#.-]*\n([\s\(\S\)]*?)```/,
                    );

                    if (m && m[1].trim()) {
                        const b = res.question.slice(0, m.index).trim();

                        newMsg.text =
                            (b ? b + "\n\n" : "") + "__CODE__" + m[1].trim();
                    }
                }

                if (res.stage !== prevStage) {
                    let stageTitle = "";
                    if (res.stage === 1) stageTitle = "Этап 2: Ревью ИИ-кода";
                    if (res.stage === 2) stageTitle = "Этап 3: Стресс-тест";
                    if (res.stage === 3) stageTitle = "Этап 4: Рефакторинг";

                    if (stageTitle) {
                        const stageNotice: Msg = {
                            role: "ai",
                            text: `Переход на ${stageTitle}`,
                        };
                        setMsgs((m) => [...m, stageNotice, newMsg]);
                    } else {
                        setMsgs((m) => [...m, newMsg]);
                    }
                } else {
                    setMsgs((m) => [...m, newMsg]);
                }
                scrollDown();
            }
        } catch (e) {
            if (!isSkip) {
                setMsgs((m) => m.slice(0, -1));
                setAnswer(text);
            }
            setError(e instanceof ApiError ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void send(false);
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v")
            e.preventDefault();
        if (e.shiftKey && e.key === "Insert") e.preventDefault();
    };

    const globalProgress = Math.min(
        100,
        Math.round((answeredCount / TOTAL_QUESTIONS) * 100),
    );
    const totalM = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const totalS = String(totalSeconds % 60).padStart(2, "0");

    if (!isCameraReady && !cameraError)
        return (
            <div className="text-center py-20">
                <Loader2
                    className="animate-spin mx-auto text-accent"
                    size={32}
                />
                <p className="mt-4 text-muted">Подключение камеры...</p>
            </div>
        );
    if (cameraError)
        return (
            <div className="text-center py-20 text-red-600">
                <CameraOff size={48} className="mx-auto mb-4" />
                <p>{cameraError}</p>
            </div>
        );
    if (failed)
        return (
            <div className="text-center py-20">
                <ShieldX size={48} className="text-red-600 mx-auto" />
                <h1 className="text-xl font-bold mt-4">Интервью прервано</h1>
                <p className="text-muted mt-2 text-[14px]">
                    Обнаружено нарушение правил прохождения интервью.
                </p>
            </div>
        );
    return (
        <div className="max-w-6xl w-full overflow-hidden mx-auto px-4 py-10 select-none relative">
            {showSkipModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-[22px] shadow-xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <AlertTriangle
                            className="text-amber-500 mx-auto mb-3"
                            size={32}
                        />
                        <h3 className="text-[18px] font-bold text-center mb-2">
                            Пропустить вопрос?
                        </h3>
                        <p className="text-[13px] text-muted text-center mb-6">
                            Это действие{" "}
                            <span className="text-red-600 font-medium">
                                сильно снизит
                            </span>{" "}
                            вашу итоговую оценку.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSkipModal(false)}
                                className="flex-1 rounded-[22px] border border-line py-2 text-[14px] font-medium hover:bg-gray-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={() => send(true)}
                                className="flex-1 rounded-[22px] bg-red-600 text-white py-2 text-[14px] font-medium hover:bg-red-700"
                            >
                                Да, пропустить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-[22px] shadow-card p-4 sticky top-10">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[14px] font-bold flex items-center gap-2">
                                <Camera size={16} /> Камера
                            </h2>
                        </div>
                        <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                style={{ transform: "rotateY(180deg)" }}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-[22px] shadow-card p-3 md:p-6 flex flex-col h-[65vh] md:h-[80vh]">
                        <div className="flex items-center justify-between gap-3 shrink-0">
                            <div>
                                <h1 className="text-[20px] font-bold">
                                    Интервью
                                </h1>
                                <p className="text-muted text-[12px]">
                                    {payload.level} · {payload.stackId} ·{" "}
                                    {payload.languageId}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="inline-flex items-center gap-1.5 text-[14px] font-medium bg-page px-2.5 py-1 rounded-lg">
                                    <Clock size={16} className="text-accent" />{" "}
                                    {totalM}:{totalS}
                                </div>
                                <button
                                    onClick={onAbort}
                                    className="text-[13px] text-muted hover:text-red-600 flex items-center gap-1"
                                >
                                    <LogOut size={14} /> Выйти
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 shrink-0">
                            <div className="flex items-center justify-between text-[12px] text-muted mb-1">
                                <span>
                                    Этап {currentStage + 1} из {TOTAL_STAGES} —{" "}
                                    {currentStageName}
                                </span>
                                <span>{globalProgress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-page overflow-hidden">
                                <div
                                    className="h-full bg-accent transition-all"
                                    style={{ width: `${globalProgress}%` }}
                                />
                            </div>
                        </div>

                        <div
                            ref={scroller}
                            className="mt-4 flex-1 overflow-y-auto space-y-3 pr-2"
                        >
                            {msgs.map((m, i) => {
                                const hasCode = m.text.includes("__CODE__");
                                const [textPart, codePart] = hasCode
                                    ? m.text.split("__CODE__")
                                    : [m.text, ""];

                                return (
                                    <div
                                        key={i}
                                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2 text-[14px] leading-snug ${m.role === "user" ? "bg-accent text-white" : "bg-page text-ink"}`}
                                        >
                                            {m.stageName && (
                                                <div className="text-[10px] uppercase tracking-wide mb-1 opacity-70">
                                                    {m.stageName}
                                                </div>
                                            )}
                                            {hasCode ? (
                                                <>
                                                    <div className="whitespace-pre-wrap mb-3">
                                                        {textPart}
                                                    </div>
                                                    <CodeBlock code={codePart} />
                                                </>
                                            ) : (
                                                <div className="whitespace-pre-wrap">
                                                    {m.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {busy && (
                                <div className="flex items-center gap-2 text-muted text-[13px]">
                                    <Loader2
                                        className="animate-spin"
                                        size={16}
                                    />{" "}
                                    ИИ оценивает ответ…
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="mt-3 shrink-0 bg-red-50 text-red-700 text-[13px] px-3 py-2 rounded-lg flex items-center gap-2">
                                <AlertTriangle size={16} /> {error}
                            </div>
                        )}

                        {!finished ? (
                            <div className="mt-4 shrink-0 flex flex-col gap-2">
                                <div className="flex gap-3 items-stretch">
                                    <textarea
                                        value={answer}
                                        onChange={(e) =>
                                            setAnswer(e.target.value)
                                        }
                                        onKeyDown={onKeyDown}
                                        onPaste={(e) => e.preventDefault()}
                                        placeholder="Ваш ответ… (Enter — отправить, Shift+Enter — перенос)"
                                        rows={currentStage === 0 || currentStage === 3 ? 6 : 2}
                                        className="flex-1 bg-page text-ink rounded-[22px] border border-line px-3 py-2 text-sm md:text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 text-[14px] resize-none placeholder:text-muted/50"
                                    />
                                    <button
                                        onClick={() => send(false)}
                                        disabled={busy || !answer.trim()}
                                        className="rounded-[22px] bg-accent text-white px-3 md:px-4 h-full font-medium disabled:opacity-40 flex items-center justify-center min-w-[50px] md:min-w-[60px]"
                                    >
                                        {busy ? (
                                            <RotateCcw
                                                size={16}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <ArrowRight size={16} />
                                        )}
                                    </button>
                                </div>

                                <div className="relative flex justify-end">
                                    {hoverSkip && (
                                        <div className="absolute bottom-full mb-2 right-0 w-64 bg-gray-900 text-white text-[11px] px-3 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
                                            Пропуск вопроса зафиксируется ИИ как
                                            отсутствие ответа и сильно снизит
                                            итоговый балл.
                                            <div className="absolute top-full right-6 border-4 border-transparent border-t-gray-900" />
                                        </div>
                                    )}
                                    <button
                                        onMouseEnter={() => setHoverSkip(true)}
                                        onMouseLeave={() => setHoverSkip(false)}
                                        onClick={() => setShowSkipModal(true)}
                                        disabled={busy}
                                        className="text-[12px] text-muted hover:text-amber-600 transition-colors flex items-center gap-1"
                                    >
                                        <SkipForward size={12} /> Пропустить
                                        вопрос
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 shrink-0 text-accent font-medium flex items-center gap-2">
                                <CheckCircle2 size={18} /> Интервью завершено
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
