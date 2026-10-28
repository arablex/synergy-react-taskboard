import type { AppState, Member, Sprint, Task } from '../types'
import { addDays, daysInclusive, todayISO } from '../utils/date'

// Демо-данные. Даты считаются от сегодняшнего дня, чтобы текущий спринт всегда был «живым».

export const members: Member[] = [
  { id: 'm1', fullName: 'Алексей Степикин', position: 'Frontend-разработчик', department: 'Разработка' },
  { id: 'm2', fullName: 'Мария Орлова', position: 'Product-менеджер', department: 'Продукт' },
  { id: 'm3', fullName: 'Игорь Ветров', position: 'Backend-разработчик', department: 'Разработка' },
  { id: 'm4', fullName: 'Елена Крылова', position: 'UX/UI-дизайнер', department: 'Дизайн' },
  { id: 'm5', fullName: 'Дмитрий Соколов', position: 'QA-инженер', department: 'Качество' },
  { id: 'm6', fullName: 'Анна Белова', position: 'Бизнес-аналитик', department: 'Аналитика' },
]

function makeSprint(id: string, name: string, goal: string, start: string, end: string): Sprint {
  return { id, name, goal, startDate: start, endDate: end, durationDays: daysInclusive(start, end) }
}

type TaskSeed = {
  id: string
  title: string
  subtitle: string
  author: string
  assignee: string
  hours: number
  status: Task['status']
  sprint: string | null
  /** номер дня спринта, когда задачу закрыли (для done) */
  doneDay?: number
  description: string
  comment?: string
  watchers?: string[]
}

