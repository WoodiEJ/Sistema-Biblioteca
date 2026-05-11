'use client'

import * as React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useAuth } from "@/context/authContext"
import { Button } from "./ui/button"
import Link from "next/link"

interface Livro {
    id: number
    titulo: string
    descricao: string
    autor: string
    preco: number
    quantidade: number
    categoria: {
        id: number
        nome: string
    }
}

export function CarouselComponent() {
    const [livros, setLivros] = React.useState<Livro[]>([])
    const { usuario } = useAuth()

    React.useEffect(() => {
        async function buscarLivros() {
            const res = await fetch('http://localhost:3000/livro/popular', {
                headers: {
                    'Authorization': `Bearer ${usuario?.token}`
                }
            })
            const data = await res.json()
            setLivros(Array.isArray(data) ? data : [])
        }
        buscarLivros()
    }, [])

    return (
        <div className="px-8">
            <Carousel className="w-full max-w-4xl">
                <CarouselContent>
                    {livros.map((livro) => (
                        <CarouselItem className="basis-1/3" key={livro.id}>
                            <div className="p-2 h-full">
                                <Card className="h-full flex flex-col min-h-64">
                                    <CardHeader>
                                        <CardTitle>
                                            <h1 className="font-bold">{livro.titulo}</h1>
                                        </CardTitle>
                                        <CardDescription>
                                            <p>{livro.autor} - {livro.categoria.nome}</p>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 h-16 overflow-hidden">
                                        <h4 className="line-clamp-2">{livro.descricao}</h4>
                                    </CardContent>
                                    <CardFooter className="flex gap-2">
                                        <Link
                                            href={`/reservar/${livro.id}`}
                                            className="flex-1"
                                        >
                                            <Button className="w-full">Reservar</Button>
                                        </Link>
                                        <Link
                                            href={`/livro/${livro.id}`}
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full">Mais detalhes</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}
