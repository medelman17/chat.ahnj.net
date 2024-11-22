import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MuniCode Chat",
  description: "AI-powered chatbot for municipal code inquiries",
};

function ApiKeyWarning() {
  if (process.env.OPENAI_API_KEY) return null;

  return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Configuration Error</AlertTitle>
      <AlertDescription>
        The OPENAI_API_KEY environment variable is missing. The chatbot will not function correctly. Please set the API
        key in your environment variables.
      </AlertDescription>
    </Alert>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ErrorBoundary>
          <Navbar />
          <ApiKeyWarning />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
