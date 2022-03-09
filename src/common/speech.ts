export let synth!: SpeechSynthesis;
export let voices!: SpeechSynthesisVoice[];
try {
    synth = window.speechSynthesis;
    voices = synth.getVoices();
} catch (e) {}

export const speech = (text: string): string | null => {
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

    const utterThis = new SpeechSynthesisUtterance(textSpeech);
    utterThis.onend = function (event) {};
    utterThis.onerror = function (event) {
        console.error('ocurrio un error al reproducir', event);
    };
    const enUS = voices.find((v) => v.lang == 'en-US');
    if (!enUS) {
        return 'Su navegador no tiene soporte para el idioma Ingles';
    }
    utterThis.voice = enUS;
    utterThis.pitch = 1;
    utterThis.rate = 0.75;
    synth.speak(utterThis);
    return null;
};
