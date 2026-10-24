// src/api.ts
export const authApi = {
  register: async (data: any) => {
    return { data: { access_token: "mock_token" } };
  },
  login: async (email: string, pass: string) => {
    return { data: { access_token: "mock_token" } };
  },
  getMe: async () => {
    return { data: { name: "Пользователь Verum", email: "user@verum.ru" } };
  }
};
