import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()

    const result = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    })

    const data = await result.json()

    if (!result.ok) {
        return NextResponse.json({mensagem: data.mensagem}, {status: result.status})
    }
    
    const [, payload] = data.token.split(".")
    const decoded = JSON.parse(atob(payload)) as {id: number, role: string}
    const response = NextResponse.json({id: decoded.id, role: decoded.role})

    response.cookies.set("token", data.token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8
    })
    
    return response
}