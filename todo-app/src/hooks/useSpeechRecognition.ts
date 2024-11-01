import { useState, useEffect } from "react";

type SpeechRecognitionEvent = Event & {
  results: { [key: number]: { transcript: string }[] };
};

export function useSpeechRecognition(onResult: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = "en-US";
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log("Recognized text:", transcript); // Debugging output
        onResult(transcript);
      };

      recognitionInstance.onend = () => {
        console.log("Recognition ended"); // Debugging output
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn("SpeechRecognition is not supported in this browser.");
    }
  }, [onResult]);

  const startListening = () => {
    if (recognition && !isListening) {
      console.log("Starting recognition"); // Debugging output
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      console.log("Stopping recognition"); // Debugging output
      recognition.stop();
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening };
}
