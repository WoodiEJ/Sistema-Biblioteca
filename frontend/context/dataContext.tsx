'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { useRouter } from "next/navigation"

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
    recarregar: () => void
}


const DataContext = createContext<DataContextType>({} as DataContextType)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [livros, setLivros] = useState<Livro[]>([])
    const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const { usuario } = useAuth()
    const [categorias, setCategorias] = useState<Categorias[]>([])
    const [carregado, setCarregado] = useState(false)
    const { logout } = useAuth()
    const router = useRouter()

    async function buscarDados() {
        if (!usuario?.token) return
        const headers = { 'Authorization': `Bearer ${usuario?.token}` }

        const [livrosRes, categoriasRes] = await Promise.all([
            fetch('http://localhost:3000/livro', { headers }),
            fetch('http://localhost:3000/categorias', { headers })
        ])

        if ([livrosRes, categoriasRes].some(r => r.status === 401)) {
            logout()
            router.push('/')
            return
        }

        const [livrosData, categoriasData] = await Promise.all([
            livrosRes.json(),
            categoriasRes.json()
        ])

        setLivros(Array.isArray(livrosData) ? livrosData : [])
        setCategorias(Array.isArray(categoriasData) ? categoriasData : [])

        if (usuario.role === 'ADMIN') {
            const [emprestimoRes, usuariosRes] = await Promise.all([
                fetch('http://localhost:3000/gerenciar', { headers }),
                fetch('http://localhost:3000/usuarios', { headers })
            ])

            if ([emprestimoRes, usuariosRes].some(r => r.status === 401)) {
                logout()
                router.push('/')
                return
            }

            const [emprestimosData, usuariosData] = await Promise.all([
                emprestimoRes.json(),
                usuariosRes.json()
            ])

            setEmprestimos(Array.isArray(emprestimosData) ? emprestimosData : [])
            setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
        }

        setCarregado(true)
    }

    useEffect(() => {
        buscarDados()
    }, [usuario])

    return (
        <DataContext.Provider value={{ livros, emprestimos, usuarios, categorias, carregado, recarregar: buscarDados }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)