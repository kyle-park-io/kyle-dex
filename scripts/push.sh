# docker builder prune -f

currentDir=$(pwd)

cd ${currentDir}/packages/backend
./push2gke.sh
