let globalVoices: SpeechSynthesisVoice[] = [];
if (window.speechSynthesis && globalVoices.length == 0) {
    window.speechSynthesis.onvoiceschanged = () => {
        globalVoices = window.speechSynthesis.getVoices();
    };
}
export const speech = async (text: string): Promise<string | null> => {
    const synth = window.speechSynthesis;
    if (synth == null || synth == undefined) {
        return 'Su navegador no soporta la reproducción de audios';
    }
    if (synth.speaking) {
        return 'Espere a que termine de reproducirse';
    }
    const textSpeech = (text || '').trim();
    if (text.length == 0) {
        return null;
    }
    const voices = await loadVoices(synth);
    const utterThis = new SpeechSynthesisUtterance(textSpeech);
    utterThis.onend = function () {};
    utterThis.onerror = function (event) {
        console.error('ocurrio un error al reproducir', event);
    };
    const enUS = voices.find((v) => {
        const lang = v.lang.toLowerCase();
        return lang == 'en-us' || lang == 'en_us';
    });
    if (!enUS) {
        return 'No se ha encontrado el soporte para el idioma ingles, intente nuevamente';
    }
    utterThis.voice = enUS;
    utterThis.pitch = 1;
    utterThis.rate = 0.85;
    synth.speak(utterThis);
    return null;
};

const loadVoices = (synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
        if (globalVoices.length > 0) {
            resolve(globalVoices);
        } else {
            synth.onvoiceschanged = () => {
                globalVoices = synth.getVoices();
                resolve(globalVoices);
            };
        }
    });
};
