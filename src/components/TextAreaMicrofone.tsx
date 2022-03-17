import { faMicrophone, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const TextAreaMicrofone = (props: {
    fake?: boolean;
    init?: () => void;
    finish?: () => void;
    language: string;
    speech: (text: string) => void;
    [key: string]: any;
}) => {
    const { language, fake, init, finish, speech, ...configs } = props;

    if (fake == true) {
        return (
            <div style={{ position: 'relative' }}>
                <textarea {...configs} style={{ backgroundImage: 'none' }} />
                <span style={{ position: 'absolute', right: '0.188rem', top: '0.188rem' }}>
                    <FontAwesomeIcon className="text-primary" size="2x" icon={faMicrophone} />
                </span>
            </div>
        );
    }

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>{"Browser doesn't support speech recognition."}</span>;
    }

    const start = () => {
        if (init) {
            init();
        }
        SpeechRecognition.startListening({ language });
    };

    useEffect(() => {
        if ((transcript || '').length > 0) {
            const transcriptUpper = transcript.charAt(0).toUpperCase() + transcript.slice(1);
            speech(transcriptUpper);
            resetTranscript();
            if (finish) {
                finish();
            }
        }
    }, [listening]);

    return (
        <div style={{ position: 'relative' }}>
            <textarea {...configs} style={{ backgroundImage: 'none' }} />
            <span style={{ position: 'absolute', right: '0.188rem', top: '0.188rem' }}>
                <FontAwesomeIcon
                    className="text-primary"
                    size="2x"
                    icon={listening ? faCircle : faMicrophone}
                    onClick={start}
                />
            </span>
        </div>
    );
};
