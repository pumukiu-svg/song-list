const LANGUAGES = [
    {
        query: ["Italian"],
        name: "Italiano",
        icon: "icons/it.svg"
    },
    {
        query: ["Spanish", "Español", "español"],
        name: "Español",
        icon: "icons/es.svg"
    },
    {
        query: ["Galician"],
        name: "Gallego",
        icon: "icons/es-ga.svg"
    },
    {
        query: ["Japanese", "Japanese - Hiragana", "Japanese (romanized)", "Japanese - Romaji", "Japanese - Kanji"],
        name: "Japonés",
        icon: "icons/jp.svg"
    },
    {
        query: ["French", "Französisch"],
        name: "Francés",
        icon: "icons/fr.svg"
    },
    {
        query: ["English", "Englisch", "Inglés"],
        name: "Inglés",
        icon: "icons/gb.svg"
    },
    {
        query: ["German"],
        name: "Alemán",
        icon: "icons/de.svg"
    },
    {
        query: ["Korean"],
        name: "Coreano",
        icon: "icons/kr.svg"
    },
    {
        query: ["Romanian"],
        name: "Rumano",
        icon: "icons/ro.svg"
    },
    {
        query: ["Latin"],
        name: "Latín",
        icon: "icons/la.svg"
    }
];

const SKIPPABLE_LANGUAGES = [
    "",
    "Others",
    "Other"
]

window.LANGUAGES = LANGUAGES;
window.SKIPPABLE_LANGUAGES = SKIPPABLE_LANGUAGES;