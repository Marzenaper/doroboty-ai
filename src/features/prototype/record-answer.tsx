import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MAX_RECORDING_BYTES,
  MAX_RECORDING_SECONDS,
  type ProjectRecording,
} from "./project-recording";

export function ProjectRecordings({ recordings }: { recordings: readonly ProjectRecording[] }) {
  if (!recordings.length) return null;
  return (
    <div className="grid gap-3">
      <p className="font-semibold">Odpowiedzi głosowe</p>
      {recordings.map(({ question, audio }) => (
        <div key={question} className="grid gap-2">
          <p>{question}</p>
          <audio className="w-full" controls preload="metadata" src={audio} aria-label={question} />
        </div>
      ))}
    </div>
  );
}

export function RecordAnswer({
  audio,
  onAudio,
  onBusy,
}: {
  audio: string;
  onAudio: (value: string) => void;
  onBusy: (busy: boolean) => void;
}) {
  const live = useRef<{ stream: MediaStream; recorder: MediaRecorder; timer: number } | null>(null);
  const mounted = useRef(false);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const session = live.current;
      if (!session) return;
      window.clearTimeout(session.timer);
      session.recorder.onstop = null;
      if (session.recorder.state !== "inactive") session.recorder.stop();
      session.stream.getTracks().forEach((track) => track.stop());
      live.current = null;
    };
  }, []);

  function finish() {
    const session = live.current;
    if (!session) return;
    window.clearTimeout(session.timer);
    session.stream.getTracks().forEach((track) => track.stop());
    live.current = null;
    setRecording(false);
    setBusy(false);
    onBusy(false);
  }

  async function start() {
    if (busy) return;
    setStatus("");
    setBusy(true);
    onBusy(true);
    let stream: MediaStream | undefined;
    try {
      const mimeType = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4"].find(
        (type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type),
      );
      if (!mimeType || !navigator.mediaDevices?.getUserMedia) {
        setStatus("Nagrywanie nie jest dostępne w tej przeglądarce. Możesz wpisać odpowiedź.");
        setBusy(false);
        onBusy(false);
        return;
      }
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 24_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => {
        recorder.onstop = null;
        setStatus("Nie udało się nagrać odpowiedzi. Spróbuj ponownie lub wpisz tekst.");
        finish();
      };
      recorder.onstop = () => {
        if (!mounted.current) return;
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        setRecording(false);
        stream?.getTracks().forEach((track) => track.stop());
        if (!blob.size || blob.size > MAX_RECORDING_BYTES) {
          setStatus(
            blob.size
              ? "Nagranie jest za duże. Nagraj krótszą odpowiedź."
              : "Nagranie jest puste. Spróbuj ponownie.",
          );
          finish();
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          if (!mounted.current) return;
          if (typeof reader.result === "string") {
            onAudio(reader.result);
            setStatus("Nagranie gotowe do odsłuchania.");
          } else {
            setStatus("Nie udało się zapisać nagrania.");
          }
          finish();
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      const timer = window.setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, MAX_RECORDING_SECONDS * 1000);
      live.current = { stream, recorder, timer };
      setRecording(true);
      setStatus("Nagrywam odpowiedź.");
    } catch {
      stream?.getTracks().forEach((track) => track.stop());
      if (!mounted.current) return;
      setStatus("Nie udało się użyć mikrofonu. Sprawdź zgodę przeglądarki lub wpisz odpowiedź.");
      setBusy(false);
      onBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="application-actions">
        <Button
          type="button"
          variant="outline"
          disabled={busy && !recording}
          onClick={() => {
            if (recording) {
              if (live.current?.recorder.state === "recording") live.current.recorder.stop();
              setRecording(false);
            } else {
              void start();
            }
          }}
        >
          {recording ? "Zakończ nagranie" : audio ? "Nagraj ponownie" : "Nagraj odpowiedź"}
        </Button>
        {audio && (
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => {
              onAudio("");
              setStatus("");
            }}
          >
            Usuń nagranie
          </Button>
        )}
      </div>
      <p className="application-help">
        Do {MAX_RECORDING_SECONDS} sekund. Nagranie dołączysz po zatwierdzeniu opisu.
      </p>
      {status && (
        <p role="status" className="application-help">
          {status}
        </p>
      )}
      {audio && (
        <audio
          className="w-full"
          controls
          preload="metadata"
          src={audio}
          aria-label="Odsłuchaj swoją odpowiedź"
        />
      )}
    </div>
  );
}
