# ⏳ Time Capsule DApp (Local Demo)

Time Capsule DApp is a frontend prototype for creating and managing virtual "capsules" — secret messages that can be unlocked later, either by block height or STX payment. It simulates a Stacks blockchain experience using mock data, including wallet connection, transaction delays, and capsule lifecycle (create, lock, unlock, cancel).

This local app is built for testing UI/UX before connecting to real smart contracts on the Stacks Testnet.

<img width="1901" height="860" alt="image" src="https://github.com/user-attachments/assets/04887a8e-2dc2-454f-a85f-94f650d9fef5" />
<img width="1911" height="864" alt="image" src="https://github.com/user-attachments/assets/c9f235ff-e2a3-40d2-9626-9aea861033f0" />

## 🚀 Features

- 🔐 **Create Capsule** – Set recipient, secret content, unlock block, and STX requirement.
- 🔒 **Lock Capsule** – Owner can lock capsule for future release.
- 🔓 **Unlock Capsule** – Recipient can unlock if conditions are met.
- ❌ **Cancel Capsule** – Owner can cancel pending capsules.
- 💡 Simulates wallet connection & transaction behavior.
- 🧪 No blockchain required – purely local mock.

---

## 🧱 Tech Stack

- ⚛️ React + TypeScript
- 💅 Tailwind CSS
- 🧠 Mock logic in `useStacks.ts`
- 💾 In-memory capsule data (no database)

---





