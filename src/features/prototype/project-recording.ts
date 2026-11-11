import { z } from "zod";

export const MAX_RECORDING_BYTES = 160_000;
export const MAX_RECORDING_SECONDS = 30;
export const projectRecordingSchema = z.object({
  question: z.string().min(1).max(300),
  audio: z
    .string()
    .max(4 * Math.ceil(MAX_RECORDING_BYTES / 3) + 32)
    .regex(/^data:audio\/(webm|ogg|mp4);base64,[A-Za-z0-9+/]+={0,2}$/),
});
export type ProjectRecording = z.infer<typeof projectRecordingSchema>;
