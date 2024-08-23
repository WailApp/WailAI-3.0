// Object holding translations for each language
const translations = {
    en: {
        title: "WailAI 3.0",
        subtitle: "How can I help you today?",
        typingInputPlaceholder: "Message WailAI",
        suggestions: [
            "Write me a complete story about the game GTA.",
            "Give me ideas to become famous on TikTok.",
            "Help me choose a programming language to learn.",
            "Write me the HTML code for a school website."
        ],
        disclaimer: "WailAI can make mistakes, so double-check that results are accurate before using them and that you have the right to use the content. Do not share personal information."
    },
    ar: {
        title: "WailAI 3.0",
        subtitle: "كيف يمكنني مساعدتك اليوم؟",
        typingInputPlaceholder: "رسالة WailAI",
        suggestions: [
            "اكتب لي قصة كاملة عن لعبة GTA.",
            "أعطني أفكارًا لتصبح مشهورًا على TikTok.",
            "ساعدني في اختيار لغة برمجة لأتعلمها.",
            "اكتب لي كود HTML لموقع مدرسة."
        ],
        disclaimer: "WailAI قد يرتكب أخطاء، لذا تحقق من دقة النتائج قبل استخدامها وتأكد من أن لديك الحق في استخدام المحتوى. لا تشارك المعلومات الشخصية."
    },
    fr: {
        title: "WailAI 3.0",
        subtitle: "Comment puis-je vous aider aujourd'hui ?",
        typingInputPlaceholder: "Message WailAI",
        suggestions: [
            "Écrivez-moi une histoire complète sur le jeu GTA.",
            "Donnez-moi des idées pour devenir célèbre sur TikTok.",
            "Aidez-moi à choisir un langage de programmation à apprendre.",
            "Écrivez-moi le code HTML pour un site scolaire."
        ],
        disclaimer: "WailAI peut faire des erreurs, alors vérifiez l'exactitude des résultats avant de les utiliser et assurez-vous d'avoir le droit d'utiliser le contenu. Ne partagez pas d'informations personnelles."
    },
    es: {
        title: "WailAI 3.0",
        subtitle: "¿Cómo puedo ayudarte hoy?",
        typingInputPlaceholder: "Mensaje WailAI",
        suggestions: [
            "Escríbeme una historia completa sobre el juego GTA.",
            "Dame ideas para hacerme famoso en TikTok.",
            "Ayúdame a elegir un lenguaje de programación para aprender.",
            "Escríbeme el código HTML para un sitio web escolar."
        ],
        disclaimer: "WailAI puede cometer errores, así que verifica que los resultados sean precisos antes de usarlos y que tengas derecho a usar el contenido. No compartas información personal."
    },
    it: {
        title: "WailAI 3.0",
        subtitle: "Come posso aiutarti oggi?",
        typingInputPlaceholder: "Messaggio WailAI",
        suggestions: [
            "Scrivimi una storia completa sul gioco GTA.",
            "Dammi idee per diventare famoso su TikTok.",
            "Aiutami a scegliere un linguaggio di programmazione da imparare.",
            "Scrivimi il codice HTML per un sito scolastico."
        ],
        disclaimer: "WailAI può commettere errori, quindi verifica che i risultati siano accurati prima di usarli e che tu abbia il diritto di usare il contenuto. Non condividere informazioni personali."
    }
};

// Function to detect the browser language and set it
const detectLanguage = () => {
    const browserLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
    if (browserLanguage.startsWith('ar')) return 'ar';
    if (browserLanguage.startsWith('fr')) return 'fr';
    if (browserLanguage.startsWith('es')) return 'es';
    if (browserLanguage.startsWith('it')) return 'it';
    return 'en'; // Default to English
};

// Function to change the language based on the detected language
function changeLanguage(language) {
    // Update all text elements including placeholder
    document.querySelector('.title').textContent = translations[language].title;
    document.querySelector('.subtitle').textContent = translations[language].subtitle;
    document.querySelectorAll('.suggestion .text').forEach((element, index) => {
        element.textContent = translations[language].suggestions[index];
    });
    document.querySelector('.disclaimer-text').textContent = translations[language].disclaimer;

    // Update placeholder
    const inputField = document.querySelector(".typing-input");
    if (inputField) {
        inputField.placeholder = translations[language].typingInputPlaceholder;
    }
}

// Function to load the saved language from localStorage or default to browser language
function loadLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || detectLanguage();
    changeLanguage(savedLanguage);
}

// Load the preferred language on page load
document.addEventListener('DOMContentLoaded', loadLanguage);
