# Auto-dbt-docs: Automated dbt Documentation Generator

Sistema automatizado para gerar documentação Mintlify a partir de projetos dbt hospedados no GitHub, com extração inteligente de configurações e contexto municipal da Prefeitura do Rio de Janeiro.

## Visão Geral

Este sistema:
- Conecta-se a repositórios GitHub com projetos dbt
- Extrai configurações diretamente dos blocos SQL `{{ config() }}`
- Gera páginas MDX para documentação Mintlify
- Atualiza automaticamente a estrutura de navegação
- Integra contexto municipal e governança de dados

## Estrutura do Projeto

```
auto-dbt-docs/
├── dbt-sources.yml              # Configuração principal dos projetos
├── scripts/
│   ├── dbt_docs_generator.py    # Gerador principal de documentação
│   └── update_navigation.py     # Atualizador da navegação
├── pyproject.toml               # Dependências Python (uv)
├── uv.lock                      # Lock file do uv
└── README.md                    # Este arquivo

.github/workflows/
└── update-dbt-docs.yml          # Workflow GitHub Actions (raiz do repo)
```

## Configuração

### 1. Arquivo de Configuração (`dbt-sources.yml`)

```yaml
projects:
  projeto-exemplo:
    display_name: "Nome do Projeto para Exibição"
    repository: "prefeitura-rio/repo-exemplo"
    branch: "master"
    description: "Descrição detalhada do projeto"
    data_structure:
      - name: "Seção Principal"
        icon: "database"
        models:
          - name: "Nome do Modelo"
            path: "models/core/caminho_modelo"
          - name: "Outro Modelo"
            path: "models/marts/outro_modelo"
      - name: "Segunda Seção"
        icon: "chart-line"
        models:
          - name: "Modelo Analítico"
            path: "models/analytics/modelo_analitico"
```

### 2. Configuração GitHub

**Token de Acesso:**
- Configure `GITHUB_TOKEN` nas Actions do repositório
- Token deve ter permissões para acessar repositórios dbt

**Workflow Trigger (opcional):**
Adicione nos repositórios fonte para trigger automático:

```yaml
# .github/workflows/trigger-docs-update.yml
name: Trigger Documentation Update

on:
  push:
    branches: [ master, main ]
    paths:
      - 'models/**/*.sql'
      - 'models/**/*.yml'

jobs:
  trigger-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger documentation update
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.DOCS_UPDATE_TOKEN }}
          repository: prefeitura-rio/mintlify-docs
          event-type: dbt-schema-updated
```

## Uso

### Execução Local

**Pré-requisitos:**
- Python 3.11+
- uv (gerenciador de pacotes)
- Token GitHub configurado como variável de ambiente

**Comandos:**

```bash
# Instalar dependências
cd auto-dbt-docs
uv sync

# Gerar documentação para projeto específico
uv run python main.py --project rmi

# Gerar documentação para todos os projetos
uv run python main.py --rebuild-all
```

### Execução Automática

O sistema executa automaticamente via GitHub Actions:

- **Manual**: Workflow dispatch com opção de projeto específico
- **Por mudanças**: Repository dispatch de repositórios fonte
- **Semanal**: Domingos às 6h UTC (rebuild completo)

## Funcionalidades Principais

### 1. Extração Inteligente de Configurações

- **Fonte única**: Configurações extraídas apenas dos blocos `{{ config() }}` em SQL
- **Sem fallback**: Dataset/schema devem estar explícitos no SQL config
- **Configurações suportadas**:
  - `schema` (nome do dataset)
  - `materialization` (table, view, incremental)
  - `partition_by` (configurações de particionamento)
  - `cluster_by` (campos de clustering)
  - `tags` (tags do modelo)

### 2. GitHub Raw URLs

- Usa URLs raw do GitHub para evitar rate limiting da API
- Formato: `https://raw.githubusercontent.com/{repo}/refs/heads/{branch}/{path}`
- Mais eficiente para busca de arquivos

### 3. Geração MDX-Safe

- Configurações complexas em blocos de código para evitar parsing errors
- Formatação especial para particionamento aninhado
- Escape adequado de caracteres especiais

