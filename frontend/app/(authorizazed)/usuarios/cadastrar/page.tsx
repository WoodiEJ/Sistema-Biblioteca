'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { toast } from "sonner"
import { useData } from "@/context/dataContext"

const roles = ["ADMIN", "USER"]

export default function CadastrarUsuario() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<string | null>(null)
    const { usuario } = useAuth()
    const router = useRouter()
    const {recarregar} = useData()

    async function cadastrar() {
        try {
            const result = await fetch('http://localhost:3000/usuarios/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify({ nome, email, password, role })
            })
            
            const data = await result.json()

            if (result.ok) {
                toast.success("Cadastro concluido com sucesso.")
                router.push('/usuarios')
                recarregar()
            } else {
                toast.error("Erro ao cadastrar", {
                    description: data.mensagem
                })
            }
        } catch (erro) {

        }
    }

    function confirmarCadastro() {
        toast.warning("Confirme o cadastro.", {
            action: {
                label: "Confirmar",
                onClick: () => cadastrar()
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
                    <CardTitle>Novo Usuário</CardTitle>
                    <CardDescription>Cadastre um novo usuário no sistema</CardDescription>
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
                        <Label>Senha</Label>
                        <Input value={password} type="password" placeholder="******" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Role</Label>
                        <Combobox items={roles} onValueChange={(value) => setRole(value as string)}>
                            <ComboboxInput placeholder="Selecione uma role" />
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
                    <Button className="w-full" onClick={confirmarCadastro}>Cadastrar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}