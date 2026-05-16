"use client";
import { I18nProvider } from "@/context/I18nContext";
import ROIAccessGate from "@/components/ROIAccessGate";

export default function TuVanPage() {
  return (
    <I18nProvider>
      <ROIAccessGate />
    </I18nProvider>
  );
}
