"use client";
import { I18nProvider } from "@/context/I18nContext";
import ROIConsultant from "@/components/ROIConsultant";

export default function TuVanPage() {
  return (
    <I18nProvider>
      <ROIConsultant />
    </I18nProvider>
  );
}
