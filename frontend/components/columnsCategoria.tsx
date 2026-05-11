import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Categoria {
    id: number
    nome: string
}

function AcoesCategoriaCell({ categoria }: { categoria: Categoria }) {
    const { usuario } = useAuth()
    const router = useRouter()

    async function deletar() {
        try {
            const result = await fetch(`http://localhost:3000/categorias/${categoria.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })
            
            if (result.ok) {
                toast.dismiss()
                toast.success("Categoria deletado com sucesso.")
                router.refresh()
            } else {
                toast.error("Erro ao excluir")
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