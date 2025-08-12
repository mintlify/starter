# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Mintlify-based documentation site for the Integration Infrastructure of the Prefeitura do Rio de Janeiro (Rio de Janeiro City Hall), developed and maintained by IplanRio. The documentation covers:

- **Data Lake**: ETL/ELT pipelines, dbt models, data transformation patterns
- **API Gateway**: Centralized API management and integration patterns  
- **MCP (Message Control Platform)**: Asynchronous messaging between municipal services
- **Authentication & Security**: Municipal service authentication protocols

## AI Documentation Instructions

**IMPORTANT**: Before creating or modifying any documentation, AI agents MUST consult the `.ai-instructions/` folder:

### Required Reading for AI Agents:
1. **`.ai-instructions/documentation-guidelines.md`** - Core writing principles, structure patterns, and municipal context integration
2. **`.ai-instructions/content-review-checklist.md`** - Comprehensive checklist for documentation updates and cross-document impact analysis
3. **`.ai-instructions/municipal-context-guide.md`** - Municipal context, secretaria information, and realistic examples

### AI Agent Workflow:
1. **Pre-Writing**: Read relevant AI instruction files and analyze scope
2. **Writing**: Follow guidelines for complete but concise, non-verbose documentation
3. **Review**: Use checklist to verify municipal context, technical accuracy, and cross-document consistency
4. **Post-Writing**: Update navigation, validate links, and ensure ecosystem health

These instructions are optimized for AI processing and contain municipal-specific context, technical patterns, and governance requirements that must be integrated into all documentation.

## Development Commands

### Local Development
```bash
# Install Mintlify CLI globally
npm i -g mintlify

# Start development server
mintlify dev

# Reinstall dependencies if needed
mintlify install
```

### Nix Development Environment
If using Nix (flake.nix available):
```bash
# Enter Nix development shell
nix develop

# Commands available in Nix shell:
mintlify dev      # Start development server
mintlify install  # Reinstall dependencies
```

### Verification
- Check that the development server starts on the correct port
- Verify all documentation pages load correctly
- Ensure all OpenAPI integrations are accessible

## Documentation Architecture

### Content Structure
- **Root MDX files**: Main sections (introduction.mdx, api-reference.mdx, etc.)
- **data-lake/**: Data Lake development guides (formerly guia-de-desenvolvimento/)
  - **dbt/**: dbt-specific documentation (installation, folder structure, testing)
  - **guia-de-estilo/**: Data style guides (datasets, columns, partitions)
  - **tipos-de-pipeline/**: Pipeline types (extraction, transformation, creation)
- **barramento/**: API Gateway documentation
- **images/**: Static assets and diagrams

### Key Configuration Files
- **docs.json**: Mintlify configuration with navigation, themes, and OpenAPI integrations
- **flake.nix**: Nix development environment with Node.js 20 and Mintlify
- **README.md**: Setup instructions and project overview

### OpenAPI Integrations
The documentation dynamically pulls API specifications from:
- Busca API (staging environment)
- Servico de Busca (GitHub repository)
- Subpav OSA SMS API
- eAi Agent API
- Registro Municipal Integrado (RMI)
- GO API

## Content Guidelines

### MDX File Structure
- Use YAML frontmatter with title, description, and icon
- Follow consistent heading hierarchy
- Include CardGroup components for navigation sections
- Reference images using relative paths from /images/

### Technical Documentation Patterns
- **dbt Documentation**: Follow layer-based naming (raw, intermediate, marts)
- **API Documentation**: Leverage OpenAPI integrations rather than manual documentation
- **Pipeline Documentation**: Include visual diagrams and step-by-step processes
- **Architecture Diagrams**: Store in /images/guia-de-desenvolvimento/ (keep this path for backwards compatibility)

### Navigation Structure
Navigation is defined in docs.json with:
- Tab-based organization (Introdução, Data Lake, Barramento, API Reference)
- Grouped pages within each tab
- Icon assignments for visual hierarchy
- OpenAPI endpoint groupings for API reference

## Publishing & Deployment

- **Automatic Deployment**: Changes to main branch auto-deploy via Mintlify GitHub App
- **No Manual Build**: Mintlify handles build and deployment pipeline
- **Staging**: Test changes locally with `mintlify dev` before pushing

## Common Tasks

### Adding New Documentation Pages
1. Create .mdx file in appropriate directory
2. Add YAML frontmatter with title/description
3. Update docs.json navigation structure
4. Test locally with `mintlify dev`

### Adding New API Documentation
1. Ensure OpenAPI spec is publicly accessible
2. Add new group to docs.json API Reference tab
3. Reference OpenAPI URL in navigation configuration

### Updating Architecture Diagrams
1. Save images to appropriate /images/ subdirectory
2. Reference using relative paths in MDX files
3. Ensure images are optimized for web display

### Troubleshooting
- Run `mintlify install` if development server fails to start
- Verify file paths for 404 errors
- Check docs.json syntax for navigation issues
- Ensure all OpenAPI URLs are accessible