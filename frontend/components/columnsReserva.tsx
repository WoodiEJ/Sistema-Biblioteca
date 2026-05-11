import { useAuth } from "@/context/authContext"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { CheckCircle2, Trash } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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

function AcoesReservaCell({ emprestimo }: { emprestimo: Emprestimo }) {
    const { usuario } = useAuth()
    const router = useRouter()

    if (usuario?.role !== 'ADMIN') return null
    async function excluir() {
        try {
            const result = await fetch(`http://localhost:3000/gerenciar/${emprestimo.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })

            if (result.ok) {
                toast.success("Reserva exluido com sucesso.")
                router.refresh()
            } else {
                toast.error("Erro ao excluir.", {
                    description: `${result.json()}`
                })
            }
        } catch (erro) {
            toast.error("Erro de conexão.")
        }
    }

    async function marcarDevolvido() {
        try {
            const result = await fetch(`http://localhost:3000/livro/${emprestimo.id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })

            const data = await result.json()

            if (result.ok) {
                toast.success("Devolvido com sucesso.")
                router.refresh()
            } else {
                toast.error("Erro ao devolver.", {
                    description: data.mensagem
                })
            }
        } catch (erro) {
            alert(erro)
        }
    }

    function confirmarExcluir() {
        toast("Deseja mesmo excluir?", {
            action: {
                label: "Confirmar",
                onClick: () => excluir()
            },
            cancel: {
                label: "Cancelar",
                onClick: () => { }
            }
        })
    }

    function confirmarDevolucao() {
        toast("Deseja mesmo marcar como devolvido?", {
            action: {
                label: "Confirmar",
                onClick: () => marcarDevolvido()
            },
            cancel: {
                label: "Cancelar",
                onClick: () => { }
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="destructive"
                onClick={confirmarExcluir}
                title="Excluir Reserva"
            >
                <Trash className="h-4 w-4" />
            </Button>

            {emprestimo.ativo && (
                <Button
                    size="sm"
                    variant="outline"
                    className="flex gap-2 items-center border-green-600 text-green-600 hover:bg-green-50"
                    onClick={confirmarDevolucao}
                >
                    <CheckCircle2 className="h-4 w-4" />
                    Devolver
                </Button>
            )}
        </div>
    )
}

export const reservasColumns: ColumnDef<Emprestimo>[] = [
    { accessorKey: "livro", header: "Livro", cell: ({ row }) => row.original.livro.titulo },
    { accessorKey: "ativo", header: "Ativo", cell: ({ row }) => row.original.ativo ? "Sim" : "Não" },
    { accessorKey: "data_comeco", header: "Início", cell: ({ row }) => new Date(row.original.data_comeco).toLocaleDateString('pt-BR') },
    { accessorKey: "data_fim", header: "Devolução", cell: ({ row }) => new Date(row.original.data_fim).toLocaleDateString('pt-BR') },
    { accessorKey: "volta", header: "Devolvido em", cell: ({ row }) => row.original.volta ? new Date(row.original.volta).toLocaleDateString('pt-BR') : "Pendente" },
    { 
        id: "acoes", 
        header: () => {
            const { usuario } = useAuth()
            return usuario?.role === 'ADMIN' ? "Ações" : null
        },
        cell: ({ row }) => <AcoesReservaCell emprestimo={row.original} /> 
    }
]