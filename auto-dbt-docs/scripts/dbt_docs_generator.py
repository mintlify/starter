#!/usr/bin/env python3
"""
dbt Documentation Generator

Fetches dbt models from GitHub repositories and generates Mintlify documentation.
"""

import os
import sys
import json
import yaml
import base64
import requests
import fnmatch
import argparse
import re
import shutil
from pathlib import Path
from datetime import datetime
from jinja2 import Template

class GitHubDBTFetcher:
    def __init__(self, config_path='dbt-sources.yml'):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        self.github_token = os.getenv('GITHUB_TOKEN')
        self.headers = {'Authorization': f'token {self.github_token}'} if self.github_token else {}
        
    def fetch_file_content(self, repo, file_path, branch='master'):
        """Fetch file content from GitHub repository using raw URLs"""
        url = f"https://raw.githubusercontent.com/{repo}/refs/heads/{branch}/{file_path}"
        
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        elif response.status_code == 404:
            print(f"File not found: {file_path}")
        else:
            print(f"Error fetching {file_path}: {response.status_code}")
        return None
    
    def list_directory_contents(self, repo, dir_path, branch='master'):
        """List contents of a directory in GitHub repository"""
        url = f"https://api.github.com/repos/{repo}/contents/{dir_path}"
        
        response = requests.get(url, params={'ref': branch}, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error listing directory {dir_path}: {response.status_code}")
            return []
    
    def discover_models(self, project_key):
        """Discover all models from project using data_structure"""
        project = self.config['projects'][project_key]
        repo = project['repository']
        data_structure = project['data_structure']
        branch = project.get('branch', 'master')
        
        print(f"Discovering models in {repo} using data_structure")
        
        models = {}
        
        for section in data_structure:
            section_name = section['name']
            
            print(f"Processing section: {section_name}")
            
            for model in section['models']:
                model_name = model['name']
                model_path = model['path']
                
                print(f"  Processing model: {model_name}")
                
                # Fetch both .sql and .yml files for each model
                files = {}
                for extension in ['.sql', '.yml']:
                    file_path = f"{model_path}{extension}"
                    print(f"    Fetching {file_path}")
                    file_content = self.fetch_file_content(repo, file_path, branch)
                    if file_content:
                        filename = file_path.split('/')[-1]  # Get just the filename
                        files[filename] = file_content
                
                if files:
                    # Use section name as key to group models
                    if section_name not in models:
                        models[section_name] = {}
                    models[section_name][model_name] = files
        
        return models
    
    def parse_yml_metadata(self, yml_content):
        """Parse YAML metadata for dbt models"""
        try:
            content = yaml.safe_load(yml_content)
            metadata = {}
            
            for model in content.get('models', []):
                model_name = model['name']
                metadata[model_name] = {
                    'description': model.get('description', ''),
                    'config': model.get('config', {}),
                    'columns': {},
                    'tests': model.get('tests', []),
                    'docs': model.get('docs', {}),
                    'meta': model.get('meta', {})
                }
                
                # Process columns
                for col in model.get('columns', []):
                    col_name = col['name']
                    metadata[model_name]['columns'][col_name] = {
                        'name': col_name,
                        'description': col.get('description', ''),
                        'data_type': col.get('data_type', 'unknown'),
                        'tests': col.get('tests', []),
                        'meta': col.get('meta', {})
                    }
            
            return metadata
        except yaml.YAMLError as e:
            print(f"Error parsing YAML: {e}")
            return {}

class DocumentationGenerator:
    def __init__(self, project_config, models_data):
        self.project_config = project_config
        self.models_data = models_data
        self.templates_dir = Path('scripts/templates')
        
    def clean_existing_docs(self, project_key):
        """Clean existing documentation files for the project"""
        output_dir = Path(f'../{project_key}')
        
        if output_dir.exists():
            print(f"Cleaning existing documentation for {project_key}")
            # Remove all .mdx files (including overview.mdx since we regenerate it)
            for mdx_file in output_dir.rglob('*.mdx'):
                print(f"  Removing {mdx_file}")
                mdx_file.unlink()
            
            # Remove empty directories (except the root project directory)
            for subdir in output_dir.iterdir():
                if subdir.is_dir() and not any(subdir.iterdir()):
                    print(f"  Removing empty directory {subdir}")
                    subdir.rmdir()

    def generate_all(self):
        """Generate documentation for all models"""
        project_key = None
        for key, config in self.project_config.items():
            if config == self.project_config:
                project_key = key
                break
        
        if not project_key:
            # Find project key by matching config
            for key, config in yaml.safe_load(open('dbt-sources.yml'))['projects'].items():
                if config.get('repository') == self.project_config.get('repository'):
                    project_key = key
                    break
        
        if not project_key:
            print("Could not determine project key")
            return
        
        # Clean existing documentation first
        self.clean_existing_docs(project_key)
            
        # Output to parent directory (main docs directory)
        output_dir = Path(f'../{project_key}')
        output_dir.mkdir(exist_ok=True)
        
        # Generate overview page
        self.generate_overview_page(project_key, output_dir)
        
        for section_name, section_models in self.models_data.items():
            for model_name, model_files in section_models.items():
                self.generate_model_docs(project_key, section_name, model_name, model_files, output_dir)
    
    def generate_model_docs(self, project_key, section_name, model_name, model_files, output_dir):
        """Generate documentation for a single model"""
        print(f"Generating docs for {model_name} in section {section_name}")
        
        # Parse YAML metadata
        yml_files = [f for f in model_files.keys() if f.endswith(('.yml', '.yaml'))]
        metadata = {}
        
        for yml_file in yml_files:
            yml_content = model_files[yml_file]
            fetcher = GitHubDBTFetcher()
            parsed_metadata = fetcher.parse_yml_metadata(yml_content)
            metadata.update(parsed_metadata)
        
        # Find SQL files
        sql_files = [f for f in model_files.keys() if f.endswith('.sql')]
        
        # Generate docs for each table/model
        for table_name in sql_files:
            table_base_name = table_name.replace('.sql', '')
            table_metadata = metadata.get(table_base_name, {})
            
            # Create section-specific directory (convert to URL-friendly format)
            section_dir_name = section_name.lower().replace(' ', '-').replace('ç', 'c')
            model_dir = output_dir / section_dir_name
            model_dir.mkdir(exist_ok=True)
            
            # Generate documentation page
            doc_content = self.generate_table_documentation(
                project_key, section_name, model_name, table_base_name, table_metadata, model_files
            )
            
            # Write documentation file (use model name for filename)
            model_file_name = model_name.lower().replace(' ', '-').replace('ç', 'c').replace('ã', 'a')
            doc_file = model_dir / f"{model_file_name}.mdx"
            with open(doc_file, 'w') as f:
                f.write(doc_content)
            
            print(f"  Generated {doc_file}")
    
    def generate_overview_page(self, project_key, output_dir):
        """Generate overview page with links to all available models"""
        print(f"Generating overview page for {project_key}")
        
        overview_content = f"""---
title: "Visão Geral - {self.project_config['display_name']}"
description: "{self.project_config['description']}"
icon: "{self.project_config.get('icon', 'database')}"
---

# {self.project_config['display_name']}

{self.project_config['description']}

## Modelos Disponíveis

"""
        
        # Add sections and models
        for section_name, section_models in self.models_data.items():
            if not section_models:
                continue
                
            # Convert section name to URL format
            section_url = section_name.lower().replace(' ', '-').replace('ç', 'c')
            
            overview_content += f"### {section_name}\n\n"
            
            for model_name in section_models.keys():
                # Convert model name to URL format
                model_url = model_name.lower().replace(' ', '-').replace('ç', 'c').replace('ã', 'a')
                model_path = f"{project_key}/{section_url}/{model_url}"
                
                overview_content += f"- [{model_name}]({model_path})\n"
            
            overview_content += "\n"
        
        overview_content += f"""## Sobre o Sistema

Este sistema faz parte da infraestrutura de dados da Prefeitura do Rio de Janeiro, desenvolvido e mantido pelo IplanRio.

### Repositório

- **GitHub**: [{self.project_config['repository']}](https://github.com/{self.project_config['repository']})
- **Branch**: `{self.project_config.get('branch', 'master')}`

## Acesso e Suporte

Para dúvidas ou suporte, entre em contato com a equipe de dados do IplanRio.
"""
        
        # Write overview file
        overview_file = output_dir / "overview.mdx"
        with open(overview_file, 'w') as f:
            f.write(overview_content)
        
        print(f"  Generated {overview_file}")
    
    def generate_table_documentation(self, project_key, section_name, model_name, table_name, metadata, model_files):
        """Generate documentation content for a table"""
        template_str = """---
title: "{{ table_display_name }}"
description: "{{ table_description }}"
icon: "{{ table_icon }}"
---

{{ table_description }}

## Informações

- **ID da tabela**: [{{ full_table_id }}]({{ bigquery_url }})
- **Projeto**: {{ project_name }}
- **Dataset**: `{{ dataset_name }}`
- **Tabela**: `{{ table_name }}`

{% if config_info %}
## Configuração

{{ config_info }}
{% endif %}

## Consultas Comuns

```sql
-- Consulta básica
SELECT *
FROM `{{ project_name }}.{{ dataset_name }}.{{ table_name }}`
LIMIT 100;
```


## Colunas ({{ column_count }} total)

{% if columns %}
| Coluna | Tipo | Descrição |
|--------|------|-----------|
{% for column in columns -%}
| `{{ column.name }}` | `{{ column.data_type }}` | {{ column.description | default('') }} |
{% endfor %}
{% else %}
Informações de colunas não disponíveis. Consulte o arquivo `.yml` do modelo para detalhes completos.
{% endif %}



"""
        
        template = Template(template_str)
        
        # Prepare template variables
        columns = list(metadata.get('columns', {}).values())
        config = metadata.get('config', {})
        
        # Extract configuration from SQL config block
        dataset_name = ''
        sql_config = {}
        # Find SQL files in model_files (passed from generate_model_docs)
        sql_content = None
        for filename, content in model_files.items():
            if filename.endswith('.sql'):
                sql_content = content
                break
        
        if sql_content:
            sql_config = self._extract_config_from_sql(sql_content)
            dataset_name = sql_config.get('schema', '')
        
        # Merge SQL config with YAML config (SQL config takes precedence)
        merged_config = {**config, **sql_config}
        
        # Check for date columns
        has_date_column = any('data' in col.get('name', '').lower() for col in columns)
        
        # Build full table ID and BigQuery URL
        project_name = self.project_config.get('project_name', '')
        full_table_id = f"{project_name}.{dataset_name}.{table_name}"
        bigquery_url = f"https://console.cloud.google.com/bigquery?p={project_name}&d={dataset_name}&t={table_name}&page=table"
        
        template_vars = {
            'table_display_name': model_name,  # Use the display name from config
            'table_description': metadata.get('description', f'Modelo {model_name} do sistema RMI'),
            'table_icon': self.project_config.get('icon', 'table'),
            'dataset_name': dataset_name,
            'table_name': table_name,
            'project_name': project_name,
            'full_table_id': full_table_id,
            'bigquery_url': bigquery_url,
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M'),
            'column_count': len(columns),
            'columns': columns,
            'config_info': self._format_config(merged_config),
            'municipal_context': True,
            'has_date_column': has_date_column
        }
        
        return template.render(**template_vars)
    
    def _extract_config_from_sql(self, sql_content):
        """Extract all configuration from dbt SQL config block"""
        # Pattern to match config block
        config_pattern = r'\{\{\s*config\s*\(\s*(.*?)\s*\)\s*\}\}'
        
        match = re.search(config_pattern, sql_content, re.DOTALL)
        if not match:
            return {}
        
        config_content = match.group(1)
        config_data = {}
        
        # Extract schema
        schema_pattern = r"schema\s*=\s*['\"]([^'\"]+)['\"]"
        schema_match = re.search(schema_pattern, config_content)
        if schema_match:
            config_data['schema'] = schema_match.group(1)
        
        # Extract materialized
        materialized_pattern = r"materialized\s*=\s*['\"]([^'\"]+)['\"]"
        materialized_match = re.search(materialized_pattern, config_content)
        if materialized_match:
            config_data['materialized'] = materialized_match.group(1)
        
        # Extract alias
        alias_pattern = r"alias\s*=\s*['\"]([^'\"]+)['\"]"
        alias_match = re.search(alias_pattern, config_content)
        if alias_match:
            config_data['alias'] = alias_match.group(1)
        
        # Extract partition_by (handle nested braces properly)
        partition_start = config_content.find('partition_by')
        if partition_start != -1:
            # Find the opening brace after partition_by =
            equal_pos = config_content.find('=', partition_start)
            if equal_pos != -1:
                brace_pos = config_content.find('{', equal_pos)
                if brace_pos != -1:
                    # Count braces to find the matching closing brace
                    brace_count = 1
                    end_pos = brace_pos + 1
                    while end_pos < len(config_content) and brace_count > 0:
                        if config_content[end_pos] == '{':
                            brace_count += 1
                        elif config_content[end_pos] == '}':
                            brace_count -= 1
                        end_pos += 1
                    
                    if brace_count == 0:
                        # Extract content between braces
                        partition_content = config_content[brace_pos + 1:end_pos - 1]
                        # Clean and format
                        partition_clean = re.sub(r'\s+', ' ', partition_content.strip())
                        config_data['partition_by'] = partition_clean
        
        # Extract cluster_by (array)
        cluster_pattern = r"cluster_by\s*=\s*\[([^\]]+)\]"
        cluster_match = re.search(cluster_pattern, config_content)
        if cluster_match:
            cluster_content = cluster_match.group(1)
            # Clean up the list items
            cluster_items = [item.strip().strip("'\"") for item in cluster_content.split(',')]
            config_data['cluster_by'] = cluster_items
        
        # Extract tags (array)
        tags_pattern = r"tags\s*=\s*\[([^\]]+)\]"
        tags_match = re.search(tags_pattern, config_content)
        if tags_match:
            tags_content = tags_match.group(1)
            # Clean up the list items
            tag_items = [item.strip().strip("'\"") for item in tags_content.split(',')]
            config_data['tags'] = tag_items
        
        return config_data
    
    def _format_config(self, config):
        """Format dbt config information"""
        if not config:
            return None
            
        config_lines = []
        
        if config.get('materialized'):
            config_lines.append(f"- **Materialização**: {config['materialized']}")
        
        if config.get('alias'):
            config_lines.append(f"- **Alias**: {config['alias']}")
        
        if config.get('partition_by'):
            partition_info = config['partition_by']
            if isinstance(partition_info, str):
                # Wrap in code block to avoid MDX parsing issues
                config_lines.append(f"- **Particionamento**: `{partition_info}`")
            else:
                config_lines.append(f"- **Particionamento**: `{partition_info}`")
        
        if config.get('cluster_by'):
            cluster_cols = ', '.join(config['cluster_by']) if isinstance(config['cluster_by'], list) else config['cluster_by']
            config_lines.append(f"- **Clustering**: {cluster_cols}")
        
        if config.get('tags'):
            tags = ', '.join(config['tags']) if isinstance(config['tags'], list) else config['tags']
            config_lines.append(f"- **Tags**: {tags}")
            
        return '\n'.join(config_lines) if config_lines else None

def main():
    parser = argparse.ArgumentParser(description='Generate dbt documentation')
    parser.add_argument('--project', help='Specific project to process')
    parser.add_argument('--rebuild-all', action='store_true', help='Rebuild all projects')
    args = parser.parse_args()
    
    fetcher = GitHubDBTFetcher()
    
    projects_to_process = []
    if args.project:
        if args.project in fetcher.config['projects']:
            projects_to_process = [args.project]
        else:
            print(f"Project '{args.project}' not found in configuration")
            sys.exit(1)
    else:
        projects_to_process = list(fetcher.config['projects'].keys())
    
    for project_key in projects_to_process:
        print(f"\n=== Processing project: {project_key} ===")
        project_config = fetcher.config['projects'][project_key]
        
        try:
            models = fetcher.discover_models(project_key)
            if models:
                generator = DocumentationGenerator(project_config, models)
                generator.generate_all()
                print(f"✅ Successfully generated documentation for {project_key}")
            else:
                print(f"⚠️  No models found for {project_key}")
        except Exception as e:
            print(f"❌ Error processing {project_key}: {e}")
            if args.rebuild_all:
                continue
            else:
                sys.exit(1)

if __name__ == '__main__':
    main()