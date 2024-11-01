// Extend the Window interface to include SpeechRecognition types
interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
  
  // Define SpeechRecognition type only if it doesn’t already exist
  declare type SpeechRecognition =
    typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;
  
  declare type SpeechRecognitionEvent = Event & {
    results: { [key: number]: { transcript: string }[] };
  };
  