# AI Documentation Guidelines - Prefeitura Rio Integration Infrastructure

## Core Principles

### 1. Complete but Concise
- Cover all essential information without redundancy
- One concept = one clear explanation
- Remove filler words, keep technical precision
- Maximum 3 sentences per paragraph unless listing steps

### 2. Non-Verbose Style
- Use active voice: "Run the command" not "The command should be run"
- Direct imperatives: "Configure X" not "You can configure X"
- Bullet points over prose when listing items
- Headers that state purpose, not questions

### 3. Municipal Context Integration
- Always frame examples within Prefeitura Rio context
- Reference secretarias (SMS, SME, etc.) in examples
- Use municipal data sources when providing sample queries
- Mention IplanRio as maintainer where relevant

## Content Structure Patterns

### Technical Guides
```
# [Tool/Process Name]

[One sentence describing purpose in municipal context]

## Prerequisites
- [Essential requirements only]

## Implementation
1. [Step with specific command/action]
2. [Step with expected output]
3. [Verification step]

## Municipal Examples
- [Real use case from secretaria]

## Troubleshooting
- [Common issue]: [Solution]
```

### API Documentation
```
# [API Name]

[Purpose for municipal integration]

## Authentication
[Concise auth steps]

## Endpoints
### [Endpoint name]
- **Purpose**: [Municipal use case]
- **Request**: [Example with municipal data]
- **Response**: [Expected format]

## Integration Examples
[Secretaria-specific usage]
```

### Architecture Documentation
```
# [Component Name]

[Role in municipal infrastructure]

## Components
- [Component]: [Function in 1 sentence]

## Data Flow
[Municipal data journey through component]

## Configuration
[Essential settings only]
```

## Language Optimization for AI

### Use Structured Formats
- Consistent heading hierarchy (H1 → H2 → H3)
- Standardized code block labels
- Predictable section ordering
- Machine-parseable lists

### Semantic Clarity
- One concept per section
- Clear input/output relationships
- Explicit dependencies between steps
- Unambiguous technical terms

### Cross-Reference Patterns
- Use relative paths: `../other-section`
- Consistent naming: `data-lake/dbt/` not `dbt-section/`
- Link to related concepts at section end
- Reference municipal context examples

## Content Completeness Checklist

### For Each New Document:
1. **Context**: Municipal purpose clearly stated
2. **Prerequisites**: All dependencies listed
3. **Implementation**: Step-by-step with verification
4. **Examples**: Municipal secretaria use cases
5. **Integration**: How it connects to other components
6. **Troubleshooting**: Common issues + solutions

### Municipal-Specific Requirements:
- **Data Sources**: Reference actual municipal datasets
- **Permissions**: Mention LGPD compliance where relevant
- **Scale**: Consider multi-secretaria usage
- **Security**: Municipal authentication patterns

## AI Writing Instructions

### Document Creation Process:
1. **Analyze Scope**: What municipal problem does this solve?
2. **Identify Audience**: Developer, architect, or end-user?
3. **Map Dependencies**: What other docs need updating?
4. **Write Core Content**: Follow structure patterns above
5. **Add Municipal Context**: Secretaria examples, municipal data
6. **Cross-Reference**: Link to related documentation
7. **Verify Completeness**: Use checklist above

### Style Commands:
- Replace "you can" → "configure"
- Replace "it is possible to" → direct instruction
- Replace "there are several ways" → "use this approach"
- Replace questions in headers → statements
- Remove hedge words: "might", "could", "perhaps"

### Municipal Integration Commands:
- Add secretaria examples to generic concepts
- Reference IplanRio as maintainer/authority
- Use municipal data in code examples
- Frame solutions for multi-department usage
- Consider municipal governance requirements

## Cross-Document Consistency

### Naming Conventions:
- Data Lake components: `bronze`, `silver`, `gold` layers
- dbt models: `raw_`, `int_`, `dim_`, `fct_` prefixes
- API endpoints: `/api/v1/` pattern
- File paths: `data-lake/` not `guia-de-desenvolvimento/`

### Municipal Terminology:
- "Secretarias" not "departments"
- "IplanRio" as technical authority
- "Prefeitura do Rio" for institutional references
- "Municipal systems" for integrated services

### Technical Standards:
- Code blocks must specify language
- Commands include expected output
- File paths use absolute references from project root
- Screenshots stored in `/images/[section]/` structure

## Review Protocol for AI Agents

When creating/updating documentation:

1. **Scan Related Documents**: Check for outdated cross-references
2. **Update Navigation**: Verify `docs.json` includes new pages
3. **Validate Examples**: Ensure municipal context examples remain current
4. **Check Dependencies**: Update prerequisite lists in dependent docs
5. **Verify Links**: Confirm all internal links resolve correctly
6. **Test Instructions**: Validate step-by-step procedures work
7. **Municipal Alignment**: Confirm examples reflect current municipal structure