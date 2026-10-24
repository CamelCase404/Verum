import type { Notification } from "@/types";
export const defaultNotifications = (): Notification[] => [
  { id: "n1", t: "Новый заказ под ваш профиль", d: "«Переписать личный кабинет на React» — 94%", time: "5 минут назад", unread: true, ico: "◈" },
  { id: "n2", t: "Профиль просмотрен", d: "«Северный поток» открыл ваш профиль", time: "1 час назад", unread: true, ico: "◉" },
  { id: "n3", t: "Результат проверки готов", d: "Ваш профиль подтверждён. Балл: 82", time: "Вчера", unread: false, ico: "✓" },
];
