import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillGap-AI | AI Career Skill Gap Analyzer",
  description:
    "Analyze your resume, identify skill gaps, and build a personalized career roadmap with SkillGap-AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}