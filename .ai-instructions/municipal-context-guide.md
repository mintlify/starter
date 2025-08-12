# Municipal Context Guide for AI Documentation

## Prefeitura do Rio Structure

### Key Entities
- **IplanRio**: Municipal data institute, technical authority for integration infrastructure
- **Secretarias**: Municipal departments (equivalent to ministries)
- **Prefeitura do Rio**: Rio de Janeiro City Hall (institutional reference)

### Primary Secretarias
- **SMS**: Secretaria Municipal de Saúde (Health)
- **SME**: Secretaria Municipal de Educação (Education)
- **SMTR**: Secretaria Municipal de Transportes (Transportation)
- **SMSURB**: Secretaria Municipal de Urbanismo (Urban Planning)
- **SMF**: Secretaria Municipal de Fazenda (Finance)
- **SEOP**: Secretaria Especial de Ordem Pública (Public Order)

### Technical Infrastructure Context
- **Multi-tenant**: Each secretaria has separate data/access patterns
- **Compliance**: LGPD (Brazilian data protection) requirements
- **Scale**: City of 6.7M citizens, multiple large departments
- **Integration**: Legacy systems + modern cloud infrastructure

## Data Context for Examples

### Common Municipal Datasets
- `censo_escolar_*`: Education census data (SME)
- `dados_saude_*`: Health records and metrics (SMS)
- `mobilidade_*`: Transportation/mobility data (SMTR)
- `receita_municipal_*`: Municipal revenue data (SMF)
- `licenciamento_*`: Urban licensing data (SMSURB)
- `ordem_publica_*`: Public safety data (SEOP)

### Example Data Flows
- **Education**: School enrollments → data lake → analytics dashboards
- **Health**: Patient registrations → API gateway → inter-secretaria sharing
- **Transportation**: GPS tracking → real-time APIs → citizen apps
- **Revenue**: Tax collection → integration → financial planning

### API Usage Patterns
- **Internal Integration**: Secretaria A requests data from Secretaria B
- **Citizen Services**: Public-facing APIs for municipal services
- **Analytics**: Data aggregation for policy decision-making
- **Compliance**: LGPD-compliant data sharing protocols

## Municipal-Specific Technical Patterns

### Authentication
- OAuth2 with secretaria-specific scopes
- Service accounts for inter-department integration
- Citizen authentication for public services
- Admin authentication for IplanRio management

### Data Governance
- Bronze/Silver/Gold layers with municipal data classification
- Secretaria-specific data ownership
- Cross-secretaria sharing protocols
- LGPD compliance automation

### Integration Patterns
- Event-driven communication between secretarias
- Batch data synchronization for reporting
- Real-time APIs for citizen-facing services
- Message queuing for reliable inter-department communication

## Documentation Context Rules

### Always Include:
1. **Which secretaria** would use this feature
2. **What municipal problem** it solves
3. **How it fits** into broader municipal architecture
4. **Who maintains** it (usually IplanRio)

### Example Framing Patterns:
- "SMS uses this pipeline to aggregate health metrics across municipal clinics"
- "SME integrates student enrollment data from schools through this API"
- "IplanRio maintains this service to enable secure data sharing between secretarias"

### Municipal Scale Considerations:
- Multi-secretaria deployment scenarios
- Data volume from city-wide operations
- Peak usage during municipal events
- Disaster recovery for essential services

## Technical Examples with Municipal Context

### dbt Model Example:
```sql
-- Model: dim_secretaria
-- Purpose: Standardize secretaria information across municipal systems
-- Maintained by: IplanRio
-- Used by: All secretarias for reporting

SELECT
    secretaria_code,
    secretaria_name,
    secretaria_acronym,
    budget_allocation,
    employee_count
FROM {{ ref('raw_secretarias_data') }}
WHERE active_status = 'ACTIVE'
```

### API Endpoint Example:
```python
# Endpoint: /api/v1/education/schools
# Purpose: SMS requests school health data from SME
# Authentication: Secretaria-scoped OAuth2

@router.get("/schools/{school_id}/health_metrics")
async def get_school_health_metrics(
    school_id: str,
    secretaria_token: str = Depends(verify_secretaria_token)
):
    # Verify SMS has permission to access SME data
    verify_cross_secretaria_access(secretaria_token, "SMS", "SME")
    return health_service.get_school_metrics(school_id)
```

### Pipeline Example:
```yaml
# Pipeline: censo_escolar_etl
# Purpose: Process SME education census for municipal planning
# Frequency: Annual
# Owner: IplanRio, Data Consumer: SME + SMSURB (for school location planning)

pipeline:
  name: "censo_escolar_municipal"
  description: "ETL for municipal education census data"
  source: "sme_censo_database"
  destination: "data_lake.gold.education"
  secretaria_access: ["SME", "SMSURB", "SMF"]
```

## Governance Context

### Municipal Decision-Making
- Policy decisions based on cross-secretaria data analysis
- Budget allocation using integrated municipal metrics
- Service optimization through citizen usage patterns
- Emergency response coordination between departments

### Compliance Requirements
- LGPD compliance for all citizen data
- Municipal transparency requirements
- Inter-governmental data sharing protocols
- Audit trails for all data access

### Stakeholder Considerations
- **Citizens**: Service availability and data privacy
- **Secretarias**: Operational efficiency and data access
- **IplanRio**: Technical maintenance and governance
- **Municipal Leadership**: Policy insights and transparency

## AI Writing Context Commands

### When describing features:
- Start with municipal problem being solved
- Include relevant secretaria examples
- Consider multi-department implications
- Frame within Rio's governance structure

### When providing examples:
- Use realistic municipal data scenarios
- Reference actual secretaria workflows
- Include appropriate scale considerations
- Mention LGPD/compliance where relevant

### When explaining architecture:
- Position within broader municipal infrastructure
- Explain secretaria interaction patterns
- Consider citizen-facing implications
- Reference IplanRio maintenance responsibilities