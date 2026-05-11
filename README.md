Aqui está um modelo de README.md profissional e direto, focado no seu projeto de Biblioteca, com as instruções de execução e os detalhes sobre o sistema de seeding.
📚 Sistema de Gerenciamento de Biblioteca

Este é um projeto full-stack desenvolvido com Next.js, Node.js, Prisma e MySQL. O sistema permite a gestão de livros, usuários e empréstimos, com dashboards distintos para administradores e leitores.
🚀 Como Rodar o Projeto
1. Pré-requisitos

Certifique-se de ter instalado:

    Node.js (v18 ou superior)

    MySQL ativo em sua máquina

2. Configuração do Backend

    Entre na pasta do servidor:
    Bash

    cd backend

    Instale as dependências:
    Bash

    npm install

    Configure o arquivo .env com a sua URL de conexão do MySQL:
    Snippet de código

    DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
    JWT_SECRET="senhaSecreta" -- Coloque EXATAMENTE ASSIM!!
   

    Execute as migrations do Prisma:
    Bash

    npx prisma migrate dev

4. Configuração do Frontend

    Em um novo terminal, entre na pasta do frontend:
    Bash

    cd frontend

    Instale as dependências:
    Bash

    npm install

    Inicie o projeto:
    Bash

    npm run dev

🌱 Populando o Banco de Dados (Seed)

Para facilitar os testes e a visualização do Dashboard (gráficos e tabelas), o projeto conta com um script de Seeding automatizado.

Este comando irá limpar o banco de dados e gerar:

    2 Usuários Fixos (Admin e Usuário Padrão).

    28 Usuários aleatórios.

    100 Livros com categorias variadas.

    200 Empréstimos distribuídos pelo último ano.

Para rodar o seed, execute no terminal do backend:
Bash

npx prisma db seed

🔐 Credenciais de Acesso

Após rodar o comando de seed, utilize as credenciais abaixo para testar as diferentes permissões do sistema:
🛠️ Administrador (Acesso Total)

    Email: admin@email.com

    Senha: 123456

    Permissões: Visualiza o Painel Administrativo, gráficos de empréstimos, gerencia (exclui/devolve) todas as reservas e edita o catálogo de livros.

👤 Usuário Padrão (Leitor)

    Email: usuario@email.com

    Senha: 123456

    Permissões: Visualiza o catálogo de livros populares, gerencia sua própria estante ("Meus Livros") e realiza novas reservas de livros.

🛠️ Tecnologias Utilizadas

    Frontend: Next.js 14/15, Tailwind CSS, Shadcn/UI, Lucide React.

    Backend: Node.js, Prisma ORM, Bcrypt, JWT.

    Dados: Faker.js (para geração de massa de dados realista).
