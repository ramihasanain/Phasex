export function pickByLang<T>(language: string, bundles: { en: T; ar: T; tr: T; ru: T; fr: T; es: T }): T {
    switch (language) {
        case "ar":
            return bundles.ar;
        case "ru":
            return bundles.ru;
        case "tr":
            return bundles.tr;
        case "fr":
            return bundles.fr;
        case "es":
            return bundles.es;
        default:
            return bundles.en;
    }
}
