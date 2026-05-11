'use client'

import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

interface Props {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: Props) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
            <div className="bg-red-50 p-6 rounded-full">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900">Algo deu errado</h2>
                <p className="text-zinc-500 text-sm max-w-sm">
                    Ocorreu um erro ao processar sua solicitação: <br/>
                    <span className="italic text-red-400">"{error.message}"</span>
                </p>
            </div>
            <button
                onClick={reset}
                className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
                <RefreshCcw className="h-4 w-4" />
                Tentar Novamente
            </button>
        </div>
    )
}