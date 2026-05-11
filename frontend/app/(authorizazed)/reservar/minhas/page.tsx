'use client'

import { reservasColumns } from "@/components/columnsReserva"
import { DataTable } from "@/components/dataTable"
import { useAuth } from "@/context/authContext"
import { useEffect, useState } from "react"

interface Emprestimo {
    id: number
    usuario_id: number
    livro_id: number
    ativo: boolean
    data_comeco: string
    data_fim: string
    volta: string | null
    livro: { id: number, titulo: string }
}

export default function MinhasReservas() {
    const { usuario } = useAuth()
    const [reservas, setReservas] = useState<Emprestimo[]>([])

    useEffect(() => {
        async function buscarLivros() {
            const res = await fetch('http://localhost:3000/reservar/minhas', {
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })
            const data = await res.json()
            setReservas(Array.isArray(data) ? data : [])
        }
        if (usuario?.token) buscarLivros()
    }, [usuario])

    return (
        <div className="p-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Minhas Reservas</h2>
            {reservas.length === 0 ? (
                <p className="text-muted-foreground">Você não tem reservas ativas.</p>
            ) : (
                <DataTable columns={reservasColumns} data={reservas} />
            )}
        </div>
    )
}