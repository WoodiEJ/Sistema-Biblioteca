'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/authContext"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { useData } from "@/context/dataContext"

export default function EditarCategoria() {
    const [nome, setNome] = useState('')
    const { usuario } = useAuth()
    const router = useRouter()
    const params = useParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const {recarregar} = useData()

    useEffect(() => {
        async function buscarCategoria() {
            const res = await fetch(`http://localhost:3000/categorias/${id}`, {
                headers: { 'Authorization': `Bearer ${usuario?.token}` }
            })
            const data = await res.json()
            setNome(data.nome)
        }

        if (usuario?.token) buscarCategoria()
    }, [id, usuario])

    async function atualizar() {
        try {
            const result = await fetch(`http://localhost:3000/categorias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify({ nome })
            })

            const dados = await result.json()
            
            if (result.ok) {
                toast.success("Categoria atualizado com sucesso.")
                recarregar()
            } else {
                toast.error("Erro ao atualizar.", {
                    description: `${dados.mensagem}`
                })
            }
        } catch (erro) {
            toast.error("Erro de conexão.", {
                description: erro instanceof Error ? erro.message : "Erro desconhecido"
            })
        }
    }

    function confirmarAtualizacao() {
        if (nome.length < 0) return toast.warning("Digite um nome por favor.")

        toast("Deseja mesmo atualizar?", {
            action: {
                label: "Confirmar",
                onClick: () => atualizar()
            },
            cancel: {
                label: "Cancelar",
                onClick: () => { }
            }
        })
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Editar Categoria</CardTitle>
                    <CardDescription>Atualize o nome da categoria</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Nome</Label>
                        <Input value={nome} placeholder="Nome da categoria" onChange={(e) => setNome(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={confirmarAtualizacao}>Atualizar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}