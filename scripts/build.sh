currentDir=$(pwd)

cd ${currentDir}/packages/backend
rm -rf build

cd ${currentDir}/packages/frontend
# yarn run build
yarn run clean-build-prod
cp -r -p dist ${currentDir}/packages/backend/build

# public files
cp -r -p public/* /home/kyle/code/kyle-server/packages/ingress-proxy/public
