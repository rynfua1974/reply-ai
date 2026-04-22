import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    verification: {
    google: "zdVa_vDEhUVfRvUdYL92A54w-4AGBaA6FPP8MKKoIYA",
  },
  title: "ReplyAI — Googleレビューに、もう悩まない。",
  description: "AIが店舗のGoogleレビューを自動検知し、パーソナライズされた返信文を即生成。月額2,980円で始める、飲食店・美容室オーナーのための返信自動化ツール。",
  openGraph: {
    title: "ReplyAI — Googleレビューに、もう悩まない。",
    description: "AIが返信文を即生成。毎日のレビュー対応を90%削減。",
    locale: "ja_JP",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
