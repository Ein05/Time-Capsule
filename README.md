Bitcoin-Backed Time Capsule Smart Contract
Overview
Purpose: A Clarity smart contract on the Stacks network to create trustless digital time capsules. Content (text or IPFS hashes) is locked until a specified block height or until the recipient meets conditions (e.g., paying STX). It leverages Stacks’ Proof-of-Transfer (PoX) for Bitcoin rewards and Clarity’s secure, decidable design.
Features:

Create time capsules with content, recipient, and unlock conditions (block height or STX payment).
Optional STX deposit for PoX stacking to earn Bitcoin rewards.
Recipient unlocks capsule by meeting conditions.
Creator can cancel capsule before locking.
Support for off-chain encryption for private content.
IPFS for large content storage (e.g., images).

Use Case: Personal milestones (letters to future self, wedding vows), digital heirlooms, or gamified treasure hunts.
Why Stacks:

Bitcoin integration via PoX for stacking rewards.
Clarity’s non-Turing-complete language ensures predictable, secure execution.
IPFS enables efficient off-chain storage.

Smart Contract Details
Data Structures

capsule-count: Tracks total capsules created.
capsules: Maps capsule IDs to details (creator, recipient, content, unlock height, STX amount, status).

Functions

create-capsule: Initializes capsule with content, recipient, unlock height, STX payment, and stacking option.
lock-capsule: Locks capsule, optionally depositing STX for PoX (mocked; needs production integration).
unlock-capsule: Recipient unlocks capsule by meeting conditions.
cancel-capsule: Creator cancels capsule before locking.
get-capsule: Retrieves capsule details (read-only).

Error Handling

Constants for errors: invalid recipients, unauthorized access, premature unlocking.

Security

Clarity ensures predictable execution.
Checks prevent unauthorized actions or invalid states.

Deployment on Stacks Testnet
Prerequisites

Install Clarinet: https://docs.stacks.co/clarinet/installation.
Install Hiro Web Wallet: https://www.hiro.so/wallet.
Get STX Testnet tokens: https://explorer.stacks.co/sandbox/faucet?chain=testnet.

Set Up Clarinet Project
bashclarinet new time-capsule-project && cd time-capsule-project
Add Contract

Create contracts/time-capsule.clar.
Copy Clarity code into the file.

Test Locally

Run devnet:

bashclarinet integrate

Write tests in tests/time-capsule_test.clar. Example:

clarity(begin
  (unwrap! (contract-call? .time-capsule create-capsule 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG u"Hello, future!" u1000 u10 true) (err u1))
  (unwrap! (contract-call? .time-capsule lock-capsule u0) (err u2))
  (ok true)
)
Configure Hiro Wallet

Open Hiro Wallet, select “Change Network,” and switch to Testnet.
Connect to Stacks Explorer Sandbox: https://explorer.stacks.co/sandbox.

Deploy to Testnet

Open Stacks Explorer Sandbox, select Testnet.
Paste time-capsule.clar code into Clarity editor.
Click “Deploy,” confirm in Hiro Wallet, and wait for mining.
Note contract address (e.g., ST12KGMZCKXERR1VG1TFEQQZ3VQXSMVVC3J31S604.time-capsule).

Interact with Contract

In Sandbox, go to “Call a Contract” tab.
Enter contract address and call functions (e.g., create-capsule).
Monitor transactions in Hiro Wallet or Stacks Explorer: https://explorer.stacks.co.

Notes

PoX Integration: Contract mocks stacking. For production, integrate PoX: https://docs.stacks.co/stacks-101/proof-of-transfer.
IPFS: Store large content on IPFS, save hash in content field.
Encryption: Encrypt private content off-chain, share key securely.
Unlock Height: Set unlock-height reasonably (e.g., 100 blocks ~ 1,000 minutes on Testnet).
Security: Audit and test edge cases before Mainnet deployment.

Resources

Clarity Language: https://docs.stacks.co/clarity/language-reference.
Stacks Documentation: https://docs.stacks.co.
Community: Stacks Discord or Forum.

Future Enhancements
Designed for the STACKS x RISE IN HACKATHON. Potential extensions:

Multi-recipient capsules.
NFT-based capsule collectibles.
Full PoX integration for Bitcoin rewards.

For questions or customizations, contact via Stacks Discord or Forum.
