import { NavigationPath } from "@/lib/types";


export const mockNavigationPathDefault: NavigationPath = {
    queryId: '1',
    steps: [
        { id: '1', label: 'Начальная обработка запроса', description: 'Анализ намерения запроса', status: 'completed', confidence: 0.9 },
        { id: '2', label: 'Выбор категории знаний', description: 'Определение соответствующей области знаний', status: 'completed', confidence: 0.85 },
        { id: '3', label: 'Навигация по конкретной теме', description: 'Сужение до конкретной темы', status: 'completed', confidence: 0.7 },
        { id: '4', label: 'Формулирование ответа', description: 'Генерация ответа из базы знаний', status: 'completed', confidence: 0.8 },
    ],
    currentStepIndex: 3,
};

// расскажи про класс Воина
export const mockNavigationPathFighter: NavigationPath = {
  queryId: 'fighter_query_1',
  steps: [
    { id: '1', label: 'Начальная обработка запроса', description: 'Анализ намерения запроса', status: 'completed', confidence: 0.95 },
    { id: '2', label: 'Выбор категории знаний', description: 'Определена категория: "Classes"', status: 'completed', confidence: 0.9 },
    { id: '3', label: 'Навигация по подкатегориям', description: 'Сужение до подкатегории: "Martial Classes"', status: 'completed', confidence: 0.88 },
    { id: '4', label: 'Навигация по конкретной теме', description: 'Найден конкретный узел: "Fighter"', status: 'completed', confidence: 0.92 },
    { id: '5', label: 'Извлечение информации', description: 'Извлечение описания и характеристик класса "Fighter"', status: 'completed', confidence: 0.9 },
    { id: '6', label: 'Формулирование ответа', description: 'Генерация ответа о классе "Fighter"', status: 'completed', confidence: 0.85 },
  ],
  currentStepIndex: 5,
};


// как работает бой в днд
export const mockNavigationPathCombatRules: NavigationPath = {
  queryId: 'combat_query_1',
  steps: [
    { id: '1', label: 'Начальная обработка запроса', description: 'Анализ намерения запроса', status: 'completed', confidence: 0.9 },
    { id: '2', label: 'Выбор категории знаний', description: 'Определена категория: "Game Mechanics"', status: 'completed', confidence: 0.88 },
    { id: '3', label: 'Навигация по подкатегориям', description: 'Сужение до подкатегории: "Combat"', status: 'completed', confidence: 0.92 },
    { id: '4', label: 'Извлечение информации', description: 'Извлечение основных правил боя (инициатива, атаки, урон)', status: 'completed', confidence: 0.87 },
    { id: '5', label: 'Формулирование ответа', description: 'Генерация ответа с обзором боевой системы', status: 'completed', confidence: 0.82 },
  ],
  currentStepIndex: 4,
};

// заклинание огненный шар
export const mockNavigationPathFireball: NavigationPath = {
  queryId: 'fireball_query_1',
  steps: [
    { id: '1', label: 'Начальная обработка запроса', description: 'Анализ намерения запроса', status: 'completed', confidence: 0.93 },
    { id: '2', label: 'Выбор категории знаний', description: 'Определена категория: "Spells"', status: 'completed', confidence: 0.89 },
    { id: '3', label: 'Навигация по подкатегориям', description: 'Определена подкатегория по названию', status: 'completed', confidence: 0.8 }, // Возможно, потребуется поиск по тексту
    { id: '4', label: 'Навигация по уровням заклинаний', description: 'Определение уровня заклинания (3rd Level Spells)', status: 'completed', confidence: 0.75 }, // Если уровень известен или определен
    { id: '5', label: 'Навигация по школам магии', description: 'Определение школы магии (Evocation)', status: 'completed', confidence: 0.78 }, // Если школа известна
    { id: '6', label: 'Навигация по конкретной теме', description: 'Найден конкретный узел/информация о "Fireball"', status: 'completed', confidence: 0.91 },
    { id: '7', label: 'Извлечение информации', description: 'Извлечение описания, урона и других параметров заклинания', status: 'completed', confidence: 0.9 },
    { id: '8', label: 'Формулирование ответа', description: 'Генерация ответа с деталями о "Fireball"', status: 'completed', confidence: 0.86 },
  ],
  currentStepIndex: 7,
};

// характеристики расы дварфов
export const mockNavigationPathDwarf: NavigationPath = {
  queryId: 'dwarf_query_1',
  steps: [
    { id: '1', label: 'Начальная обработка запроса', description: 'Анализ намерения запроса', status: 'completed', confidence: 0.94 },
    { id: '2', label: 'Выбор категории знаний', description: 'Определена категория: "Races"', status: 'completed', confidence: 0.91 },
    { id: '3', label: 'Навигация по подкатегориям', description: 'Сужение до подкатегории: "Common Races"', status: 'completed', confidence: 0.89 },
    { id: '4', label: 'Навигация по конкретной теме', description: 'Найден конкретный узел: "Dwarf"', status: 'completed', confidence: 0.93 },
    { id: '5', label: 'Извлечение информации', description: 'Извлечение расовых особенностей, характеристик и истории', status: 'completed', confidence: 0.9 },
    { id: '6', label: 'Формулирование ответа', description: 'Генерация ответа о расе "Dwarf"', status: 'completed', confidence: 8.7 },
  ],
  currentStepIndex: 5,
};
