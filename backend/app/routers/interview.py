from __future__ import annotations

import json
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auth import UserDB, get_current_user, utcnow_naive
from ..gigachat_client import ask_chat, ask_text
from ..interview_store import create, get, save
from ..prompts import STAGE_DESCRIPTIONS, SYSTEM_INTERVIEWER, SYSTEM_REPORT
from ..schemas import (
    AnswerRequest,
    AnswerResponse,
    ReportResponse,
    StageScore,
    StartInterviewRequest,
    StartInterviewResponse,
    Turn,
)

router = APIRouter(prefix="/api/interview", tags=["interview"])

STAGE_NAMES = {0: "Общие знания", 1: "Code Review", 2: "Нагрузка", 3: "Code Review (Повторный)", 4: "Нагрузка (Повторный)"}
STAGE0_QUESTIONS = 8

def _clean_text(raw: str) -> str:
    raw = raw.strip().replace("{{", "{").replace("}}", "}")
    if raw.startswith("```json"): raw = raw[7:]
    elif raw.startswith("```"): raw = raw[3:]
    if raw.endswith("```"): raw = raw[:-3]
    if raw.startswith("{"):
        try:
            data = json.loads(raw)
            raw = str(data.get("next_question", data.get("question", raw)))
        except: pass
    clean = re.sub(r'[{}"]', "", raw).strip()
    return re.sub(r"^(score|feedback|next_question)\s*:\s*", "", clean, flags=re.IGNORECASE).strip()

def _get_history(it) -> list[dict]:
    return [{"role": t.role, "content": t.content} for t in it.turns]

async def _generate_pure_question(stage: int, it, past_questions: list[str], prev_code_context: str = "", prev_answer: str = "") -> str:
    prev_q_str = "\n".join(f"- {q[:50]}..." for q in past_questions[-5:]) if past_questions else "Нет"

    # Передаем stack везде
    stage_desc = STAGE_DESCRIPTIONS[stage].format(langs=it.language_id, level=it.level, stack=it.stack_id, prev_code="(см. ниже)")
    sys_prompt = SYSTEM_INTERVIEWER.format(level=it.level, langs=it.language_id, stack=it.stack_id)

    prompt = f"Стадия: {stage}. {stage_desc}\nУже заданные вопросы:\n{prev_q_str}\n\n"
    if stage in (2, 4) and prev_code_context:
        prompt += f"Код с предыдущего этапа:\n{prev_code_context[:8000]}\n\nКандидат написал промпт:\n'{prev_answer}'\n\nПридумай проблему из реального продакшена и спроси, как исправить именно этот код. Верни ТОЛЬКО текст вопроса."
    else:
        prompt += "Задай СЛЕДУЮЩИЙ новый вопрос. Верни ТОЛЬКО текст вопроса."

    history = _get_history(it)
    raw = (await ask_chat(sys_prompt, history, prompt)).strip()
    return _clean_text(raw)

async def _evaluate_answer(stage: int, it, question: str, answer: str, is_skip: bool) -> int:
    if is_skip: return 0
    sys_prompt = SYSTEM_INTERVIEWER.format(level=it.level, langs=it.language_id, stack=it.stack_id)

    prompt = f"Стадия: {stage}. Уровень: {it.level}.\nВопрос: {question}\nОтвет кандидата: {answer}\n\nОцени от 0-100. Если ответ не по теме (бред, спам), ставь 0-10. Если поверхностный - 10-30. Верни ТОЛЬКО число. Не додумывай за кандидата!"
    history = _get_history(it)
    raw = (await ask_chat(sys_prompt, history, prompt, temperature=0.0)).strip()

    # Приоритетные паттерны — берём ПОСЛЕДНЕЕ найденное число
    patterns = [
        r"(?:оценка|балл|score)\s*[:\-]?\s*(\d{1,3})",
        r"(\d{1,3})\s*(?:/\s*100|из\s*100|баллов?)",
        r"\b(\d{1,3})\b",
    ]
    for pat in patterns:
        matches = re.findall(pat, raw, re.IGNORECASE)
        if matches:
            score = int(matches[-1])
            return max(0, min(100, score))
    return 40

