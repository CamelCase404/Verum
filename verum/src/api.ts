const API_BASE = "http://localhost:8000";

export function getToken(): string | null {
  return localStorage.getItem("verum_token");
}

export function setToken(token: string) {
  localStorage.setItem("verum_token", token);
}

export function clearToken() {
  localStorage.removeItem("verum_token");
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<{ data: T }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data.detail || `Ошибка ${res.status}`);
  }
  return { data };
}

export const authApi = {
  register: (data: any) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, pass: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password: pass }) }),

  getMe: () => request("/api/auth/me"),

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/auth/upload-avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Ошибка загрузки файла");
    return res.json();
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/auth/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Ошибка загрузки картинки");
    return res.json();
  },

  parseJob: (description: string) =>
    request("/api/company/parse-job", { method: "POST", body: JSON.stringify({ description }) }),
  updateJobs: (job_postings: any[]) =>
    request("/api/auth/jobs", { method: "PUT", body: JSON.stringify({ job_postings }) }),

  updateProfile: (data: any) =>
    request("/api/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  saveSkills: (report: any) =>
    request("/api/auth/skills", { method: "POST", body: JSON.stringify(report) }),

  searchCandidates: (filters: any) =>
    request("/api/auth/search", { method: "POST", body: JSON.stringify(filters) }),
};

export const chatApi = {
  startChat: (target_user_id: number) =>
    request("/api/chat/start", { method: "POST", body: JSON.stringify({ target_user_id }) }),
  getConversations: () => request("/api/chat/conversations"),
  getMessages: (conv_id: number) => request(`/api/chat/${conv_id}/messages`),
  uploadChatImage: async (conv_id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/chat/${conv_id}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Ошибка загрузки фото");
    return data;
  },
  sendMessage: (conv_id: number, text: string, image_url?: string) =>
    request(`/api/chat/${conv_id}/messages`, { method: "POST", body: JSON.stringify({ text, image_url }) }),
};
