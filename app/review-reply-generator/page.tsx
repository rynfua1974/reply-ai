"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Copy, Check, Star, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"

const INDUSTRIES = [
  "飲食店・カフェ",
  "美容室・サロン",
  "小売店",
  "ホテル・旅館",
  "医療・歯科",
  "フィットネス・スポーツ",
  "その他",
]

const FREE_LIMIT = 3
const STORAGE_KEY = "reply_ai_free_count"

function getUsageCount(): number {
  if (typeof window === "undefined") return 0
  const today = new Date().toDateString()
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return 0
  try {
    const { date, count } = JSON.parse(stored)
    if (date !== today) return 0
    return count
  } catch {
    return 0
  }
}

function incrementUsageCount(): number {
  const today = new Date().toDateString()
  const current = getUsageCount()
  const newCount = current + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }))
  return newCount
}

export default function ReviewReplyGenerator() {
  const [review, setReview] = useState("")
  const [industry, setIndustry] = useState(INDUSTRIES[0])
  const [stars, setStars] = useState(3)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)

  async function handleGenerate() {
    const count = getUsageCount()
    if (count >= FREE_LIMIT) {
      setLimitReached(true)
      return
    }
    if (!review.trim()) {
      setError("レビュー文を入力してください。")
      return
    }
    setError("")
    setLoading(true)
    setResult("")

    try {
      const res = await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, industry, stars }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "エラーが発生しました")
      setResult(data.reply)
      const newCount = incrementUsageCount()
      setUsageCount(newCount)
      if (newCount >= FREE_LIMIT) setLimitReached(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "エラーが発生しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="border-b border-orange-100/60 bg-[#FAF8F5]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Reply<span className="text-orange-500">AI</span>
            </span>
          </Link>
          <Link href="/#waitlist">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5">
              無料で始める
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* AdSense 上部 */}
        <div className="w-full h-24 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm mb-10">
          広告スペース（AdSense）
        </div>

        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-sm px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI powered · 無料ツール</span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Googleレビュー
            <span className="text-orange-500">返信文</span>
            自動生成ツール
          </h1>
          <p className="text-muted-foreground text-lg">
            レビューを貼り付けるだけで、AIが自然な返信文を即生成。
            <br className="hidden md:block" />
            飲食店・美容室・小売店など業種別に最適化。完全無料（1日3回）。
          </p>
        </div>

        {/* メインカード */}
        <Card className="border-orange-100 bg-white shadow-sm mb-6">
          <CardContent className="pt-6 space-y-5">

            {/* 評価 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                レビューの評価
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStars(s)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        s <= stars
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-muted-foreground self-center ml-2">
                  {stars === 1 && "★1 — 低評価"}
                  {stars === 2 && "★2 — やや低評価"}
                  {stars === 3 && "★3 — 普通"}
                  {stars === 4 && "★4 — 高評価"}
                  {stars === 5 && "★5 — 最高評価"}
                </span>
              </div>
            </div>

            {/* 業種 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                業種
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* レビュー入力 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                レビュー文
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="例：料理はおいしかったのですが、店員さんの対応が少し残念でした。混んでいたのはわかりますが、もう少し笑顔で接客してほしかったです。"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                実際のGoogleレビューをそのままコピー＆ペーストしてください
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* 利用回数 */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                本日の残り回数：<span className="font-medium text-foreground">{Math.max(0, FREE_LIMIT - usageCount)}回 / {FREE_LIMIT}回</span>
              </p>
              {!limitReached && (
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      生成中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      返信文を生成
                    </span>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 結果表示 */}
        {result && (
          <Card className="border-orange-200 bg-orange-50 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-orange-800">生成された返信文</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-orange-700 hover:text-orange-900 border border-orange-300 bg-white rounded-lg px-3 py-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "コピーしました" : "コピー"}
                </button>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{result}</p>
            </CardContent>
          </Card>
        )}

        {/* 上限到達 → 有料誘導 */}
        {limitReached && (
          <Card className="border-orange-300 bg-white shadow-md mb-6">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                本日の無料回数（3回）を使い切りました
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                月額プランなら返信文生成が<strong className="text-foreground">無制限</strong>に。
                <br />
                レビュー自動検知・通知機能もセットで使えます。
              </p>
              <Link href="/#waitlist">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-11">
                  無料トライアルを始める
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                14日間無料 · クレジットカード不要
              </p>
            </CardContent>
          </Card>
        )}

        {/* AdSense 下部 */}
        <div className="w-full h-24 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm mb-10">
          広告スペース（AdSense）
        </div>

        {/* SEO用説明文 */}
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 border-t border-orange-100 pt-8">
          <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Googleレビュー返信文ジェネレーターの使い方
          </h2>
          <p>
            このツールは、Googleビジネスプロフィールに投稿されたレビューに対する返信文をAIが自動生成します。
            星の数（評価）・業種・レビュー文を入力するだけで、自然でプロフェッショナルな返信文を数秒で作成できます。
          </p>
          <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            低評価レビューへの返信もAIにお任せ
          </h2>
          <p>
            星1〜2の低評価レビューへの返信は、対応を誤るとさらに評判を下げるリスクがあります。
            ReplyAIは低評価レビューの内容を分析し、誠実で状況を改善する返信文を生成します。
          </p>
          <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            飲食店・美容室・小売店など業種別に最適化
          </h2>
          <p>
            業種によって適切な返信のトーンや内容は異なります。
            飲食店なら「またのご来店をお待ちしております」、美容室なら「次回のご予約をお待ちしております」など、
            業種に合わせた自然な文章を生成します。
          </p>
        </div>
      </div>
    </div>
  )
}