async def _generate_code_review_task(it) -> tuple[str, str]:
    sys_prompt = SYSTEM_INTERVIEWER.format(level=it.level, langs=it.language_id, stack=it.stack_id)
    
    if it.level.lower() == "junior":
        difficulty = (
            "Добавь ОДНУ-ДВЕ реалистичные ошибки уровня Junior. "
            "Подумай, какие типичные ошибки новичков бывают именно в стеке {stack} на языке {langs}. "
            "Выбирай РАЗНООБРАЗНО: логика, обработка данных, работа с API, память, безопасность или другое."
        )
    elif it.level.lower() == "middle":
        difficulty = (
            "Добавь ОДНУ-ДВЕ ошибки уровня Middle. "
            "Подумай, какие проблемы бывают у разработчиков среднего уровня в стеке {stack} на языке {langs}. "
            "Выбирай РАЗНООБРАЗНО: производительность, архитектура, обработка ошибок, безопасность, кэширование, работа с БД или другое."
        )
    else:
        difficulty = (
            "Добавь ОДНУ-ДВЕ СЛОЖНЫЕ ошибки уровня Senior. "
            "Подумай, какие проблемы характерны для senior-разработчиков в стеке {stack} на языке {langs}. "
            "Выбирай РАЗНООБРАЗНО: архитектурные ошибки, утечки, гонки, масштабирование, безопасность или другое. "
            "Не повторяй одни и те же паттерны."
        )
    
    diff_text = difficulty.format(stack=it.stack_id, langs=it.language_id)

    prompt = (
        f"Сгенерируй РОВНО ОДИН блок кода СТРОГО на одном из этих языков: {it.language_id}.\n"
        f"ОБЯЗАТЕЛЬНО используй самые современные и актуальные библиотеки/фреймворки для этого стека.\n"
        f"{diff_text}\n"
        f"КРИТИЧЕСКОЕ ПРАВИЛО 1: В коде НЕ ДОЛЖНО БЫТЬ НИ ОДНОГО КОММЕНТАРИЯ (убери //, #, /* */ и т.д.).\n"
        f"КРИТИЧЕСКОЕ ПРАВИЛО 2: НИКАКИХ подсказок, списков ошибок или пояснений в тексте или коде.\n"
        f"КРИТИЧЕСКОЕ ПРАВИЛО 3: Выдай ТОЛЬКО ОДИН кусок кода. Никаких двух файлов.\n"
        f"ФОРМАТ ОТВЕТА ДОЛЖЕН БЫТЬ СТРОГО ТАКИМ:\n"
        f"Найдите неоптимизированные участки и баги в коде и напишите промпт для их исправления\n"
        f"|РАЗДЕЛИТЕЛЬ|\n"
        f"```{it.language_id}\n"
        f"твой код без комментариев\n"
        f"```"
    )
    
    history = _get_history(it)
    raw = (await ask_chat(sys_prompt, history, prompt)).strip()

    # Убираем markdown-теги
    for tag in ["```typescript", "```javascript", "```python", "```java", "```go", "```html", "```css", "```ts", "```js", "```"]:
        raw = raw.replace(tag, "")

    if "|" in raw:
        parts = raw.split("|", 1)
        task_text = parts[0].replace("РАЗДЕЛИТЕЛЬ", "").strip()
        code = parts[1].strip()
    else:
        task_text = "Найдите неоптимизированные участки и баги в коде и напишите промпт для их исправления."
        code = raw

    # БРОНЕБОЙНАЯ ОЧИСТКА КОДА ОТ КОММЕНТАРИЕВ
    code = re.sub(r"(?<!http:)(?<!https:)\/\/.*", "", code) # Удаляет // но оставляет http://
    code = re.sub(r"(?m)^\s*#.*$", "", code) # Удаляет строки, начинающиеся с #
    code = re.sub(r"(?<=\s)#(?!\w{3,6}\b).*", "", code) # Удаляет инлайн # (но не CSS-цвета типа #fff)
    code = re.sub(r"/\*.*?\*/", "", code, flags=re.DOTALL)
    code = re.sub(r"<!--.*?-->", "", code, flags=re.DOTALL)
    
    # Убираем фразы-подсказки (если ИИ их вставил как текст)
    for hint in ["Ошибка:", "Баг:", "Проблема:", "Потенциальная ошибка:", "Уязвимость:", "Плохо:", "Реалистичная ошибка", "Пример ошибки"]:
        code = re.sub(rf"(?i){hint}[^\n]*", "", code)
    
    code = re.sub(r"\n\s*\n", "\n", code)
    
    return task_text, code.strip()


