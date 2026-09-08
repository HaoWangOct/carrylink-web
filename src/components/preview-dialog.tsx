"use client";

import { useEffect, useRef } from "react";
import { cities } from "@/content/geography";
import { formatDate, type Trip } from "@/content/sample-trips";
import { useLanguage } from "./language-provider";
import { Button } from "./ui/button";
import { TravelerIdentity } from "./home/trip-card";

export type Preview =
  | { kind: "traveler" | "account" | "safety" }
  | { kind: "trip"; trip: Trip }
  | { kind: "information"; title: string };

export function PreviewDialog({
  preview,
  onClose,
}: {
  preview: Preview | null;
  onClose: () => void;
}) {
  const { lang, t, ui } = useLanguage();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!preview) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [preview]);
  if (!preview) return null;
  const title =
    preview.kind === "traveler"
      ? ui.travelerTitle
      : preview.kind === "account"
        ? ui.accountTitle
        : preview.kind === "safety"
          ? ui.safetyTitle
          : preview.kind === "information"
            ? preview.title
            : ui.requestTitle;
  const body =
    preview.kind === "traveler"
      ? ui.travelerBody
      : preview.kind === "account"
        ? ui.accountBody
        : preview.kind === "safety"
          ? ui.safetyBody
          : preview.kind === "information"
            ? ui.unavailable
            : ui.requestBody;
  return (
    <dialog
      ref={ref}
      aria-labelledby="preview-title"
      aria-describedby="preview-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const box = ref.current.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            onClose();
        }
      }}
      className="max-h-[85dvh] w-[calc(100%-32px)] max-w-lg overflow-y-auto rounded-3xl border border-line bg-white p-6 text-ink shadow-xl sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="eyebrow mb-0">{ui.preview}</p>
        <button
          onClick={onClose}
          aria-label={ui.close}
          className="flex size-11 items-center justify-center rounded-xl bg-surface text-2xl"
        >
          ×
        </button>
      </div>
      <h2
        id="preview-title"
        className="mb-4 text-3xl leading-tight font-black tracking-[-1px]"
      >
        {title}
      </h2>
      <p
        id="preview-description"
        className="mb-6 text-sm leading-relaxed text-body"
      >
        {body}
      </p>
      {preview.kind === "trip" && (
        <div className="card mb-6 p-5">
          <TravelerIdentity trip={preview.trip} />
          <p className="mt-4 font-bold">
            {cities[preview.trip.from][lang]} → {cities[preview.trip.to][lang]}
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              {
                label: t.home.matchFields.date,
                value: formatDate(preview.trip.date, lang),
              },
              {
                label: t.home.matchFields.capacity,
                value: `${preview.trip.capacity} kg`,
              },
              {
                label: t.home.tripFields.from,
                value: `€${preview.trip.price}/kg`,
              },
            ].map((field) => (
              <div key={field.label}>
                <dt className="text-xs text-muted">{field.label}</dt>
                <dd className="text-sm font-semibold">{field.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-body">
            ⭐ {preview.trip.rating} · {preview.trip.trips} {ui.completed}
          </p>
          <p className="mt-4 text-xs text-muted">{ui.status}</p>
        </div>
      )}
      <Button className="w-full" onClick={onClose}>
        {ui.close}
      </Button>
    </dialog>
  );
}
