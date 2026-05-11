'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { useAuth } from "@/context/authContext"
import { useData } from "@/context/dataContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CadastrarLivro() {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [autor, setAutor] = useState('')
    const [categoria_id, setCategoria] = useState<number | null>(null)
    const [preco, setPreco] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const { usuario } = useAuth()
    const { categorias } = useData()
    const router = useRouter()

    async function cadastrar() {
        try {
            const result = await fetch('http://localhost:3000/livro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify({
                    titulo,
                    descricao,
                    autor,
                    categoria_id,
                    preco: Number(preco),
                    quantidade: Number(quantidade)
                })
            })

            const data = await result.json()

            if (result.ok) {
                toast.success("Livro cadastrado com sucesso.")
                router.push('/livro')
            } else {
                toast.error("Erro ao cadastrar.", {
                    description: data.mensagem
                })
            }
        } catch (erro) {
            toast.error("Erro de conexão.")
        }
    }

    function confirmarCadastro() {
        toast("Confirme cadastro?", {
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
        <div className="p-8 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Cadastrar Livro</CardTitle>
                    <CardDescription>Adicione um novo livro à biblioteca</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Título</Label>
                        <Input value={titulo} placeholder="Nome do livro" onChange={(e) => setTitulo(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Descrição</Label>
                        <Input value={descricao} placeholder="Descrição do livro" onChange={(e) => setDescricao(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Autor</Label>
                        <Input value={autor} placeholder="Autor do livro" onChange={(e) => setAutor(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label>Categoria</Label>
                        <Combobox items={categorias.map(c => c.nome)} onValueChange={(nome) => {
                            const cat = categorias.find(c => c.nome === nome)
                            if (cat) setCategoria(cat.id)
                        }}>
                            <ComboboxInput placeholder="Selecione uma categoria" />
                            <ComboboxContent>
                                <ComboboxEmpty>Nenhuma categoria encontrada</ComboboxEmpty>
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <Label>Preço</Label>
                            <Input value={preco} placeholder="0.00" onChange={(e) => setPreco(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Cópias</Label>
                            <Input value={quantidade} placeholder="0" onChange={(e) => setQuantidade(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={confirmarCadastro}>Cadastrar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}