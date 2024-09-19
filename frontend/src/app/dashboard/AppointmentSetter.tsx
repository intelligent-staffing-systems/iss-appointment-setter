'use client'
import { useState, useRef } from 'react';

export default function AppointmentSetter() {
  const [audioStream, setAudioStream] = useState<ReadableStream | null>(null);
  const [textResponse, setTextResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = startCall;

      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function startCall() {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

    const response = await fetch('/api/v1/process_call', {
      method: 'POST',
      body: audioBlob
    });

    const reader = response.body!.getReader();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    setAudioStream(new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);

          const audioBuffer = await audioContext.decodeAudioData(value.buffer);
          playAudio(audioBuffer, audioContext);
        }
        controller.close();
      }
    }));

    // Get the text response
    const textResponse = await fetch('/api/v1/get_text_response');
    const { text } = await textResponse.json();
    setTextResponse(text);
  }

  function playAudio(audioBuffer: AudioBuffer, audioContext: AudioContext) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }

  return (
    <div>
      <h3>Appointment Setter</h3>
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {audioStream && <audio src={URL.createObjectURL(new Blob([audioStream]))} controls />}
      {textResponse && <p>Text Response: {textResponse}</p>}
    </div>
  );
}
