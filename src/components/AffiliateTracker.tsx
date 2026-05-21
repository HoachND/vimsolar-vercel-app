"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function TrackerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // Call tracking API to log click and set cookie
      fetch(`/api/track?ref=${encodeURIComponent(ref)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(`[Affiliate] Referral tracked: ${ref}`);
            // Clean up the ?ref= from the URL for aesthetics
            const params = new URLSearchParams(window.location.search);
            params.delete("ref");
            const newSearch = params.toString();
            const newUrl = pathname + (newSearch ? `?${newSearch}` : "");
            router.replace(newUrl);
          }
        })
        .catch((err) => {
          console.error("[Affiliate] Tracking error:", err);
        });
    }
  }, [searchParams, router, pathname]);

  return null;
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
