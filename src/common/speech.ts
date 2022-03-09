export const speech = async (text: string): Promise<string | null> => {
    const synth = window.speechSynthesis;
    if (synth == null || synth == undefined) {
        return 'Su navegador no soporta la reproducción de audios';
    }
    if (synth.speaking) {
        return null;
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
    }) || null;

    utterThis.voice = enUS;
    utterThis.pitch = 1;
    utterThis.rate = 0.85;
    synth.speak(utterThis);
    return null;
};

const loadVoices = (synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
        let globalVoices = synth.getVoices();
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
