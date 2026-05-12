'use client'

import { usePathname, useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface Usuario {
    id: number,
    token: string,
    role: string
}

interface AuthContextType {
    usuario: Usuario | null,
    login: (token: string, role: string, id: number) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const router = useRouter()
    const path = usePathname()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token && path !== '/') {
            router.push('/')
        }
    }, [path])

    function login(token: string, role: string, id: number) {
        setUsuario({ token, role, id })
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('id', String(id))
    }

    function logout() {
        setUsuario(null)
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const id = localStorage.getItem('id')
        if (token && role) {
            setUsuario({ token, role, id: Number(id) })
        }
    }, [])

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)