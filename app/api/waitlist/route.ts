import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "有効なメールアドレスを入力してください。" }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Supabaseが未設定の場合はモックレスポンス（開発時用）
  if (!supabaseUrl || !supabaseKey) {
    console.log("[waitlist] Supabase not configured, mock success for:", email)
    return NextResponse.json({ success: true })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { error } = await supabase
    .from("waitlist")
    .insert({ email })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "すでに登録済みのメールアドレスです。" }, { status: 409 })
    }
    console.error("[waitlist] Supabase error:", error)
    return NextResponse.json({ error: "登録に失敗しました。もう一度お試しください。" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
