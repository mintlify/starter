#!/bin/bash

# Script para atualizar especificações OpenAPI
# Executa: chmod +x update-api-specs.sh && ./update-api-specs.sh

echo "🔄 Atualizando especificações das APIs..."

# Criar diretório se não existir
mkdir -p api-specs

# Baixar todas as especificações
echo "📥 Baixando API de Busca..."
curl -s "https://services.staging.app.dados.rio/busca/openapi.json" -o api-specs/busca-openapi.json

echo "📥 Baixando Serviço de Busca..."
curl -s "https://raw.githubusercontent.com/prefeitura-rio/app-busca-search/refs/heads/staging/docs/openapi-v3.json" -o api-specs/servico-busca-openapi.json

echo "📥 Baixando Subpav OSA SMS..."
curl -s "https://services.staging.app.dados.rio/subpav-osa-api/openapi.json" -o api-specs/subpav-osa-openapi.json

echo "📥 Baixando eAi Agent..."
curl -s "https://services.staging.app.dados.rio/eai-agent/openapi.json" -o api-specs/eai-agent-openapi.json

echo "📥 Baixando RMI..."
curl -s "https://raw.githubusercontent.com/prefeitura-rio/app-rmi/refs/heads/staging/docs/openapi-v3.json" -o api-specs/rmi-openapi.json

echo "📥 Baixando GO..."
curl -s "https://raw.githubusercontent.com/prefeitura-rio/app-go-api/refs/heads/staging/docs/openapi-v3.json" -o api-specs/go-openapi.json

# Verificar se os downloads foram bem-sucedidos
echo "📊 Verificando arquivos baixados..."
for file in api-specs/*.json; do
    if [ -s "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        echo "✅ $(basename "$file"): ${size} bytes"
    else
        echo "❌ $(basename "$file"): falha no download"
    fi
done

echo "🎉 Atualização das especificações concluída!"
echo ""
echo "💡 Próximos passos:"
echo "1. Execute: mintlify dev"
echo "2. Acesse: http://localhost:3000/barramento"
echo "3. Teste as APIs no Barramento de Dados"
echo ""
echo "🚀 Para deploy:"
echo "git add api-specs/ docs.json"
echo "git commit -m 'fix: usar especificações OpenAPI locais'"
echo "git push" 