async def start(req: StartInterviewRequest, user: UserDB = Depends(get_current_user)) -> StartInterviewResponse:
    if user.role != "developer":
        raise HTTPException(403, "Собеседование доступно только для разработчиков")
    from datetime import datetime
    now = utcnow_naive()
    if user.blocked_until:
        blocked = user.blocked_until
        # Если дата с часовым поясом, убираем его для сравнения
        if blocked.tzinfo is not None:
            blocked = blocked.replace(tzinfo=None)
        if blocked > now:
            raise HTTPException(
                403,
                f"Доступ к собеседованию заблокирован до {blocked.strftime('%d.%m.%Y')}. "
                f"Вы исчерпали все попытки."
            )
    # Сбрасываем "хвосты" от прошлой попытки, чтобы админ не увидел старое видео с новым чатом
    user.interview_video_url = None
    user.pending_skills_data = None
    from ..auth import SessionLocal
    async with SessionLocal() as db:
        await db.merge(user)
        await db.commit()

    langs_str = ", ".join(req.language_ids)
    it = await create(req.level, req.stack_id, langs_str, user_id=user.id)
    try:
        q = await _generate_pure_question(0, it, [])
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Ошибка генерации вопроса: {str(e)}")

    it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
    await save(it)
    return StartInterviewResponse(interview_id=it.id, stage=0, stage_name=STAGE_NAMES[0], question=q)

