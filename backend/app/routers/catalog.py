from fastapi import APIRouter

from ..schemas import CatalogOption, CatalogResponse, LanguageOption, StackOption

router = APIRouter(prefix="/api", tags=["catalog"])


def _opt(id: str, name: str, icon: str, description: str) -> CatalogOption:
    return CatalogOption(id=id, name=name, icon=icon, description=description)


def _lang(id: str, name: str, icon: str, description: str) -> LanguageOption:
    return LanguageOption(id=id, name=name, icon=icon, description=description)


LEVELS = [
    _opt(
        "junior",
        "Разработчик Junior",
        "Seedling",
        "Анализ портфолио: базовые знания, обучаемость, аккуратность в коде.",
    ),
    _opt(
        "middle",
        "Разработчик Middle",
        "Sprout",
        "Портфолио + собеседование: самостоятельные решения, архитектура, trade-offs.",
    ),
    _opt(
        "senior",
        "Разработчик Senior",
        "TreeDeciduous",
        "Портфолио + собеседование + проект: системное мышление, влияние на команду.",
    ),
]

STACKS = [
    StackOption(
        id="mobile-ios",
        name="Mobile (iOS)",
        icon="Smartphone",
        description="Нативная разработка под iOS",
        languages=[
            _lang("swift", "Swift", "Swift", "Основной язык iOS"),
            _lang("objc", "Objective-C", "Braces", "Legacy-код iOS"),
            _lang("swiftui", "SwiftUI", "Layers", "Декларативный UI"),
            _lang("uikit", "UIKit", "LayoutGrid", "Классический UI"),
            _lang("combine", "Combine", "Waves", "Реактивные потоки"),
        ],
    ),
    StackOption(
        id="mobile-android",
        name="Mobile (Android)",
        icon="Smartphone",
        description="Нативная разработка под Android",
        languages=[
            _lang("kotlin", "Kotlin", "Code2", "Основной язык Android"),
            _lang("java", "Java", "Coffee", "Классический Android"),
            _lang("compose", "Jetpack Compose", "Layers", "Декларативный UI"),
            _lang("coroutines", "Kotlin Coroutines", "Waves", "Асинхронность"),
        ],
    ),
    StackOption(
        id="frontend",
        name="Frontend",
        icon="Monitor",
        description="Клиентская веб-разработка",
        languages=[
            _lang("html", "HTML5", "FileCode2", "Разметка"),
            _lang("css", "CSS3", "Layers", "Стили"),
            _lang("js", "JavaScript", "Braces", "Базовый язык веба"),
            _lang("ts", "TypeScript", "FileCode2", "Типизированный JS"),
            _lang("react", "React", "Atom", "Библиотека UI"),
            _lang("vue", "Vue", "Hexagon", "Прогрессивный фреймворк"),
            _lang("svelte", "Svelte", "Flame", "Компилируемый UI"),
        ],
    ),
    StackOption(
        id="backend",
        name="Backend",
        icon="Server",
        description="Серверная разработка",
        languages=[
            _lang("next", "Next.js", "Layers", "SSR/SSG React"),
            _lang("python", "Python", "FileCode2", "Универсальный язык"),
            _lang("fastapi", "FastAPI", "Zap", "Асинхронный Python-фреймворк"),
            _lang("django", "Django", "Boxes", "Batteries-included"),
            _lang("go", "Go", "Rabbit", "Компилируемый, быстрый"),
            _lang("node", "Node.js", "Hexagon", "JS на сервере"),
            _lang("java", "Java", "Coffee", "JVM-стек"),
            _lang("csharp", "C#", "Hash", ".NET-стек"),
        ],
    ),
    StackOption(
        id="gamedev",
        name="GameDev",
        icon="Gamepad2",
        description="Разработка игр",
        languages=[
            _lang("unity", "Unity (C#)", "Gamepad2", "Кроссплатформенный движок"),
            _lang("unreal", "Unreal (C++)", "Boxes", "AAA-движок"),
            _lang("godot", "Godot (GDScript)", "Hexagon", "Открытый движок"),
        ],
    ),
    StackOption(
        id="devops",
        name="DevOps / SRE",
        icon="Cloud",
        description="Инфраструктура и эксплуатация",
        languages=[
            _lang("docker", "Docker", "Box", "Контейнеризация"),
            _lang("k8s", "Kubernetes", "Ship", "Оркестрация"),
            _lang("terraform", "Terraform", "Layers", "IaC"),
            _lang("ansible", "Ansible", "Wrench", "Автоматизация"),
            _lang("bash", "Bash", "Terminal", "Скрипты"),
        ],
    ),
    StackOption(
        id="data",
        name="Data / ML",
        icon="Brain",
        description="Анализ данных и машинное обучение",
        languages=[
            _lang("python", "Python", "FileCode2", "Основной язык"),
            _lang("pandas", "Pandas", "Table", "Табличные данные"),
            _lang("pytorch", "PyTorch", "Flame", "DL-фреймворк"),
            _lang("tensorflow", "TensorFlow", "Brain", "DL-фреймворк"),
            _lang("sql", "SQL", "Database", "Работа с данными"),
        ],
    ),
]


@router.get("/catalog", response_model=CatalogResponse)
def catalog() -> CatalogResponse:
    return CatalogResponse(levels=LEVELS, stacks=STACKS)
