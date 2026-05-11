'use client'
import { DataTable } from "@/components/dataTable"
import { usuariosColumns } from "@/components/columnsUsuarios"
import { useData } from "@/context/dataContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GerenciarUsuarios() {
    const { usuarios } = useData()

    return (
        <div className="p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Usuários</h2>
                <Link href="/usuarios/cadastrar">
                    <Button>Novo Usuário</Button>
                </Link>
            </div>
            <DataTable columns={usuariosColumns} data={usuarios} />
        </div>
    )
}