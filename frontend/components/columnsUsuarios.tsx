import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useData } from "@/context/dataContext"

interface Usuario {
    id: number
    nome: string
    email: string
    role: string
}

function AcoesUsuarioCell({ usuario: u }: { usuario: Usuario }) {
    const { usuario } = useAuth()
    const {recarregar} = useData() 

    async function excluir() {
        try {
            const result = await fetch(`http://localhost:3000/usuarios/${u.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })

            const data = await result.json()

            if (result.ok) {
                toast.success("Excluido com sucesso.")
                recarregar()
            } else {
                toast.error("Erro ao excluir.", {
                    description: data.mensagem
                })
            }
        } catch (erro) {
            toast.error("Erro de conexão.")
        }
    }

    function confirmarExcluir() {
        toast.warning("Deseja excluir?", {
            action: {
                label: "Confirmar",
                onClick: () => excluir()
            }, 
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
        })
    }

    return (
        <div className="flex gap-2">
            <Link href={`/usuarios/${u.id}/editar`}>
                <Button size="sm" variant="outline"><Pencil /></Button>
            </Link>
            <Button size="sm" variant="destructive" onClick={confirmarExcluir}><Trash /></Button>
        </div>
    )
}

export const usuariosColumns: ColumnDef<Usuario>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { id: "acoes", header: "Ações", cell: ({ row }) => <AcoesUsuarioCell usuario={row.original} /> }
]