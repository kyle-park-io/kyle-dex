SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# hardhat
# cd /home/kyle/code/kyle-project-contracts
# ./dev.sh

${SCRIPT_DIR}/build.sh

${SCRIPT_DIR}/push.sh
