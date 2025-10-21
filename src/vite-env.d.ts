/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_GCP_PROJECT_ID: string
  readonly VITE_GCP_REGION: string
  readonly VITE_STATS_APP_URL: string
  readonly VITE_STATS_API_ENDPOINT: string
  readonly VITE_SCHOOL_NAME: string
  readonly VITE_TEAM_NAME: string
  readonly VITE_SCHOOL_MOTTO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
