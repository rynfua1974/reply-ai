import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { review, industry, stars } = await req.json()

  if (!review?.trim()) {
    return NextResponse.json({ error: "レビュー文を入力してください。" }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "APIキーが設定されていません。" }, { status: 500 })
  }

  const starLabel = ["", "非常に低い評価", "低い評価", "普通の評価", "高い評価", "最高評価"][stars] || "普通の評価"

  const prompt = `あなたは${industry}の店舗オーナーです。以下のGoogleレビューに対する返信文を作成してください。

【レビュー評価】${stars}点（${starLabel}）
【レビュー内容】
${review}

【返信文の要件】
- 150〜250文字程度
- 丁寧で誠実なトーン
- ${stars <= 2 ? "謝罪と改善への意欲を示す。防衛的にならない。" : "感謝を伝え、また来店を促す。"}
- 業種（${industry}）に合った自然な言葉遣い
- 署名は不要
- 返信文のみを出力し、説明や前置きは一切不要

返信文:`

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error("Claude APIエラー")
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text?.trim()

    if (!reply) throw new Error("返信文の生成に失敗しました。")

    return NextResponse.json({ reply })
  } catch (e) {
    console.error("[generate-reply]", e)
    return NextResponse.json(
      { error: "返信文の生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    )
  }
}
