"use client";
import { I18nProvider } from "@/context/I18nContext";
import BlogList from "@/components/BlogList";

export default function BlogPage() {
  return (
    <I18nProvider>
      <BlogList />
    </I18nProvider>
  );
}
