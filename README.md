# Documentação de Integração IplanRio

Este repositório contém a documentação técnica completa da infraestrutura de integração da IplanRio. A documentação abrange todos os aspectos da integração de sistemas, desde o Data Lake até as APIs e serviços de autenticação.

## Estrutura da Documentação

A documentação está organizada nas seguintes seções principais:

- **Introdução**: Documentos introdutórios e guias rápidos
- **Data Lake**: 
  - Guias de desenvolvimento
  - Tipos de pipeline
  - Guias de estilo para dados
  - Processos de ETL
- **Barramento de Dados**: 
  - Referências de API
  - Documentação de endpoints
  - Guias de integração
- **MCP (Message Control Platform)**:
  - Arquitetura
  - Configuração
  - Fluxos de mensageria
- **Autenticação e Segurança**:
  - Protocolos de autenticação
  - Gerenciamento de tokens
  - Políticas de segurança

## Desenvolvimento Local

Para visualizar e editar a documentação localmente, siga estes passos:

1. Instale o [Mintlify CLI](https://www.npmjs.com/package/mintlify):
```bash
npm i -g mintlify
```

2. Execute o servidor de desenvolvimento na raiz do projeto:
```bash
mintlify dev
```

## Publicação de Alterações

As alterações são publicadas automaticamente através do GitHub App do Mintlify. Ao fazer push para a branch principal, as mudanças serão automaticamente implantadas em produção.

## Solução de Problemas

- Se o `mintlify dev` não estiver funcionando, execute `mintlify install` para reinstalar as dependências
- Se a página carregar como 404, verifique se você está executando o comando em uma pasta que contém o arquivo `docs.json`

## Links Úteis

- [Site IplanRio](https://www.iplan.rio/)
- [Discord IplanRio](https://discord.gg/myFqCKr3)
- [Dashboard Mintlify](https://dashboard.mintlify.com)

## Contribuindo

Para contribuir com a documentação:

1. Crie uma branch para sua contribuição
2. Faça suas alterações seguindo o guia de estilo da documentação
3. Envie um Pull Request para revisão
4. Após aprovado, suas alterações serão publicadas automaticamente

## Suporte

Para suporte técnico, entre em contato através do email: hi@mintlify.com
