cd ../packages/backend
rm -rf build

cd ../frontend
yarn run build
cp -r -p dist ../backend/build
