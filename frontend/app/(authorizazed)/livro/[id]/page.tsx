'use client'
import { useParams } from "next/navigation"
import { useData } from "@/context/dataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/context/authContext"

export default function DetalhesLivro() {
    const { id } = useParams()
    const { livros } = useData()
    const { usuario } = useAuth()

    const livro = livros.find(l => l.id === Number(id))

    if (!livro) return <p className="p-8 text-muted-foreground">Livro não encontrado.</p>

    return (
        <div className="p-8 max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{livro.titulo}</CardTitle>
                    <CardDescription>{livro.autor} — {livro.categoria.nome}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p>{livro.descricao}</p>
                    <p className="text-sm text-muted-foreground">Cópias disponíveis: {livro.quantidade}</p>
                    <p className="text-sm text-muted-foreground">Preço: R$ {livro.preco.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                        <Link href={`/reservar?livroId=${livro.id}`}>
                            <Button>Reservar</Button>
                        </Link>
                        {usuario?.role === 'ADMIN' && (
                            <Link href={`/livro/${livro.id}/editar`}>
                                <Button variant="outline">Editar</Button>
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}