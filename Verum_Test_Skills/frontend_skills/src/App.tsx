import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing";
import Consent from "./pages/Consent";
import Interview from "./pages/Interview";
import Processing from "./pages/Processing";
import Report from "./pages/Report";
import { useSession } from "./hooks/useSession";
import type { LevelId, ReportResponse } from "./types";

export interface StartPayload {
    interviewId: string;
    level: LevelId;
    stackId: string;
    languageId: string;
    firstQuestion: string;
    stage: number;
    stageName: string;
}

export interface Msg {
    role: "ai" | "user";
    text: string;
    stageName?: string;
}

type View =
    | { kind: "landing" }
    | { kind: "consent"; payload: StartPayload }
    | { kind: "interview"; payload: StartPayload; seedMessages: Msg[] }
    | { kind: "processing"; interviewId: string; level: LevelId }
    | { kind: "report"; report: ReportResponse };

// Общие настройки анимации для страниц
const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.3, ease: "easeOut" as const },
};

export default function App() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);
    const { session, save, clear } = useSession();
    const [view, setView] = useState<View>({ kind: "landing" });

    const handleStarted = (payload: StartPayload) => {
        save({
            interviewId: payload.interviewId,
            level: payload.level,
            stackId: payload.stackId,
            languageId: payload.languageId,
            startedAt: Date.now(),
        });
        setView({ kind: "consent", payload });
    };

    const handleConsented = () => {
        if (view.kind !== "consent") return;
        const seed: Msg[] = [
            {
                role: "ai",
                text: view.payload.firstQuestion,
                stageName: view.payload.stageName,
            },
        ];
        setView({
            kind: "interview",
            payload: view.payload,
            seedMessages: seed,
        });
    };

    const handleFinished = (interviewId: string, level: LevelId) =>
        setView({ kind: "processing", interviewId, level });

    const handleReportReady = (report: ReportResponse) => {
        clear();
        setView({ kind: "report", report });
    };

    const handleRestart = () => {
        clear();
        setView({ kind: "landing" });
    };

    return (
        <main className="min-h-screen bg-page flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
                {view.kind === "landing" && (
                    <motion.div
                        key="landing"
                        {...pageVariants}
                        className="flex-1 flex flex-col"
                    >
                        <Landing
                            activeSession={session}
                            onStarted={handleStarted}
                            onAbandon={clear}
                        />
                    </motion.div>
                )}

                {view.kind === "consent" && (
                    <motion.div
                        key="consent"
                        {...pageVariants}
                        className="flex-1 flex flex-col"
                    >
                        <Consent
                            payload={view.payload}
                            onConfirm={handleConsented}
                            onCancel={handleRestart}
                        />
                    </motion.div>
                )}

                {view.kind === "interview" && (
                    <motion.div
                        key="interview"
                        {...pageVariants}
                        className="flex-1 flex flex-col"
                    >
                        <Interview
                            payload={view.payload}
                            seedMessages={view.seedMessages}
                            onFinished={handleFinished}
                            onAbort={handleRestart}
                        />
                    </motion.div>
                )}

                {view.kind === "processing" && (
                    <motion.div
                        key="processing"
                        {...pageVariants}
                        className="flex-1 flex flex-col"
                    >
                        <Processing
                            interviewId={view.interviewId}
                            level={view.level}
                            onReady={handleReportReady}
                            onAbort={handleRestart}
                        />
                    </motion.div>
                )}

                {view.kind === "report" && (
                    <motion.div
                        key="report"
                        {...pageVariants}
                        className="flex-1 flex flex-col"
                    >
                        <Report
                            report={view.report}
                            onRestart={handleRestart}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
