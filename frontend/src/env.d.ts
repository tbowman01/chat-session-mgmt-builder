/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GITHUB_REDIRECT_URI: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_BASE_URL: string
  readonly NODE_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}