@router.post("/answer", response_model=AnswerResponse)
async def answer(req: AnswerRequest, user: UserDB = Depends(get_current_user)) -> AnswerResponse:
    it = await get(req.interview_id)
    if not it:
        raise HTTPException(404, "interview not found")
    if it.user_id is not None and it.user_id != user.id:
        raise HTTPException(403, "Это интервью принадлежит другому пользователю")

    if req.answer == "___TAB_SWITCH_FAIL___":
        it.finished, it.rejected, it.reject_reason = True, True, "Выход из окна."
        await save(it)
        return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES.get(it.stage, ""), finished=True, rejected=True, reject_reason=it.reject_reason)

    is_skip = req.answer == "___SKIP___"
    if is_skip:
        req.answer = "Кандидат пропустил вопрос."

    past_questions = [t.content for t in it.turns if t.role == "assistant"]
    last_question = past_questions[-1] if past_questions else ""

    score = await _evaluate_answer(it.stage, it, last_question, req.answer, is_skip)

    it.turns.append(Turn(role="user", content=req.answer, seconds_spent=req.seconds_spent, score=score))

    if not is_skip and score <= 5:
        it.finished, it.rejected, it.reject_reason = True, True, "Ответ не по теме (бред или спам)."
        await save(it)
        return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES.get(it.stage, ""), finished=True, rejected=True, reject_reason=it.reject_reason)

    answers_on_stage = sum(1 for t in it.turns if t.role == "user")

    if it.stage == 0 and answers_on_stage >= STAGE0_QUESTIONS:
        it.stage = 1
        question, code = await _generate_code_review_task(it)
        it.turns.append(Turn(role="assistant", content=question + "\n\nКод:\n" + code, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=1, stage_name=STAGE_NAMES[1], question=question, code_snippet=code)

    elif it.stage == 1 and answers_on_stage >= STAGE0_QUESTIONS + 1:
        it.stage = 2
        prev_prompt = next((t.content for t in reversed(it.turns) if t.role == "user" and len(t.content) > 10 and t.content != "Кандидат пропустил вопрос."), "") or "(кандидат пропустил Code Review)"
        prev_code = next((t.content for t in reversed(it.turns) if t.role == "assistant" and "Код:" in t.content), "")
        q = await _generate_pure_question(2, it, past_questions, prev_code, prev_prompt)
        it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=2, stage_name=STAGE_NAMES[2], question=q)

    elif it.stage == 2 and answers_on_stage >= STAGE0_QUESTIONS + 2:
        it.stage = 3
        question, code = await _generate_code_review_task(it)
        it.turns.append(Turn(role="assistant", content=question + "\n\nКод:\n" + code, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=3, stage_name=STAGE_NAMES[3], question=question, code_snippet=code)

    elif it.stage == 3 and answers_on_stage >= STAGE0_QUESTIONS + 3:
        it.stage = 4
        prev_prompt = next((t.content for t in reversed(it.turns) if t.role == "user" and len(t.content) > 10 and t.content != "Кандидат пропустил вопрос."), "") or "(кандидат пропустил Code Review)"
        prev_code = next((t.content for t in reversed(it.turns) if t.role == "assistant" and "Код:" in t.content), "")
        q = await _generate_pure_question(4, it, past_questions, prev_code, prev_prompt)
        it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
        await save(it)
        return AnswerResponse(stage=4, stage_name=STAGE_NAMES[4], question=q)

    elif it.stage == 4 and answers_on_stage >= STAGE0_QUESTIONS + 4:
        it.finished = True
        await save(it)
        return AnswerResponse(stage=4, stage_name=STAGE_NAMES[4], finished=True)

    q = await _generate_pure_question(it.stage, it, past_questions)
    if not q or len(q.strip()) < 10: q = "Опишите ваш подход к решению подобных задач."

    it.turns.append(Turn(role="assistant", content=q, seconds_spent=0))
    await save(it)
    return AnswerResponse(stage=it.stage, stage_name=STAGE_NAMES[it.stage], question=q)

class _Report(BaseModel):
    summary: str
    stages: list[StageScore]
    strengths: list[str]
    gaps: list[str]
    recommendation: str
    competency_architecture: int | None = None
    competency_code_understanding: int | None = None
    competency_prompting: int | None = None
    competency_adaptability: int | None = None
    competency_soft_skills: int | None = None
    total_score_100: int | None = None
    final_grade: str | None = None

def _parse_report_json(content: str) -> dict:
    content = content.strip()
    if content.startswith("```json"): content = content[7:]
    elif content.startswith("```"): content = content[3:]
    if content.endswith("```"): content = content[:-3]
    s, e = content.find("{"), content.rfind("}")
    if s != -1 and e != -1 and e > s: content = content[s:e+1]
    try: return json.loads(content)
    except: pass
    return {}

@router.get("/{interview_id}/report", response_model=ReportResponse)
async def report(interview_id: str, user: UserDB = Depends(get_current_user)) -> ReportResponse:
    it = await get(interview_id)
    if not it:
        raise HTTPException(404, "interview not found")
    if it.user_id is not None and it.user_id != user.id:
        raise HTTPException(403, "Это интервью принадлежит другому пользователю")
    if not it.finished:
        raise HTTPException(409, "interview is not finished")

    if it.rejected:
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary="Интервью было прервано.", stages=[], strengths=[], gaps=[it.reject_reason or "Нарушение"],
            recommendation="no_hire", competency_architecture=0, competency_code_understanding=0, competency_prompting=0,
            competency_adaptability=0, competency_soft_skills=0, total_score_100=0, final_grade="Reject",
            rejected=True, reject_reason=it.reject_reason
        )

    # ─── ПРОГРАММНЫЙ ПОДСЧЁТ НА ОСНОВЕ РЕАЛЬНЫХ ОТВЕТОВ ───
    user_turns = [t for t in it.turns if t.role == "user"]
    total_answers = len(user_turns)
    skips = sum(1 for t in user_turns if t.content == "Кандидат пропустил вопрос.")
    
    # Собираем score по каждому ответу (не считая пропуски)
    # Но пропуск тоже даёт score=0 — считаем его в average, чтобы он тянул вниз
    all_scores = [getattr(t, "score", None) for t in user_turns]
    valid_scores = [sc for sc in all_scores if sc is not None]

    # Считаем средний балл за ВСЕ ответы (включая пропуски как 0)
    if valid_scores:
        # заменяем None на 0 (для старых turn'ов без score)
        scores_normalized = [sc if sc is not None else 0 for sc in all_scores]
        avg_score = sum(scores_normalized) / len(scores_normalized)
    else:
        avg_score = 0

    # ─── ПРОГРАММНЫЕ КОМПЕТЕНЦИИ ПО СТАДИЯМ ───
    # Собираем score по каждой стадии (для стадий 1,2,3,4 по одному ответу)
    def stage_avg(stages: list[int]) -> int:
        stage_scores = [
            (getattr(t, "score", None) or 0)
            for i, t in enumerate(it.turns)
            if t.role == "user" and _turn_stage(it.turns, i) in stages
        ]
        if not stage_scores:
            return 0
        return int(sum(stage_scores) / len(stage_scores))

    # ─── ПРОГРАММНЫЙ REJECT ───
    # Если пропущено >= 50% вопросов ИЛИ все — принудительный Reject
    forced_reject = False
    reject_reason = None
    if total_answers > 0:
        skip_ratio = skips / total_answers
        if skips == total_answers:
            forced_reject = True
            reject_reason = "Все вопросы пропущены."
        elif skip_ratio >= 0.5:
            forced_reject = True
            reject_reason = f"Пропущено {skips} из {total_answers} вопросов ({int(skip_ratio*100)}%)."

    if forced_reject:
        return ReportResponse(
            interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
            summary=reject_reason or "Кандидат пропустил большинство вопросов.",
            stages=[],
            strengths=[],
            gaps=["Кандидат не отвечал на большинство вопросов."],
            recommendation="no_hire",
            competency_architecture=0, competency_code_understanding=0, competency_prompting=0,
            competency_adaptability=0, competency_soft_skills=0,
            total_score_100=0, final_grade="Reject",
            rejected=True, reject_reason=reject_reason
        )

    # ─── ГЕНЕРАЦИЯ ТЕКСТОВОГО ОТЧЁТА ЧЕРЕЗ GIGACHAT (только summary/stages/strengths/gaps) ───
    history = _get_history(it)
    ai_user = f"Уровень: {it.level}. Стек: {it.stack_id}. Языки: {it.language_id}.\nСформируй отчёт строго по схеме JSON."

    try:
        raw = await ask_chat(SYSTEM_REPORT, history, ai_user)
        parsed = _Report.model_validate(_parse_report_json(raw))
    except Exception as e:
        # если GigaChat упал — отдаём программный отчёт
        parsed = _Report(
            summary="Отчёт сформирован на основе ответов кандидата.",
            stages=[], strengths=[], gaps=[],
            recommendation="insufficient_evidence",
        )

    # ─── ИТОГОВЫЙ БАЛЛ — ИЗ РЕАЛЬНЫХ ОТВЕТОВ ───
    total = int(round(avg_score))

    # ─── ГРЕЙД — ИЗ ПРОГРАММНОГО БАЛЛА + ОГРАНИЧЕНИЕ ПО ВЫБРАННОМУ УРОВНЮ ───
    initial_level = it.level.lower()
    if total < 15:
        grade = "Reject"
    elif total <= 50:
        grade = "Junior"
    elif total <= 75:
        grade = "Middle"
    else:
        grade = "Senior"

    if initial_level == "junior" and grade in ("Middle", "Senior"):
        grade = "Junior"
    elif initial_level == "middle" and grade == "Senior":
        grade = "Middle"

    # ─── КОМПЕТЕНЦИИ — ПРОГРАММНЫЕ (по стадиям) ───
    comp_arch = stage_avg([0])
    comp_code = stage_avg([1, 3])
    comp_adapt = stage_avg([2, 4])
    # prompting/soft — оставляем от GigaChat (их из score не вывести)
    # Валидация: если GigaChat вернул вне 0-100 или None → fallback на total
    def _valid_or(x, fallback):
        if x is None: return fallback
        try:
            xi = int(x)
            return xi if 0 <= xi <= 100 else fallback
        except (TypeError, ValueError):
            return fallback

    comp_prompt = _valid_or(parsed.competency_prompting, total)
    comp_soft = _valid_or(parsed.competency_soft_skills, total)

    return ReportResponse(
        interview_id=it.id, level=it.level, stack_id=it.stack_id, language_id=it.language_id,
        summary=parsed.summary, stages=parsed.stages, strengths=parsed.strengths, gaps=parsed.gaps,
        recommendation=parsed.recommendation if parsed.recommendation in ("hire", "no_hire", "insufficient_evidence") else "insufficient_evidence",
        competency_architecture=comp_arch,
        competency_code_understanding=comp_code,
        competency_prompting=comp_prompt,
        competency_adaptability=comp_adapt,
        competency_soft_skills=comp_soft,
        total_score_100=total,
        final_grade=grade,
        rejected=False, reject_reason=None
    )


def _turn_stage(turns: list, user_turn_index: int) -> int:
    """Определяет стадию turn'а по позиции: считаем assistant-вопросы ДО него."""
    stage = 0
    assistant_count = 0
    for i, t in enumerate(turns):
        if i == user_turn_index:
            return stage
        if t.role == "assistant":
            assistant_count += 1
            if assistant_count > STAGE0_QUESTIONS:
                stage = 1
            if assistant_count > STAGE0_QUESTIONS + 1:
                stage = 2
            if assistant_count > STAGE0_QUESTIONS + 2:
                stage = 3
            if assistant_count > STAGE0_QUESTIONS + 3:
                stage = 4
    return stage

