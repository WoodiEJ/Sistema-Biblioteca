'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"

interface Livro {
    id: number
    titulo: string
    descricao: string
    autor: string
    preco: number
    quantidade: number
    categoria: { id: number, nome: string }
}

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

interface Usuario {
    id: number
    nome: string
    email: string
    role: string
}

interface Categorias {
    id: number
    nome: string
}

interface DataContextType {
    livros: Livro[]
    emprestimos: Emprestimo[]
    usuarios: Usuario[]
    categorias: Categorias[]
    carregado: boolean
}


const DataContext = createContext<DataContextType>({} as DataContextType)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [livros, setLivros] = useState<Livro[]>([])
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const { usuario } = useAuth()
    const [categorias, setCategorias] = useState<Categorias[]>([])
    const [carregado, setCarregado] = useState(false)

    useEffect(() => {
        console.log('usuario no context:', usuario)
        if (!usuario?.token) return

        async function buscarDados() {
            const headers = { 'Authorization': `Bearer ${usuario?.token}` }

            const [livrosRes, emprestimoRes, usuariosRes, categoriasRes] = await Promise.all([
                fetch('http://localhost:3000/livro', { headers }),
                fetch('http://localhost:3000/gerenciar', { headers }),
                fetch('http://localhost:3000/usuarios', { headers }),
                fetch('http://localhost:3000/categorias', {headers})
            ])

            const [livrosData, emprestimosData, usuariosData, categoriasData] = await Promise.all([
                livrosRes.json(),
                emprestimoRes.json(),
                usuariosRes.json(),
                categoriasRes.json()
            ])

            setLivros(Array.isArray(livrosData) ? livrosData : [])
            setEmprestimos(Array.isArray(emprestimosData) ? emprestimosData : [])
            setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
            setCategorias(Array.isArray(categoriasData) ? categoriasData : [])
            setCarregado(true)
        }

        buscarDados()
    }, [usuario])

    return (
        <DataContext.Provider value={{ livros, emprestimos, usuarios, categorias, carregado }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)