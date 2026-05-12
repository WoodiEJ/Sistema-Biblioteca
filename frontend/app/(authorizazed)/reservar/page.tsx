'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import { useData } from "@/context/dataContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";

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
        try {
            const result = await fetch('http://localhost:3000/reservar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify({ usuario_id: usuario?.id, livro_id: livroId })
            })

            const data = await result.json();

            if (result.ok) {
                toast.success("Livro reservado com sucesso!")
            } else {
                toast.error("Erro ao reservar.", {
                    description: data.mensagem
                })
            }
        } catch (erro) {
            toast.error("Erro de conexão.", {
                description: erro instanceof Error ? erro.message : "Erro desconhecido"
            })
        }
    }

    function confirmarReserva() {
        toast("Confirme a reserva.", {
            action:{ 
                label: "Confirmar.",
                onClick: () => reservarLivro()
            },
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
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
                    <Button className="w-full" onClick={confirmarReserva}>Reservar</Button>
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