'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { useData } from "@/context/dataContext";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function ReservarContent() {
    const [livro, setLivro] = useState('')
    const { livros } = useData()
    const { usuario } = useAuth()
    const [livroId, setLivroId] = useState<number | null>(null)
    const [mostrarSugestao, setMostrarSugestao] = useState(false)
    const procurarParametro = useSearchParams()
    const livroIdParam = procurarParametro.get('livroId')

    const sugestoes = livros.filter(
        l => l.titulo.toLowerCase().includes(livro.toLowerCase()) && livro.length > 0
    )

    useEffect(() => {
        if (livroIdParam) {
            const l = livros.find(l => l.id === Number(livroIdParam))
            if (l) {
                setLivro(l.titulo)
                setLivroId(l.id)
            }
        }
    }, [livroIdParam, livros])

    async function reservarLivro() {
        await fetch('http://localhost:3000/reservar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuario?.token}`
            },
            body: JSON.stringify({ usuario_id: usuario?.id, livro_id: livroId })
        })
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Reservar Livro</CardTitle>
                    <CardDescription>Digite o nome do livro que deseja reservar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Input
                            value={livro}
                            onChange={(e) => { setLivro(e.target.value); setLivroId(null); setMostrarSugestao(true) }}
                            placeholder="Digite o nome do livro"
                        />
                        {mostrarSugestao && sugestoes.length > 0 && (
                            <div className="absolute z-10 w-full border rounded-md bg-background shadow-md mt-1">
                                {sugestoes.map(l => (
                                    <div
                                        key={l.id}
                                        className="p-2 hover:bg-muted cursor-pointer text-sm"
                                        onClick={() => { setLivro(l.titulo); setLivroId(l.id); setMostrarSugestao(false) }}
                                    >
                                        {l.titulo}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={reservarLivro}>Reservar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function Reservar() {
    return (
        <Suspense>
            <ReservarContent />
        </Suspense>
    )
}