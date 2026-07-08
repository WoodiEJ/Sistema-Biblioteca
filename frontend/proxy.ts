import { NextRequest, NextResponse } from "next/server"

function parseJwtPayload(token: string): {id: number, role: string} | null {
    try {
        const [, payload] = token.split(".")
        return JSON.parse(atob(payload)) as {id: number, role: string}
    } catch {
        return null
    }
}

export function proxy(req: NextRequest, res: NextResponse) {
    const {pathname} = req.nextUrl
    const token = req.cookies.get("token")?.value

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    const payload = parseJwtPayload(token)

    if (!payload) {
        const response = NextResponse.redirect(new URL("/", req.url))
        res.cookies.delete("token")
        return response
    }

    const rotasAdmin = ["/gerenciar", "/usuario", "/categorias"]
    const adminPath = rotasAdmin.some((p) => pathname.startsWith(p))

    if (rotasAdmin && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/gerenciar/:path*",
        "/usuarios/:path*",
        "/categorias/:path*",
        "/livro/:path*",
        "/reservar/:path*",
        "/pdf/:path*"
    ]
}