export function createSeedState(): AppState {
  const today = todayISO()
  const s11Start = addDays(today, -20)
  const s12Start = addDays(today, -6)

  const sprints: Sprint[] = [
    makeSprint(
      's11',
      'Спринт 11 — Каталог товаров',
      'Выпустить обновлённый каталог: фильтры, сортировка и карточка товара',
      s11Start,
      addDays(today, -7),
    ),
    makeSprint(
      's12',
      'Спринт 12 — Личный кабинет',
      'Запустить личный кабинет клиента: профиль, история заказов и уведомления',
      s12Start,
      addDays(today, 7),
    ),
  ]

  const seeds: TaskSeed[] = [
    // --- Спринт 12 (текущий) ---
    { id: 'LK-1214', title: 'Макет профиля клиента', subtitle: 'Экран профиля и настройки аккаунта', author: 'm2', assignee: 'm4', hours: 12, status: 'done', sprint: 's12', doneDay: 2, description: 'Подготовить макеты десктопной и планшетной версии профиля с блоками контактов и настроек.' },
    { id: 'LK-2381', title: 'API профиля', subtitle: 'Методы GET и PUT для /profile', author: 'm2', assignee: 'm3', hours: 10, status: 'done', sprint: 's12', doneDay: 3, description: 'Реализовать чтение и обновление профиля клиента с валидацией полей на стороне сервера.' },
    { id: 'LK-3871', title: 'Доступность форм', subtitle: 'Фокус, aria-атрибуты, контраст', author: 'm2', assignee: 'm4', hours: 5, status: 'done', sprint: 's12', doneDay: 4, description: 'Проверить все формы личного кабинета: порядок фокуса, подписи к полям и достаточный контраст.' },
    { id: 'LK-3175', title: 'Форма редактирования профиля', subtitle: 'Поля, валидация, сохранение', author: 'm2', assignee: 'm1', hours: 14, status: 'done', sprint: 's12', doneDay: 5, description: 'Собрать форму на React с переиспользуемыми полями ввода и показом ошибок валидации.', watchers: ['m4'] },
    { id: 'LK-4462', title: 'История заказов: список', subtitle: 'Таблица с пагинацией и сортировкой', author: 'm2', assignee: 'm1', hours: 16, status: 'inprogress', sprint: 's12', description: 'Вывести список заказов клиента в виде таблицы, добавить пагинацию и сортировку по дате.', comment: 'Уточнить у аналитика, нужно ли показывать отменённые заказы по умолчанию.', watchers: ['m2', 'm5'] },
    { id: 'LK-7243', title: 'Тест-план личного кабинета', subtitle: 'Сценарии регрессионного тестирования', author: 'm2', assignee: 'm5', hours: 6, status: 'inprogress', sprint: 's12', description: 'Описать основные сценарии проверки профиля, заказов и уведомлений для регресса перед релизом.' },
    { id: 'LK-5529', title: 'API истории заказов', subtitle: 'Фильтры по дате и статусу', author: 'm6', assignee: 'm3', hours: 12, status: 'review', sprint: 's12', description: 'Добавить в метод списка заказов фильтры по периоду и статусу, покрыть тестами.', watchers: ['m1'] },
    { id: 'LK-6718', title: 'Центр уведомлений: макеты', subtitle: 'Состояния: пусто, новые, прочитанные', author: 'm2', assignee: 'm4', hours: 8, status: 'review', sprint: 's12', description: 'Нарисовать экран уведомлений со всеми состояниями и вариантами пустого списка.' },
    { id: 'LK-8156', title: 'Уведомления: backend', subtitle: 'Очередь, хранение и отметка прочтения', author: 'm6', assignee: 'm3', hours: 20, status: 'todo', sprint: 's12', description: 'Сделать хранилище уведомлений, очередь отправки и метод отметки уведомления прочитанным.' },
    { id: 'LK-9327', title: 'Метрики использования кабинета', subtitle: 'События аналитики по ключевым действиям', author: 'm2', assignee: 'm6', hours: 8, status: 'todo', sprint: 's12', description: 'Составить список событий и описать, какие метрики покажут реальное использование кабинета.' },
    { id: 'LK-1493', title: 'Адаптив страницы заказов', subtitle: 'Планшетная и мобильная версии', author: 'm4', assignee: 'm1', hours: 6, status: 'todo', sprint: 's12', description: 'Адаптировать таблицу заказов под планшет и телефон: карточки вместо строк на узких экранах.' },
    { id: 'LK-2654', title: 'Smoke-тесты перед релизом', subtitle: 'Чек-лист проверки на проде', author: 'm2', assignee: 'm5', hours: 4, status: 'todo', sprint: 's12', description: 'Подготовить короткий чек-лист для проверки ключевых сценариев сразу после выкладки.' },
    // --- Бэклог ---
    { id: 'PR-1128', title: 'Тёмная тема интерфейса', subtitle: 'Переключатель темы в настройках', author: 'm4', assignee: 'm1', hours: 18, status: 'todo', sprint: null, description: 'Добавить тёмную тему через переменные цвета и сохранять выбор пользователя в настройках.' },
    { id: 'PR-2245', title: 'Экспорт заказов в CSV', subtitle: 'Выгрузка истории заказов одним файлом', author: 'm6', assignee: 'm3', hours: 9, status: 'todo', sprint: null, description: 'Дать клиенту возможность скачать историю заказов за выбранный период в формате CSV.' },
    { id: 'PR-3362', title: 'Двухфакторная аутентификация', subtitle: 'Подтверждение входа кодом из SMS', author: 'm2', assignee: 'm3', hours: 24, status: 'todo', sprint: null, description: 'Проработать и реализовать дополнительное подтверждение входа одноразовым кодом из SMS.' },
    { id: 'PR-4479', title: 'Онбординг нового клиента', subtitle: 'Подсказки при первом входе', author: 'm2', assignee: 'm4', hours: 10, status: 'todo', sprint: null, description: 'Спроектировать короткую последовательность подсказок для клиента, который впервые зашёл в кабинет.' },
    // --- Спринт 11 (завершён) ---
    { id: 'KT-1182', title: 'Фильтры каталога', subtitle: 'Категория, цена, наличие', author: 'm2', assignee: 'm1', hours: 16, status: 'done', sprint: 's11', doneDay: 8, description: 'Реализовать боковую панель фильтров каталога с сохранением выбранных значений в адресе страницы.' },
    { id: 'KT-2273', title: 'Карточка товара', subtitle: 'Галерея, характеристики, отзывы', author: 'm4', assignee: 'm4', hours: 14, status: 'done', sprint: 's11', doneDay: 10, description: 'Подготовить итоговый вариант карточки товара с галереей изображений и блоком характеристик.' },
    { id: 'KT-3364', title: 'Сортировка и поиск', subtitle: 'API и интерфейс поиска по каталогу', author: 'm6', assignee: 'm3', hours: 12, status: 'done', sprint: 's11', doneDay: 12, description: 'Добавить сортировку по цене и популярности, а также быстрый поиск по названию товара.' },
  ]

  const tasks: Task[] = seeds.map((s) => {
    const sprint = s.sprint ? sprints.find((x) => x.id === s.sprint)! : null
    return {
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      authorId: s.author,
      assigneeId: s.assignee,
      estimateHours: s.hours,
      description: s.description,
      comment: s.comment ?? '',
      watcherIds: s.watchers ?? [],
      sprintId: s.sprint,
      status: s.status,
      createdAt: sprint ? sprint.startDate : addDays(today, -10),
      doneAt: s.status === 'done' && sprint ? addDays(sprint.startDate, s.doneDay ?? 1) : null,
    }
  })

  return { members, sprints, tasks, selectedSprintId: null, currentUserId: 'm1' }
}
