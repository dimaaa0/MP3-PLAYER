import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
    try {
        // 1. Получаем данные от Stack Auth
        const event = await req.json();

        // В Stack Auth данные пользователя обычно лежат в event.data
        const { id, primary_email } = event.data;

        // 2. Подключаемся к Neon
        const sql = neon(process.env.DATABASE_URL!);

        // 3. Записываем в базу
        // Используем ON CONFLICT, чтобы не было ошибок, если юзер уже есть
        await sql`
      INSERT INTO user_profiles (user_id, username)
      VALUES (${id}, ${primary_email})
      ON CONFLICT (user_id) DO UPDATE 
      SET username = EXCLUDED.username;
    `;

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}