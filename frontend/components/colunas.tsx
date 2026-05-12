import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Button } from "./ui/button"
import { BookCheck, Pencil, Trash } from "lucide-react"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useData } from "@/context/dataContext"

interface Livro {
    id: number
    titulo: string
    autor: string
    preco: number
    categoria: { id: number, nome: string }
}

function AcoesCell({ livro }: { livro: Livro }) {
    const { usuario } = useAuth()
    const {recarregar} = useData() 

    async function deletar() {
        try {
            const result = await fetch(`http://localhost:3000/livro/${livro.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })

            const data = await result.json()

            if (result.ok) {
                toast.success("Livro Excluido com sucesso.")
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

    function confirmarDeletar() {
        toast.warning("Deseja mesmo excluir o livro?", {
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

    return (
        <div className="flex gap-2">
            <Link href={`/livro/${livro.id}`}>
                <Button variant="outline" size="sm">Detalhes</Button>
            </Link>
            <Link href={`/reservar?livroId=${livro.id}`}>
                <Button size="sm"><BookCheck /></Button>
            </Link>
            {usuario?.role === 'ADMIN' && (
                <>
                    <Link href={`/livro/${livro.id}/editar`}>
                        <Button size="sm" variant="outline"><Pencil /></Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={confirmarDeletar}><Trash /></Button>
                </>
            )}
        </div>
    )
}

export const columns: ColumnDef<Livro>[] = [
    { accessorKey: "titulo", header: "Título" },
    { accessorKey: "autor", header: "Autor" },
    { accessorKey: "categoria", header: "Gênero", cell: ({ row }) => row.original.categoria.nome },
    { accessorKey: "preco", header: "Preço" },
    { id: "acoes", header: "Ações", cell: ({ row }) => <AcoesCell livro={row.original} /> }
]