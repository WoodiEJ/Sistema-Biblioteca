'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CadastrarCategoria() {
    const [nome, setNome] = useState('')
    const { usuario } = useAuth()
    const router = useRouter()

    async function cadastrar() {
        try {
            const response = await fetch('http://localhost:3000/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify({ nome })
            })

            if (response.ok) {
                toast.success("Categoria cadastrada com sucesso!")
                router.push('/categorias')
            } else {
                toast.error("Erro ao cadastrar.")
            }
        } catch (error) {
            toast.error("Erro de conexão.")
        }
    }

    function confirmarCadastro() {
        if (!nome) return toast.warning("Digite um nome antes de cadastrar.")

        toast("Deseja mesmo cadastrar?", {
            action: {
                label: "Confirmar",
                onClick: () => cadastrar() 
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
                    <CardTitle>Nova Categoria</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Nome</Label>
                        <Input value={nome} placeholder="Nome da categoria" onChange={(e) => setNome(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={confirmarCadastro}>Cadastrar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}