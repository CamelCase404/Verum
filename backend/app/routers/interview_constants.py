from __future__ import annotations

# Общие константы собеседования (новая модель v2).
# Вынесены отдельно, чтобы избежать circular import между
# interview_flow.py и interview_agents.py.

STAGE_NAMES = {
    0: "AI-Driven Prompting",
    1: "ИИ-Западня",
    2: "Стресс-тест",
    3: "Рефакторинг",
}

STAGE0_QUESTIONS = 6
STAGE1_QUESTIONS = 2
STAGE2_QUESTIONS = 2
STAGE3_QUESTIONS = 2
TOTAL_QUESTIONS = STAGE0_QUESTIONS + STAGE1_QUESTIONS + STAGE2_QUESTIONS + STAGE3_QUESTIONS  # 12
