# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

cd ${SCRIPT_DIR}/../packages/backend
rm -rf build

cd ${SCRIPT_DIR}/../packages/frontend
# yarn run build
yarn run clean-build-prod
cp -r -p dist ${SCRIPT_DIR}/../packages/backend/build

# public files
cp -r -p public/* /home/kyle/code/kyle-server/packages/ingress-reverse-proxy/public
