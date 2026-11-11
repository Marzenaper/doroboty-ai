import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MAX_PROJECT_IMAGES,
  MAX_PROJECT_IMAGE_BYTES,
  PROJECT_IMAGE_TYPES,
  type ProjectImage,
} from "./project-image";

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => (typeof reader.result === "string" ? resolve(reader.result) : reject());
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProjectImages({ images }: { images: readonly ProjectImage[] }) {
  if (!images.length) return null;
  return (
    <div className="grid gap-3">
      <p className="font-semibold">Załączniki do projektu</p>
      {images.map((image, index) => (
        <figure key={index} className="grid gap-2">
          <img
            src={image.src}
            alt={image.caption || image.name}
            className="max-h-56 max-w-full object-contain object-left"
          />
          <figcaption className="wrap-anywhere text-sm">{image.caption || image.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function EditProjectImages({
  images,
  onChange,
  onBusy,
}: {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function add(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || busy) return;
    setError("");
    if (files.length + images.length > MAX_PROJECT_IMAGES) {
      setError("Możesz dołączyć najwyżej dwa obrazy.");
      return;
    }
    if (
      files.some(
        (file) =>
          !PROJECT_IMAGE_TYPES.includes(file.type) ||
          file.size === 0 ||
          file.size > MAX_PROJECT_IMAGE_BYTES,
      )
    ) {
      setError("Wybierz PNG, JPG lub WebP do 250 KB na plik.");
      return;
    }
    setBusy(true);
    onBusy(true);
    try {
      const added = await Promise.all(
        files.map(async (file) => ({
          name: file.name.slice(0, 180),
          src: await readImage(file),
          caption: "",
        })),
      );
      onChange([...images, ...added]);
    } catch {
      setError("Nie udało się odczytać pliku. Spróbuj ponownie.");
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-2">
        Zdjęcia lub zrzuty ekranu (opcjonalnie)
        <Input
          type="file"
          accept={PROJECT_IMAGE_TYPES.join(",")}
          multiple
          disabled={busy || images.length >= MAX_PROJECT_IMAGES}
          onChange={(event) => void add(event)}
        />
      </label>
      <p className="application-help">
        Do 2 plików PNG, JPG lub WebP, do 250 KB każdy. Wybierz materiały bez danych poufnych.
      </p>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      {images.map((image, index) => (
        <div key={index} className="grid gap-2">
          <img
            src={image.src}
            alt={image.name}
            className="max-h-48 max-w-full object-contain object-left"
          />
          <label className="grid gap-2">
            Co pokazuje załącznik {index + 1}? (opcjonalnie)
            <Input
              maxLength={160}
              disabled={busy}
              value={image.caption}
              onChange={(event) =>
                onChange(
                  images.map((item, position) =>
                    position === index ? { ...item, caption: event.target.value } : item,
                  ),
                )
              }
            />
          </label>
          <Button
            type="button"
            className="justify-self-start"
            variant="outline"
            disabled={busy}
            onClick={() => onChange(images.filter((_, position) => position !== index))}
          >
            Usuń załącznik {index + 1}
          </Button>
        </div>
      ))}
    </div>
  );
}
