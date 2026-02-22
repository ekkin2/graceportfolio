#!/bin/bash
# Batch export all honeycomb image nodes from Figma as rendered PNGs
# Usage: FIGMA_TOKEN=your_token ./scripts/export-figma-images.sh

if [ -z "$FIGMA_TOKEN" ]; then
  echo "Get a Personal Access Token from Figma:"
  echo "  Figma → Settings → Account → Personal access tokens → Generate"
  echo ""
  echo "Then run:"
  echo "  FIGMA_TOKEN=your_token_here ./scripts/export-figma-images.sh"
  exit 1
fi

FILE_KEY="MwSvgS3UD6xok82T90hlhT"
OUT_DIR="public/images/honeycomb"
mkdir -p "$OUT_DIR"

declare -A NODES
NODES[hero]="246:295"
NODES[overview]="254:555"
NODES[cad-annotated]="269:972"
NODES[final-cad]="269:980"
NODES[prototypes]="269:955"
NODES[flow-sim-1]="265:818"
NODES[flow-sim-2]="265:732"
NODES[mold-iteration-1]="269:878"
NODES[mold-shutoff]="269:899"
NODES[mold-iteration-2]="278:1058"
NODES[final-mold]="280:1099"
NODES[cam-a]="281:1209"
NODES[cam-b]="281:1147"
NODES[ejector-plate-cam]="293:128"
NODES[machining-mold]="295:163"
NODES[machining-ejector-pins]="299:220"
NODES[setup]="295:201"
NODES[debugging]="305:264"
NODES[final-annotated]="320:352"
NODES[final-showcase]="320:368"

IDS=""
for name in "${!NODES[@]}"; do
  [ -n "$IDS" ] && IDS="$IDS,"
  IDS="$IDS${NODES[$name]}"
done

echo "Fetching export URLs for ${#NODES[@]} nodes..."
RESPONSE=$(curl -sS -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$IDS&format=png&scale=2")

ERR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('err',''))" 2>/dev/null)
if [ -n "$ERR" ] && [ "$ERR" != "None" ]; then
  echo "Figma API error: $ERR"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

echo "Downloading images..."
for name in "${!NODES[@]}"; do
  NODE_ID="${NODES[$name]}"
  URL=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['images']['$NODE_ID'])" 2>/dev/null)
  if [ -n "$URL" ] && [ "$URL" != "None" ] && [ "$URL" != "null" ]; then
    echo "  $name.png <- $NODE_ID"
    curl -sL -o "$OUT_DIR/$name.png" "$URL" &
  else
    echo "  SKIP $name ($NODE_ID) - no URL returned"
  fi
done

wait
echo ""
echo "Done! Downloaded $(ls -1 "$OUT_DIR"/*.png 2>/dev/null | wc -l) images to $OUT_DIR/"
ls -lh "$OUT_DIR"/*.png 2>/dev/null
