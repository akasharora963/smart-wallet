# SMART WALLET


There are two Smart Conracts involved :


| Contracts        | Description                                                |
| ------------------ | ---------------------------------------------------------- |
||
| `WalletProxy` |  manage the creation and destruction of smart wallet contracts.
| `SmartWallet` | smart wallet contract has the functionality to interact with other contracts, send and receive funds.|

Functions in WalletProxy : 
| Functions       | Description                                                |
| ------------------ | ---------------------------------------------------------- |
||
| `createWallet` |  creats the unique wallet for user using salt (bytes32) as parameter
| `destroyWallet` | destroy the current wallet takes wallet address as parameter|
| `destroyWalletAndRedploy` | destroy the current wallet and create new wallet for user takes wallet address and new salt (bytes32) as parameter|

Functions in SmartWallet : 
| Functions       | Description                                                |
| ------------------ | ---------------------------------------------------------- |
|| 
| `execute` |  Function to delegate calls to another contract takes "to" address and bytes data as parameter|
| `transferOwnership` | transfers the ownership of wallet takes new wallet address as parameter|
| `destroy` | Self destruct means tranfer funds to owner|
| `destroyAndTransfer` | Self destruct means tranfer funds to new wallet|
| `sendEther` | sends ether to particular address|
| `getBalance` | fetches balance of the contract wallet|


## Set Up

Setup Hardhat

```bash
npx hardhat init
```

## Deployment

Start the local node
```bash
npx hardhat node
```
Deploy
```bash
npx hardhat run --network localhost scripts/deploy.js
```

Network Config
```bash
ADD INFURA_API_KEY and your PRIVATE_KEY
```
On sepolia testnet
```bash
npx hardhat run --network sepolia scripts/deploy.js
```

### Contract Address on sepolia
```bash
0x9DF57AFA1E5C6386b51B609d32757eA2609edE66
```
For Fresh Testing you can use this Address
```bash
0x2850E09678157fE78154a1069C129e68Ad2b67Dd
```

## Testing
on local
```bash
npx hardhat test
```
on testnet
```bash
npx hardhat test --network sepolia
```
### Test Cases Passed

![Screenshot from 2024-02-17 22-00-53](https://github.com/akasharora963/smart-wallet/assets/45670997/0af33122-e5cd-4865-bdbe-32b8fc156d2a)



## Frontend
Made using React ,tailwindcss and Ethers.js
```bash
cd app
```
And Run
```bash
npm run start
```
### Frontend Preview
![Screenshot from 2024-02-17 21-57-37](https://github.com/akasharora963/smart-wallet/assets/45670997/846e4ea6-5501-4274-b0e4-7fbb2c52da24)







    


