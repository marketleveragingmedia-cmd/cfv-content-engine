#!/bin/bash
# Since we can't access the database directly, check what the API would return
# by examining the code logic

echo "Checking VisualAssets component code..."
grep -A 10 "assetType === 'Image'" app/session/[id]/VisualAssets.tsx

echo ""
echo "Checking asset creation logic in zip-processor..."
grep -B 5 -A 2 "assetType = 'image'" lib/zip-processor.ts
