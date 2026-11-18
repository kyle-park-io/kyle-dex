#!/bin/bash
# Build and push dex-app-server (this backend with the frontend build)
#
# The image is pushed with two tags: the commit it was built from and
# latest. Earlier images stay in Artifact Registry, so a bad release can be
# rolled back with set_image.sh. This script used to delete every version of
# the image before pushing, which left nothing to go back to.

set -euo pipefail

PROJECT_ID=kyle-server-402706
REPOSITORY=kyle-registry
LOCATION=me-west1
REGISTRY=$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/dex-app-server

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
REPO_ROOT=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)

# The Dockerfile copies these gitignored inputs. The running image on
# 2026-11-19 had the frontend build (43 files, index.html at the top) in
# build/ and five hardhat artifacts (DexCalc, Factory, Pair, Router, Token)
# in artifacts/.
missing=0
if [ ! -f "$SCRIPT_DIR/build/index.html" ]; then
  echo "Missing build/: run 'npm run build-prod' in packages/frontend and copy its dist/ here as build/" >&2
  missing=1
fi
# Hardhat artifacts of kyle-project-contracts, by their path under its
# artifacts/contracts/ after 'npx hardhat compile'
for source in dex/utils/Calculate.sol/DexCalc.json dex/Factory.sol/Factory.json \
  dex/Pair.sol/Pair.json dex/Router.sol/Router.json dex/Token.sol/Token.json; do
  if [ ! -f "$SCRIPT_DIR/artifacts/${source##*/}" ]; then
    echo "Missing artifacts/${source##*/}: run 'npx hardhat compile' in kyle-project-contracts and copy artifacts/contracts/$source" >&2
    missing=1
  fi
done
if [ ! -f "$SCRIPT_DIR/config-prod/prod.yaml" ]; then
  echo "Missing config-prod/prod.yaml: copy ~/kyle-config/src/kyle-server/env/config-prod/prod.yaml" >&2
  missing=1
fi
[ "$missing" -eq 0 ] || exit 1

# The commit tag must name the code inside the image, so tracked files must
# match HEAD. Gitignored inputs are not part of this check.
if ! git -C "$REPO_ROOT" diff --quiet HEAD --; then
  echo "Commit or stash these changes before pushing:" >&2
  git -C "$REPO_ROOT" status --short --untracked-files=no >&2
  exit 1
fi

TAG=$(git -C "$REPO_ROOT" rev-parse --short=12 HEAD)

# Build for linux/amd64 platform (GKE requirement) and push both tags
docker buildx build --no-cache --platform linux/amd64 \
  --build-arg=PROGRAM_VER="$TAG" \
  --push -t "$REGISTRY:$TAG" -t "$REGISTRY:latest" \
  -f "$SCRIPT_DIR/Dockerfile" "$SCRIPT_DIR"

echo
echo "Pushed $REGISTRY:$TAG (also tagged latest)"
echo "Deploy it with: $SCRIPT_DIR/set_image.sh dex-app-server-deployment dex-app-server $REGISTRY:$TAG"
