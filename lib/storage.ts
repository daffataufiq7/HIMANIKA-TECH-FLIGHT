// SSR and Safe Storage Utility

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") {
      return memoryStore[key] || null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStore[key] || null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") {
      memoryStore[key] = value;
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      memoryStore[key] = value;
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") {
      delete memoryStore[key];
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      delete memoryStore[key];
    }
  }
};
