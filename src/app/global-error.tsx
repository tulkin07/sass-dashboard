"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center font-sans">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-10 w-10 text-red-600" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">500</h1>
          <h2 className="mt-2 text-xl font-semibold">Server Error</h2>
          <p className="mt-2 text-gray-600">
            Something went wrong. Please try again.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
