declare global {
  interface Window {
    __EMMS_CONFIG__: Record<string, unknown>;
  }
}

export {};
