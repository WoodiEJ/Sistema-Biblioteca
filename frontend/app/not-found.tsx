import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
            <div className="bg-zinc-100 p-6 rounded-full">
                <FileQuestion className="h-12 w-12 text-zinc-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900">Página não encontrada</h2>
                <p className="text-zinc-500 text-sm max-w-xs">
                    A página que você está procurando não existe ou foi movida.
                </p>
            </div>
            <Link
                href="/"
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
                Voltar para o Início
            </Link>
        </div>
    )
}