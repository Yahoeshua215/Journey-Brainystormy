import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey Builder",
  description: "Create and manage user journeys",
};

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="journey-layout h-screen overflow-hidden">
      {children}
    </div>
  );
} 