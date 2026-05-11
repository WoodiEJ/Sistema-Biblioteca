'use client'

import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" />
            <p className="text-zinc-400 text-sm font-medium animate-pulse">
                Carregando dados da biblioteca...
            </p>
        </div>
    )
}