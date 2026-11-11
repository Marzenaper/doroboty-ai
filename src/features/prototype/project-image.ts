import { z } from "zod";

export const MAX_PROJECT_IMAGES = 2;
export const MAX_PROJECT_IMAGE_BYTES = 250_000;
export const PROJECT_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const projectImagesSchema = z
  .array(
    z.object({
      name: z.string().min(1).max(180),
      src: z
        .string()
        .max(4 * Math.ceil(MAX_PROJECT_IMAGE_BYTES / 3) + 32)
        .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/),
      caption: z.string().trim().max(160),
    }),
  )
  .max(MAX_PROJECT_IMAGES)
  .optional();

export type ProjectImage = NonNullable<z.infer<typeof projectImagesSchema>>[number];
