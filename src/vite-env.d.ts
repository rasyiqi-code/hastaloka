/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  electronAPI?: {
    isElectron: boolean;
    printToPDF: () => Promise<{ success: boolean; filePath?: string; error?: string; cancelled?: boolean }>;
    requestAI: (options: { url: string; method?: string; headers?: Record<string, string>; body?: any }) => Promise<{ ok: boolean; status: number; data?: any; error?: string }>;
  };
}
