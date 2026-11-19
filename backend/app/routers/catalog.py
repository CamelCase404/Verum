from fastapi import APIRouter

from ..schemas import CatalogOption, CatalogResponse, LanguageOption, StackOption

router = APIRouter(prefix="/api", tags=["catalog"])


def _opt(id: str, name: str, icon: str, description: str) -> CatalogOption:
    return CatalogOption(id=id, name=name, icon=icon, description=description)


def _lang(
    id: str,
    name: str,
    icon: str,
    description: str,
    libraries: list[CatalogOption] = None,
) -> LanguageOption:
    return LanguageOption(
        id=id, name=name, icon=icon, description=description, libraries=libraries or []
    )


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
        id="frontend",
        name="Frontend",
        icon="Monitor",
        description="Клиентская веб-разработка",
        languages=[
            _lang(
                "js",
                "JavaScript",
                "Braces",
                "Базовый язык веба",
                libraries=[
                    _opt("react", "React", "Atom", "Библиотека UI"),
                    _opt("vue", "Vue", "Hexagon", "Прогрессивный фреймворк"),
                    _opt("angular", "Angular", "Shield", "Корпоративный фреймворк"),
                    _opt("next", "Next.js", "Layers", "SSR/SSG для React"),
                ],
            ),
            _lang(
                "ts",
                "TypeScript",
                "FileCode2",
                "Типизированный JS",
                libraries=[
                    _opt("react", "React", "Atom", "Библиотека UI"),
                    _opt("vue", "Vue", "Hexagon", "Прогрессивный фреймворк"),
                    _opt("angular", "Angular", "Shield", "Корпоративный фреймворк"),
                    _opt("next", "Next.js", "Layers", "SSR/SSG для React"),
                ],
            ),
        ],
    ),
    StackOption(
        id="backend",
        name="Backend",
        icon="Server",
        description="Серверная разработка",
        languages=[
            _lang(
                "python",
                "Python",
                "FileCode2",
                "Универсальный язык",
                libraries=[
                    _opt("django", "Django", "Boxes", "Batteries-included"),
                    _opt("fastapi", "FastAPI", "Zap", "Асинхронный Python-фреймворк"),
                    _opt("flask", "Flask", "Coffee", "Минималистичный фреймворк"),
                ],
            ),
            _lang(
                "node",
                "Node.js",
                "Hexagon",
                "JS на сервере",
                libraries=[
                    _opt("express", "Express", "Zap", "Минималистичный фреймворк"),
                    _opt("nestjs", "NestJS", "Boxes", "Структурированный фреймворк"),
                ],
            ),
            _lang(
                "go",
                "Go",
                "Rabbit",
                "Компилируемый, быстрый",
                libraries=[
                    _opt("gin", "Gin", "Zap", "Быстрый роутер"),
                    _opt("fiber", "Fiber", "Layers", "Express-подобный фреймворк"),
                ],
            ),
            _lang(
                "java",
                "Java",
                "Coffee",
                "JVM-стек",
                libraries=[
                    _opt("spring", "Spring Boot", "Sprout", "Корпоративный стандарт")
                ],
            ),
            _lang(
                "csharp",
                "C#",
                "Hash",
                ".NET-стек",
                libraries=[
                    _opt(
                        "aspnet", "ASP.NET Core", "Server", "Веб-фреймворк от Microsoft"
                    )
                ],
            ),
            _lang(
                "php",
                "PHP",
                "Code2",
                "Язык для веба",
                libraries=[
                    _opt("laravel", "Laravel", "Boxes", "Популярный фреймворк"),
                    _opt("symfony", "Symfony", "Layers", "Набор компонентов"),
                ],
            ),
        ],
    ),
    StackOption(
        id="mobile",
        name="Mobile",
        icon="Smartphone",
        description="Мобильная разработка",
        languages=[
            _lang(
                "swift",
                "Swift (iOS)",
                "Code2",
                "Нативный iOS",
                libraries=[
                    _opt("swiftui", "SwiftUI", "LayoutGrid", "Декларативный UI"),
                    _opt("uikit", "UIKit", "Layers", "Классический UI"),
                ],
            ),
            _lang(
                "kotlin",
                "Kotlin (Android)",
                "Code2",
                "Нативный Android",
                libraries=[
                    _opt("compose", "Jetpack Compose", "LayoutGrid", "Декларативный UI")
                ],
            ),
            _lang(
                "js",
                "React Native",
                "Atom",
                "Кроссплатформенный JS",
                libraries=[_opt("rn", "React Native", "Layers", "Мобильный UI")],
            ),
        ],
    ),
    StackOption(
        id="data",
        name="Data / ML",
        icon="Brain",
        description="Анализ данных",
        languages=[
            _lang(
                "python",
                "Python",
                "FileCode2",
                "Основной язык ML",
                libraries=[
                    _opt("pandas", "Pandas", "Table", "Табличные данные"),
                    _opt("pytorch", "PyTorch", "Flame", "DL-фреймворк"),
                    _opt("tensorflow", "TensorFlow", "Brain", "DL-фреймворк"),
                ],
            ),
            _lang(
                "r",
                "R",
                "BarChart",
                "Статистика",
                libraries=[
                    _opt("tidyverse", "Tidyverse", "Layers", "Набор пакетов для R")
                ],
            ),
        ],
    ),
    StackOption(
        id="gamedev",
        name="GameDev",
        icon="Gamepad2",
        description="Разработка игр",
        languages=[
            _lang(
                "csharp",
                "C# (Unity)",
                "Hash",
                "Язык для Unity",
                libraries=[
                    _opt("unity", "Unity", "Gamepad2", "Кроссплатформенный движок")
                ],
            ),
            _lang(
                "cpp",
                "C++ (Unreal)",
                "Boxes",
                "Язык для Unreal",
                libraries=[_opt("unreal", "Unreal Engine", "Boxes", "AAA-движок")],
            ),
        ],
    ),
    StackOption(
        id="devops",
        name="DevOps / SRE",
        icon="Cloud",
        description="Инфраструктура",
        languages=[
            _lang("docker", "Docker", "Box", "Контейнеризация"),
            _lang("k8s", "Kubernetes", "Ship", "Оркестрация"),
            _lang("bash", "Bash", "Terminal", "Скрипты"),
        ],
    ),
]


@router.get("/catalog", response_model=CatalogResponse)
def catalog() -> CatalogResponse:
    return CatalogResponse(levels=LEVELS, stacks=STACKS)
