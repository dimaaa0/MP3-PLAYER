import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  theme: {
    appearance: "light", // Включает светлую тему (текст станет темным)
    primaryColor: "#000000", // Цвет кнопок (черный на белом фоне смотрится стильно)
    backgroundColor: "#ffffff", // Явно задаем белый фон для самих форм
    textColor: "#000000", // Черный текст для максимальной читаемости
  }
});

