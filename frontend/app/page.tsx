'use client'

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/authContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {jwtDecode} from 'jwt-decode'
import { toast } from "sonner"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login} = useAuth()
    const router = useRouter()

    async function logar(e: React.FormEvent) {
        e.preventDefault()
        const res = await fetch('http://localhost:3000/login',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            }
        )
        const data = await res.json()

        if (res.ok) {
            const decoded = jwtDecode<{id: number, role: string}>(data.token)
            login(data.token, decoded.role, decoded.id)
            router.push('/dashboard')
        } else {
            const erro = data.mensagem
            toast("Erro ao logar", {
              description: `${erro}`
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center text-sm bg-muted">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Logue na sua conta</CardTitle>
                    <CardDescription>Use as credenciais que a biblioteca te passou</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={logar}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="email@email.com" required/>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="******" required/>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" onClick={logar}>Logar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}