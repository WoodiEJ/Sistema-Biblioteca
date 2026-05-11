'use client'

import { Book, BookCheck, ChartColumnStacked, FileText, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuUser = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: "Livros", href: '/livro', icon: Book },
    { label: "Categorias", href: '/categorias', icon: ChartColumnStacked },
    { label: "Minhas reservas", href: '/reservar/minhas', icon: BookCheck }
]

const menuAdmin = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: "Gerenciar Livros", href: '/livro', icon: Book },
    { label: "Gerenciar Categorias", href: '/categorias', icon: ChartColumnStacked },
    { label: "Gerenciar Reservas", href: '/gerenciar', icon: BookCheck },
    { label: "Gerenciar Usuarios", href: '/usuarios', icon: Users },
    { label: "Gerar PDF", href: '/pdf', icon:  FileText },
]

const paragrafoUser = "Procure e reserve seus livros preferidos"
const paragrafoAdmin = "Gerencie a biblioteca"

export default function AppSidebar() {
    const { usuario } = useAuth()
    const menuItems = usuario?.role === 'ADMIN' ? menuAdmin : menuUser
    const paragrafo = usuario?.role === 'ADMIN' ? paragrafoAdmin : paragrafoUser
    const {logout} = useAuth()
    const router = useRouter()

    function deslogar() {
        logout()
        router.push('/')
    }

    return (
        <Sidebar>
            <SidebarHeader className="border border-border">
                <h1 className="font-bold">Biblioteca Geral</h1>
                <p>{paragrafo}</p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild>
                                <Link href={item.href} className="flex items-center">
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton onClick={deslogar}>
                    <LogOut/>
                    Deslogar
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}