'use client'
import { getCategoriaColumns } from "@/components/columnsCategoria"
import { DataTable } from "@/components/dataTable"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { useData } from "@/context/dataContext"
import Link from "next/link"

export default function Categorias() {
    const {categorias} = useData()
    const {usuario} = useAuth()
    const colunas = getCategoriaColumns(usuario?.role)

    return (
        <div className="p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Categorias</h2>
                <Link href="/categorias/cadastrar">
                    <Button>Nova Categoria</Button>
                </Link>
            </div>
            <DataTable columns={colunas} data={categorias} />
        </div>
    )
}