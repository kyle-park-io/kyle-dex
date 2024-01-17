curl -X 'POST' \
  'http://localhost:3000/api/common/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "admin",
  "contractName": "tokenA",
  "function": "transfer",
  "args": [
		"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
		"5000000"
  ]
}'
sleep 2

curl -X 'POST' \
  'http://localhost:3000/api/common/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "admin",
  "contractName": "tokenB",
  "function": "transfer",
  "args": [
		"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
		"5000000"
  ]
}'
sleep 2

curl -X 'POST' \
  'http://localhost:3000/api/common/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "user1",
  "contractName": "tokenA",
  "function": "approve",
  "args": [
		"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
		"100000000"
  ]
}'
sleep 2

curl -X 'POST' \
  'http://localhost:3000/api/common/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "user1",
  "contractName": "tokenB",
  "function": "approve",
  "args": [
		"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
		"100000000"
  ]
}'
sleep 2

curl -X 'POST' \
  'http://localhost:3000/api/common/submit' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "user1",
  "contractName": "Router",
  "function": "addLiquidity",
  "args": [
		"0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
		"0x0165878A594ca255338adfa4d48449f69242Eb8F",
		"2000",
		"1000",
		"0",
		"0",
		"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
		1
  ]
}'
sleep 2
