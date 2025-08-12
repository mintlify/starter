#!/usr/bin/env python3
"""
Navigation Update Script

Updates docs.json navigation structure based on generated documentation.
"""

import os
import json
import yaml
from pathlib import Path

class NavigationGenerator:
    def __init__(self, config_path='dbt-sources.yml'):
        if not os.path.exists(config_path):
            config_path = 'auto-dbt-docs/dbt-sources.yml'
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
    def generate_navigation(self):
        """Generate navigation for all configured projects"""
        tabs = []
        
        for project_key, project in self.config['projects'].items():
            tab = self.create_project_tab(project_key, project)
            if tab:
                tabs.append(tab)
        
        return tabs
    
    def create_project_tab(self, project_key, project):
        """Create navigation tab for a specific project using data_structure"""
        # Always use parent directory since docs are generated there
        project_dir = Path(f'../{project_key}')
        
        if not project_dir.exists():
            print(f"Project directory {project_key} does not exist, skipping")
            return None
        
        groups = [
            {
                "group": "Visão Geral",
                "pages": [
                    f"{project_key}/overview"
                ]
            }
        ]
        
        # Use data_structure from configuration if available
        if 'data_structure' in project:
            for section in project['data_structure']:
                section_name = section['name']
                section_icon = section.get('icon', 'table')
                
                # Convert section name to directory format
                section_dir_name = section_name.lower().replace(' ', '-').replace('ç', 'c')
                section_dir = project_dir / section_dir_name
                
                pages = []
                if section_dir.exists():
                    # Find all .mdx files in this section
                    for mdx_file in section_dir.glob('*.mdx'):
                        page_path = f"{project_key}/{section_dir_name}/{mdx_file.stem}"
                        pages.append(page_path)
                
                if pages:
                    group = {
                        "group": section_name,
                        "icon": section_icon,
                        "pages": sorted(pages)
                    }
                    groups.append(group)
        else:
            # Fallback to directory discovery
            model_categories = {}
            
            for subdir in project_dir.iterdir():
                if subdir.is_dir():
                    category = subdir.name
                    pages = []
                    
                    # Find all .mdx files in this category
                    for mdx_file in subdir.glob('*.mdx'):
                        page_path = f"{project_key}/{category}/{mdx_file.stem}"
                        pages.append(page_path)
                    
                    if pages:
                        model_categories[category] = sorted(pages)
            
            # Create groups for each category
            for category, pages in model_categories.items():
                group = {
                    "group": self.format_category_name(category),
                    "icon": self.get_category_icon(category),
                    "pages": pages
                }
                groups.append(group)
        
        return {
            "tab": project['display_name'],
            "groups": groups
        }
    
    def format_category_name(self, category):
        """Convert category to display name"""
        replacements = {
            'dados-mestres': 'Dados Mestres',
            'eventos': 'Eventos',
            'analytics': 'Analytics',
            'core': 'Core Models'
        }
        return replacements.get(category, category.replace('-', ' ').replace('_', ' ').title())
    
    def get_category_icon(self, category):
        """Get appropriate icon for category"""
        icons = {
            'dados-mestres': 'users',
            'eventos': 'clock',
            'analytics': 'chart-line',
            'core': 'database'
        }
        return icons.get(category, 'table')
    
    def update_docs_json(self):
        """Update docs.json with generated navigation"""
        # Look for docs.json in parent directory if not found locally
        docs_json_path = 'docs.json'
        if not os.path.exists(docs_json_path):
            docs_json_path = '../docs.json'
        
        if not os.path.exists(docs_json_path):
            print(f"Error: docs.json not found in current or parent directory")
            return False
        
        with open(docs_json_path, 'r') as f:
            docs_config = json.load(f)
        
        # Get existing tabs
        existing_tabs = docs_config['navigation']['tabs']
        project_names = [proj['display_name'] for proj in self.config['projects'].values()]
        
        # Keep non-project tabs (like API Reference, etc.)
        filtered_tabs = [tab for tab in existing_tabs 
                        if tab['tab'] not in project_names]
        
        # Add generated project tabs
        new_tabs = self.generate_navigation()
        docs_config['navigation']['tabs'] = filtered_tabs + new_tabs
        
        # Write updated configuration
        with open(docs_json_path, 'w') as f:
            json.dump(docs_config, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Updated navigation with {len(new_tabs)} project tabs")
        return True

def create_overview_pages():
    """Create overview pages for projects that don't have them"""
    config_path = 'dbt-sources.yml'
    if not os.path.exists(config_path):
        config_path = 'auto-dbt-docs/dbt-sources.yml'
    
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    for project_key, project in config['projects'].items():
        project_dir = Path(project_key)
        # Check if running from auto-dbt-docs directory
        if not project_dir.exists() and not Path(f'../{project_key}').exists():
            # Create in parent directory if we're in auto-dbt-docs
            project_dir = Path(f'../{project_key}')
        project_dir.mkdir(exist_ok=True)
        
        overview_file = project_dir / 'overview.mdx'
        if not overview_file.exists():
            overview_content = f"""---
title: "Visão Geral - {project['display_name']}"
description: "{project['description']}"
icon: "{project['icon']}"
---

# {project['display_name']}

{project['description']}

## Sobre o Sistema

Este sistema faz parte da infraestrutura de integração da Prefeitura do Rio de Janeiro, desenvolvido e mantido pelo IplanRio.

### Datasets Principais

{chr(10).join(f'- `{dataset}`' for dataset in project.get('context', {}).get('datasets', []))}

## Governança de Dados

### LGPD e Proteção de Dados

O sistema está em conformidade com a Lei Geral de Proteção de Dados (LGPD) e implementa as seguintes medidas:

- Controle de acesso baseado em perfis municipais
- Auditoria de todas as operações de consulta
- Políticas de retenção de dados definidas
- Criptografia de dados sensíveis

### Campos de Dados Pessoais

{chr(10).join(f'- `{field}`' for field in project.get('context', {}).get('data_governance', {}).get('personal_data_fields', []))}

## Arquitetura

O sistema segue a arquitetura de Data Lake da Prefeitura do Rio, com camadas bem definidas:

1. **Raw Layer**: Dados brutos dos sistemas origem
2. **Intermediate Layer**: Transformações e limpeza
3. **Marts Layer**: Dados consolidados para consumo

## Acesso e Permissões

- **Acesso**: Restrito a serviços municipais autorizados
- **Autenticação**: Integrada com o sistema de autenticação municipal
- **Auditoria**: Todas as consultas são registradas para compliance

## Suporte

Para dúvidas ou suporte, entre em contato com a equipe de dados do IplanRio.
"""
            
            with open(overview_file, 'w') as f:
                f.write(overview_content)
            
            print(f"Created overview page: {overview_file}")

def main():
    print("Updating navigation structure...")
    
    # Create overview pages if they don't exist
    create_overview_pages()
    
    # Update navigation
    generator = NavigationGenerator()
    success = generator.update_docs_json()
    
    if success:
        print("✅ Navigation update completed successfully")
    else:
        print("❌ Navigation update failed")
        exit(1)

if __name__ == '__main__':
    main()