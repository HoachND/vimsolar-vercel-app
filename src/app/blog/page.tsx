"use client";
import { Suspense } from "react";
import { I18nProvider } from "@/context/I18nContext";
import BlogList from "@/components/BlogList";

export default function BlogPage() {
  return (
    <I18nProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      }>
        <BlogList />
      </Suspense>
    </I18nProvider>
  );
}

