# `backend`

> TODO: description

## Usage

```
const backend = require('backend');

// TODO: DEMONSTRATE API
```

## Deploy (GKE)

The backend runs as the `dex-app-server` container of the
`dex-app-server-deployment` deployment, next to `dex-app-hardhat` from
kyle-project-contracts.

1. Put the gitignored inputs in this directory. `push2gke_artifact.sh` stops
   and names what is missing:
   - `build/`: the frontend built with `npm run build-prod` in
     `packages/frontend` (its `dist/`)
   - `artifacts/`: the hardhat artifacts of DexCalc, Factory, Pair, Router and
     Token from kyle-project-contracts (`npx hardhat compile`)
   - `config-prod/prod.yaml`: from `~/kyle-config/src/kyle-server/env/config-prod/`
2. Build and push from a clean checkout of the commit to release. The image
   is tagged with the commit and `latest`, and earlier images are kept:
   `./push2gke_artifact.sh`
3. Point the container at the commit tag with the command step 2 printed:
   `./set_image.sh dex-app-server-deployment dex-app-server <image>:<commit>`
4. To roll back, run the command that step 3 printed before the rollout. It
   names the digest that was running.

A rollout restarts both containers of the pod.
