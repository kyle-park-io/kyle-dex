currentDir=$(pwd)

cd ${currentDir}/packages/backend
rm -rf build

cd ${currentDir}/packages/frontend
yarn run build
cp -r -p dist ${currentDir}/packages/backend/build
