import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useData } from "@/context/dataContext"

interface Categoria {
    id: number
    nome: string
}

function AcoesCategoriaCell({ categoria }: { categoria: Categoria }) {
    const { usuario } = useAuth()
    const {recarregar} = useData() 

    async function deletar() {
        try {
            const result = await fetch(`http://localhost:3000/categorias/${categoria.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })
            
            const data = await result.json()

            if (result.ok) {
                toast.success("Categoria deletado com sucesso.")
                recarregar()
            } else {
                toast.error("Erro ao excluir", {
                    description: data.mensagem
                })
            }
        } catch (erro) {
            toast.error("Erro ao excluir.", {
                description: `${erro}`
            })
        }
    }

    function confirmarExcluir() {
        toast.warning("Deseja mesmo excluir?", {
            description: "Excluindo a categoria, você terá que excluir todos os livros relacionados a ele.",
            action: {
                label: "Confirmar",
                onClick: () => deletar()
            }, 
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
        })
    }

    if (usuario?.role !== 'ADMIN') return null

    return (
        <div className="flex gap-2">
            <Link href={`/categorias/${categoria.id}/editar`}>
                <Button size="sm" variant="outline"><Pencil /></Button>
            </Link>
            <Button size="sm" variant="destructive" onClick={confirmarExcluir}><Trash /></Button>
        </div>
    )
}

export function getCategoriaColumns(role: string | undefined): ColumnDef<Categoria>[] {
    const columns: ColumnDef<Categoria>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "nome", header: "Nome" },
    ]

    if (role === 'ADMIN') {
        columns.push({ id: "acoes", header: "Ações", cell: ({ row }) => <AcoesCategoriaCell categoria={row.original} /> })
    }

    return columns
}