import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Googleレビュー返信文 自動生成ツール【無料】| ReplyAI",
  description: "Googleビジネスプロフィールのレビューに対する返信文をAIが無料で自動生成。飲食店・美容室・小売店など業種別対応。低評価レビューの返信文もワンクリックで作成。",
  keywords: [
    "Googleレビュー 返信文",
    "レビュー 返信 自動生成",
    "Googleビジネスプロフィール 返信",
    "レビュー 返信 例文",
    "低評価レビュー 返信",
    "口コミ 返信文 作成",
  ],
  openGraph: {
    title: "Googleレビュー返信文 自動生成ツール【無料】",
    description: "AIがレビューを分析して自然な返信文を即生成。飲食店・美容室など業種別に最適化。",
    locale: "ja_JP",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
