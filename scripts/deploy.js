// imports
const { ethers, run, network } = require("hardhat")
//async function
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("deploying contract.......")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  console.log(`deploying contract to: ${simpleStorage.address}`)
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }
  const currentValue = simpleStorage.retrieve()
  console.log(`current value is : ${currentValue}`)

  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
  console.log("verifying contract.....")
  try {
    await run("verify:verify", {
      address: contractAddress,
      contractArgumnets: args,
    })
  } catch (e) {
    if (e.message.toLowercase().includes("already verified")) {
      console.log("Already verified")
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
