"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Bell,
  Sparkles,
  MousePointerClick,
  Star,
  CheckCircle2,
  ArrowRight,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react"

const FEATURES = [
  {
    icon: Bell,
    title: "レビュー自動検知",
    desc: "Googleに新しいレビューが投稿されると即座に通知。見逃しゼロで対応スピードが上がります。",
    accent: "bg-orange-50 text-orange-600",
  },
  {
    icon: Sparkles,
    title: "AIが返信文を即生成",
    desc: "レビュー内容・評価・業種を読み取り、自然でパーソナライズされた返信文を数秒で生成します。",
    accent: "bg-amber-50 text-amber-600",
  },
  {
    icon: MousePointerClick,
    title: "ワンクリックで投稿",
    desc: "生成された返信を確認して「投稿」を押すだけ。編集も自由。対応時間が1件30秒になります。",
    accent: "bg-rose-50 text-rose-600",
  },
]

const STATS = [
  { label: "平均対応時間", before: "45分/日", after: "5分/日", icon: Clock },
  { label: "返信率", before: "42%", after: "98%", icon: TrendingUp },
  { label: "クレーム再発", before: "多い", after: "激減", icon: Shield },
]

const REVIEWS = [
  {
    name: "田中 恵子",
    role: "美容室オーナー・東京",
    stars: 5,
    text: "毎日レビュー対応に30〜40分かけていましたが、ReplyAIで5分以下になりました。文章のクオリティも上がって、お客様からも好評です。",
  },
  {
    name: "山本 大輔",
    role: "居酒屋オーナー・大阪",
    stars: 5,
    text: "低評価レビューへの返信が一番怖かったのですが、AIが絶妙な文章を作ってくれます。クレームが和らいだ感覚があります。",
  },
  {
    name: "佐藤 美穂",
    role: "ネイルサロン経営・名古屋",
    stars: 5,
    text: "導入から2週間でGoogleの評価が4.1→4.6に上がりました。返信率が上がると評価も上がるんですね。",
  },
]

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage("登録ありがとうございます！先行アクセスの案内をお送りします。")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "エラーが発生しました。もう一度お試しください。")
      }
    } catch {
      setStatus("error")
      setMessage("通信エラーが発生しました。")
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="border-b border-orange-100/60 bg-[#FAF8F5]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Reply<span className="text-orange-500">AI</span>
          </span>
          <a href="#waitlist">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5">
              早期登録
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI powered · 2026年最新</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 opacity-0-init animate-fade-up animate-delay-100"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Googleレビューに、
            <br />
            <span className="text-orange-500">もう悩まない。</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0-init animate-fade-up animate-delay-200">
            AIが新着レビューを自動検知し、パーソナライズされた返信文を数秒で生成。
            <br className="hidden md:block" />
            毎日のレビュー対応を
            <strong className="text-foreground font-medium">90%削減</strong>
            します。
          </p>

          {/* Email form */}
          <div id="waitlist" className="max-w-md mx-auto opacity-0-init animate-fade-up animate-delay-300">
            {status === "success" ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-6 py-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="メールアドレスを入力"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 rounded-xl border-orange-200 bg-white focus-visible:ring-orange-400"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium shrink-0"
                >
                  {status === "loading" ? "..." : "無料で先行登録"}
                  {status !== "loading" && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600 mt-2 text-left">{message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              クレジットカード不要 · 14日間無料トライアル · いつでもキャンセル可
            </p>
          </div>
        </div>
      </section>

      {/* Pain point */}
      <section className="bg-white py-20 px-4 border-y border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4">
            こんな悩みはありませんか？
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold leading-snug mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            毎日10件以上のレビュー対応に
            <br />
            <span className="text-orange-500">1〜2時間</span>かかっていませんか？
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            返信を放置すると評価が下がり、丁寧に返信しようとすれば時間が奪われる。
            低評価レビューへの文章は特に神経を使います。
            ReplyAIは、そのストレスをまるごと引き受けます。
          </p>

          {/* Before/After stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#FAF8F5] rounded-2xl p-6 text-left border border-orange-100">
                <s.icon className="w-5 h-5 text-orange-400 mb-3" />
                <p className="text-xs text-muted-foreground mb-2 font-medium">{s.label}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm line-through text-muted-foreground">{s.before}</span>
                  <ArrowRight className="w-3 h-3 text-orange-400" />
                  <span className="text-lg font-bold text-orange-600">{s.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
              機能
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              3ステップで完結する
              <br />
              レビュー対応フロー
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Card key={f.title} className="border-orange-100 bg-white hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${f.accent}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground mb-2">STEP {i + 1}</div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 px-4 border-y border-orange-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
              お客様の声
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              全国の店舗オーナーに
              <br />
              使われています
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <Card key={r.name} className="border-orange-100 bg-[#FAF8F5]">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-4">{r.text}</p>
                  <div className="border-t border-orange-100 pt-4">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            料金
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-10"
            style={{ fontFamily: "var(--font-display)" }}
          >
            シンプルな
            <br />
            1プラン制
          </h2>

          <Card className="border-orange-200 bg-white shadow-lg shadow-orange-100/50">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6">
                <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  ¥100
                </span>
                <span className="text-muted-foreground text-sm ml-2">/ 月（税込）</span>
              </div>

              <ul className="text-left space-y-3 mb-8">
                {[
                  "Googleレビュー 無制限自動検知",
                  "AI返信文生成 無制限",
                  "LINE / メール通知",
                  "複数店舗対応（3店舗まで）",
                  "14日間無料トライアル",
                  "いつでも解約可能",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a href="#waitlist">
                <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-base font-medium">
                  14日間無料で始める
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-3">
                クレジットカード不要で登録できます
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-500 py-20 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            今すぐ先行登録して、
            <br />
            レビュー対応から解放されましょう
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            先行登録者には初月50%割引（¥50）でご提供します。
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 rounded-xl bg-white/10 border-white/30 text-white placeholder:text-orange-200 focus-visible:ring-white"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-12 px-5 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-medium shrink-0"
            >
              {status === "loading" ? "..." : "登録する"}
            </Button>
          </form>
          {status === "success" && (
            <p className="text-orange-100 text-sm mt-3">{message}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] border-t border-orange-100 py-8 px-4 text-center">
        <p
          className="text-lg font-bold mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Reply<span className="text-orange-500">AI</span>
        </p>
        <p className="text-xs text-muted-foreground">
          © 2026 ReplyAI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
