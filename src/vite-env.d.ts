/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base URL in production (e.g. https://api.example.com/api). Dev uses Vite proxy `/api`. */
  readonly VITE_API_URL?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'swiper/css'
declare module 'swiper/css/effect-fade'
declare module 'swiper/css/pagination'
