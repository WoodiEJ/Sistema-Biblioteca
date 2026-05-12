import { prisma } from "@/lib/prisma"
import { Request, Response } from "express"
import z from "zod"


const categoriaSchema = z.object({
    nome: z.string()
})

const optionalSchema = z.object({
    nome: z.string()
}).partial()

export async function cadastroCategoria(req: Request, res: Response) {
    try {
        const result = categoriaSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Preenche os campos corretamente"})
        }

        const { nome } = result.data
        const categoriaExiste = await prisma.categoria.findUnique({where: {nome}})

        if (categoriaExiste) {
            return res.status(400).json({mensagem: "A categoria ja existe"})
        }

        await prisma.categoria.create({
            data: {
                nome
            }
        })

        return res.status(201).json({mensagem: "Categoria criado com sucesso"})
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({mensagem: erro.message})
        }

        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

export async function consultarCategorias(req: Request, res: Response) {
    try {
        const categorias = await prisma.categoria.findMany()
        return res.status(200).json(categorias)
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({mensagem: erro.message})
        }

        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

export async function consultarCategoria(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const categorias = await prisma.categoria.findUnique({where: {id}})
        return res.status(200).json(categorias)
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({mensagem: erro.message})
        }

        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

export async function atualizarCategoria(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = optionalSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({mensagem: "Valide os dados por favor"})
        }

        const categoriaExiste = await prisma.categoria.findUnique({where: {id}})

        if (!categoriaExiste) {
            return res.status(400).json({mensagem: "A categoria nao existe"})
        }

        await prisma.categoria.update({
            where: {id},
            data: result.data
        })
    } catch (erro) { 
        if (erro instanceof Error) {
            return res.status(500).json({mensagem: erro.message})
        }

        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

export async function deletarCategoria(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const categoria = await prisma.categoria.findUnique({ where: { id } })
        
        if (!categoria) {
            return res.status(400).json({ mensagem: "Categoria nao existe" })
        }

        const livros = await prisma.livro.findMany({ where: { categoria_id: id } })
        const livroId= livros.map(l => l.id)

        await prisma.emprestimo.deleteMany({ where: { livro_id: { in: livroId } } })
        await prisma.livro.deleteMany({ where: { categoria_id: id } })
        await prisma.categoria.delete({ where: { id } })

        return res.status(200).json({ mensagem: "Categoria deletada com sucesso" })
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({mensagem: erro.message})
        }

        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}