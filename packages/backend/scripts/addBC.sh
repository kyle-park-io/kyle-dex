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
  "userName": "admin",
  "contractName": "tokenC",
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
  "contractName": "tokenC",
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
		"0x0165878A594ca255338adfa4d48449f69242Eb8F",
		"0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
		"1000",
		"2000",
		"0",
		"0",
		"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
		1
  ]
}'
sleep 2
