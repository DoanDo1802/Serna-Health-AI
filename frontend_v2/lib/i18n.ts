// Language translations
export const translations = {
  en: {
    account: "Account",
    profile: "Profile",
    logout: "Log out",
    loggingOut: "Logging out...",
    language: "Language",
    english: "English",
    vietnamese: "Tiếng Việt",
  },
  vi: {
    account: "Tài khoản",
    profile: "Hồ sơ",
    logout: "Đăng xuất",
    loggingOut: "Đang đăng xuất...",
    language: "Ngôn ngữ",
    english: "English",
    vietnamese: "Tiếng Việt",
  },
}

export type Language = "en" | "vi"

export const getTranslation = (lang: Language, key: keyof typeof translations.en) => {
  return translations[lang][key]
}

