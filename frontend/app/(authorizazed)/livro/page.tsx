'use client'
import { columns } from "@/components/colunas"
import { DataTable } from "@/components/dataTable"
import { Button } from "@/components/ui/button"
import { useData } from "@/context/dataContext"
import { useAuth } from "@/context/authContext"
import Link from "next/link"

export default function Livro() {
    const { livros } = useData()
    const { usuario } = useAuth()

    return (
        <div className="p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Livros</h2>
                {usuario?.role === 'ADMIN' && (
                    <Link href="/livro/cadastrar">
                        <Button>Cadastrar Livro</Button>
                    </Link>
                )}
            </div>
            <DataTable columns={columns} data={livros} />
        </div>
    )
}