### 4. Contexto Municipal

- Integração com padrões da Prefeitura do Rio
- Referências a LGPD e governança de dados
- Exemplos práticos de uso municipal

## Estrutura de Saída

Para cada projeto configurado:

```
projeto-nome/
├── overview.mdx                 # Página de visão geral do projeto
├── secao-1/
│   ├── modelo-1.mdx            # Documentação de modelo individual
│   └── modelo-2.mdx
└── secao-2/
    └── modelo-3.mdx
```

**Conteúdo de cada página de modelo:**
- Título e descrição
- Informações de dataset/schema
- Configurações de materialização
- Documentação de colunas em formato tabela
- Configurações de particionamento/clustering
- Tags e metadados
- Contexto municipal e governança

## Personalização

### Templates de Documentação

Modifique a função `generate_table_documentation()` em `dbt_docs_generator.py`:

```python
def generate_table_documentation(self, model_name, model_data, project_config):
    # Personalizar template MDX aqui
    template = """
---
title: "{title}"
description: "{description}"
---

# {title}

{description}

## Configuração
{config_info}

## Colunas
{columns_table}
"""
```

### Navegação

Ajuste `update_navigation.py` para modificar:
- Estrutura de agrupamento
- Ícones das seções
- Ordem de apresentação

### Processamento de Configurações

Estenda `_extract_config_from_sql()` para suportar novas configurações dbt.

## Troubleshooting

### Problemas Comuns

**1. Erro 404 ao buscar repositório**
```
File not found: models/core/exemplo
```
- Verifique se o caminho em `data_structure.models[].path` está correto
- Confirme se o arquivo `.sql` existe no repositório
- Verifique permissões do token GitHub

**2. Dataset não encontrado**
```
Dataset name not found in SQL config
```
- Adicione `schema='nome_dataset'` no bloco `{{ config() }}` do modelo SQL
- Sistema não usa fallback - dataset deve estar explícito

**3. Configuração não extraída**
```
No config block found in SQL
```
- Verifique se o modelo tem bloco `{{ config(...) }}`
- Confirme sintaxe correta do bloco config
- Teste regex pattern localmente

**4. Navegação não atualiza**
```
Navigation structure not updated
```
- Confirme que `docs.json` está no diretório raiz
- Verifique permissões de escrita no repositório
- Execute `update_navigation.py` separadamente para debug

### Debug Local

```bash
# Teste extração de configuração específica
uv run python -c "
from scripts.dbt_docs_generator import GitHubDBTFetcher
fetcher = GitHubDBTFetcher()
content = fetcher.fetch_file_content('repo/name', 'models/exemplo.sql')
config = fetcher._extract_config_from_sql(content)
print(config)
"

# Teste geração de documentação sem escrita
uv run python scripts/dbt_docs_generator.py --project exemplo --dry-run
```

### Logs Detalhados

- GitHub Actions: Actions tab do repositório
- Local: output direto no terminal
- Configuração: validação YAML com `yaml.safe_load()`

## Adicionando Novos Projetos

1. **Configurar projeto** em `dbt-sources.yml`:
```yaml
novo-projeto:
  display_name: "Novo Projeto"
  repository: "org/repo-name"
  branch: "main"
  description: "Descrição do projeto"
  data_structure:
    - name: "Seção Principal"
      icon: "database"
      models:
        - name: "Modelo Exemplo"
          path: "models/core/exemplo"
```

2. **Testar localmente**:
```bash
uv run python scripts/dbt_docs_generator.py --project novo-projeto
```

3. **Configurar trigger** (opcional) no repositório fonte

4. **Executar build completo**:
```bash
uv run python scripts/dbt_docs_generator.py --rebuild-all
uv run python scripts/update_navigation.py
```

## Extensões Futuras

### Suporte a Outros Formatos
- Extensão para projetos não-dbt
- Integração com outros sistemas de documentação
- Suporte a múltiplos formatos de saída

### Melhorias de Performance
- Cache de conteúdo GitHub
- Processamento paralelo de modelos
- Otimização de regex patterns

### Recursos Avançados
- Validação automática de links
- Geração de diagramas de dependência
- Integração com catálogo de dados