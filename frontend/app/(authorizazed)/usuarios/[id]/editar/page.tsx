'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/authContext"
import { useRouter, useParams } from "next/navigation"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { useData } from "@/context/dataContext"
import { toast } from "sonner"

const roles = ["ADMIN", "USER"]

export default function EditarUsuario() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<string | null>(null)
    const { usuario } = useAuth()
    const { usuarios } = useData()
    const router = useRouter()
    const { id } = useParams()
    const {recarregar} = useData()

    useEffect(() => {
        const u = usuarios.find(u => u.id === Number(id))
        if (u) {
            setNome(u.nome)
            setEmail(u.email)
            setRole(u.role)
        }
    }, [usuarios, id])

    async function atualizar() {
        try {
            const result = await fetch(`http://localhost:3000/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify({ nome, email, password: password || undefined, role })
            })
            
            const data = await result.json()

            if (result.ok) {
                toast.success("Atualizado com sucesso.")
                router.push('/usuarios')
                recarregar()
            } else {
                toast.error("Erro ao atualizar.", {
                    description: data.mensagem
                })
            }
        } catch (erro) {
            toast.error("Erro de conexão.")
        }
    }

    function confirmarAtualizar() {
        toast.warning("Deseja atualizar?", {
            action: {
                label: "Confirmar",
                onClick: () => atualizar()
            }, 
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
        })
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Editar Usuário</CardTitle>
                    <CardDescription>Atualize os dados do usuário</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Nome</Label>
                        <Input value={nome} placeholder="Nome do usuário" onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Email</Label>
                        <Input value={email} type="email" placeholder="email@email.com" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Nova Senha</Label>
                        <Input value={password} type="password" placeholder="Deixe em branco para manter" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Role</Label>
                        <Combobox items={roles} onValueChange={(value) => setRole(value as string)}>
                            <ComboboxInput placeholder={role ?? "Selecione uma role"} />
                            <ComboboxContent>
                                <ComboboxEmpty>Nenhuma role encontrada</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={confirmarAtualizar}>Atualizar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}