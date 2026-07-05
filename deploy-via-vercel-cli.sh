#!/bin/bash
VERCEL_TOKEN=$(cat /root/.openclaw/workspace/mlm-command-center/credentials/vercel-token.txt)
export VERCEL_TOKEN

echo "Deploying to Vercel..."
npx vercel --prod --token $VERCEL_TOKEN --yes
