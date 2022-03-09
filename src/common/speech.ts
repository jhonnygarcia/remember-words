export const getVoices = (synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
        let voices = synth.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        synth.onvoiceschanged = () => {
            voices = synth.getVoices();
            resolve(voices);
        };
    });
};

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
        return 'Texto vacío';
    }
    const voices = await getVoices(synth);
    console.log(voices);
    const utterThis = new SpeechSynthesisUtterance(textSpeech);
    utterThis.onend = function (event) {};
    utterThis.onerror = function (event) {
        console.error('ocurrio un error al reproducir', event);
    };
    const enUS = voices.find((v) => {
        const lang = v.lang.toLowerCase();
        return lang == 'en-us' || lang == 'en_us';
    });
    if (!enUS) {
        return 'Su navegador no tiene soporte para el idioma Ingles';
    }
    utterThis.voice = enUS;
    utterThis.pitch = 1;
    utterThis.rate = 0.85;
    synth.speak(utterThis);
    return null;
};
