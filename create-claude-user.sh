#!/bin/bash
# create-claude-user.sh

USER_EMAIL="$1"
if [ -z "$USER_EMAIL" ]; then
    echo "Uso: $0 <user-email@prefeitura.rio>"
    exit 1
fi

# Extrair nome do usuário do email
USER_NAME=$(echo $USER_EMAIL | cut -d'@' -f1 | tr '.' '-')

echo "Criando service account para $USER_EMAIL..."

# Criar service account específico do usuário
gcloud iam service-accounts create "claude-$USER_NAME" \
    --display-name="Claude Code - $USER_EMAIL" \
    --description="Service account for Claude Code access - $USER_EMAIL"

# Dar permissões
gcloud projects add-iam-policy-binding rj-ia-desenvolvimento \
    --member="serviceAccount:claude-$USER_NAME@rj-ia-desenvolvimento.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Gerar chave
gcloud iam service-accounts keys create "claude-$USER_NAME-key.json" \
    --iam-account="claude-$USER_NAME@rj-ia-desenvolvimento.iam.gserviceaccount.com"

echo "Service account criado: claude-$USER_NAME@rj-ia-desenvolvimento.iam.gserviceaccount.com"
echo "Chave salva em: claude-$USER_NAME-key.json"
echo ""
echo "Envie o arquivo claude-$USER_NAME-key.json para o usuário de forma segura."