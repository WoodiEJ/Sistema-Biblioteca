import { prisma } from '@/lib/prisma'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

async function main() {
  await prisma.emprestimo.deleteMany()
  await prisma.livro.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.usuario.deleteMany()

  const hashedPassword = await bcrypt.hash('123456', 10)

  const categoriasData = [
    { nome: 'Tecnologia' },
    { nome: 'Ficção Científica' },
    { nome: 'História' },
    { nome: 'Psicologia' },
    { nome: 'Economia' },
    { nome: 'Clássicos' }
  ]

  await prisma.categoria.createMany({ data: categoriasData })
  const categorias = await prisma.categoria.findMany()

  await prisma.usuario.create({
    data: {
      nome: 'Usuário Padrão',
      email: 'usuario@email.com',
      password: hashedPassword,
      role: 'USER'
    }
  })

  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@email.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  const usuariosAleatoriosData = Array.from({ length: 28 }).map(() => ({
    nome: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(['USER', 'USER', 'USER', 'ADMIN']) as 'USER' | 'ADMIN'
  }))

  await prisma.usuario.createMany({ data: usuariosAleatoriosData })
  const usuarios = await prisma.usuario.findMany()

  const livrosData = Array.from({ length: 100 }).map(() => ({
    titulo: faker.book.title(),
    descricao: faker.lorem.paragraph().slice(0, 250),
    autor: faker.book.author(),
    quantidade: faker.number.int({ min: 1, max: 15 }),
    preco: parseFloat(faker.commerce.price({ min: 20, max: 150 })),
    categoria_id: (faker.helpers.arrayElement(categorias) as any).id
  }))

  await prisma.livro.createMany({ data: livrosData })
  const livros = await prisma.livro.findMany()

  const emprestimosData = Array.from({ length: 200 }).map(() => {
    const dataComeco = faker.date.past({ years: 1 })
    const dataFim = new Date(dataComeco)
    dataFim.setDate(dataFim.getDate() + faker.number.int({ min: 3, max: 15 }))

    const ativo = faker.datatype.boolean({ probability: 0.3 })
    const volta = ativo ? null : faker.date.between({ from: dataComeco, to: dataFim })

    return {
      usuario_id: (faker.helpers.arrayElement(usuarios) as any).id,
      livro_id: (faker.helpers.arrayElement(livros) as any).id,
      ativo: ativo,
      data_comeco: dataComeco,
      data_fim: dataFim,
      volta: volta
    }
  })

  await prisma.emprestimo.createMany({ data: emprestimosData })

  console.log('Seed finalizado! Senhas criptografadas com Bcrypt.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })