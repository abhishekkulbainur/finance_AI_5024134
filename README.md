<div align="center">
  
  # 🚀 FinAI: The Autonomous Financial Engine
  
  **An AI-Powered Double-Entry Accounting System Built for the Future**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

  *Say goodbye to manual bookkeeping and hello to autonomous financial management.*
</div>

---

## 🧠 What is FinAI?

FinAI isn't just another CRUD expense tracker—it's a **fully autonomous financial brain**. Designed to mimic the strict principles of double-entry accounting while leveraging the power of Artificial Intelligence, FinAI automates the entire lifecycle of a transaction. 

From the moment an invoice is uploaded, our AI takes over: extracting line items, categorizing expenses, updating the General Ledger with perfectly balanced debits and credits, and monitoring your financial health for anomalies.

## ✨ Features That Make You Go *Wow*

- **🤖 AI Invoice Processing (OCR Mock):** Upload an invoice and watch the AI instantly extract vendors, dates, line items, taxes, and totals. 
- **⚖️ Automated Double-Entry Ledger:** Total Debit = Total Credit. Always. When you approve a transaction, the engine automatically routes the funds across your Chart of Accounts (e.g., Debiting Expenses and Crediting Cash) and generates an immutable Journal Entry.
- **🚨 Statistical Anomaly Detection:** The AI acts as your personal auditor. Using Z-score statistical deviations, it continuously monitors your spending patterns and immediately flags suspicious activity (e.g., *"Why did your AWS bill spike by 300% this month?"*).
- **📈 Predictive Forecasting & Insights:** Uses Moving Average models to forecast next month's revenue and expenses, offering strategic business insights to keep you in the green.
- **🎨 Stunning, Real-Time Dashboards:** Built with Tailwind CSS, shadcn/ui, and Recharts to provide a gorgeous, interactive, and seamless User Experience.

## 🏗️ Architecture

- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Recharts.
- **Backend:** Next.js Server Actions, Node.js.
- **Database:** MongoDB (using Mongoose schemas for complex relation mapping between Accounts, Invoices, Transactions, and Journal Entries).
- **AI Abstraction:** The AI Service is designed via an abstraction layer. Currently running on deterministic, local statistical models (so you don't have to pay for API keys to test it), but instantly swappable with AWS Textract or OpenAI for production environments.

## 🛠️ Quick Start Guide

Ready to spin up the engine?

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/abhishekkulbainur/finance_AI_5024134.git
cd finance_AI_5024134
npm install
\`\`\`

### 2. Configure Environment

Create a \`.env.local\` file in the root directory and add your MongoDB connection string:

\`\`\`env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finai
\`\`\`

### 3. Seed the Database (Highly Recommended)

Populate the database with a Chart of Accounts, historical transactions, and an intentional anomaly to see the AI in action!

\`\`\`bash
npx tsx src/scripts/seed.ts
\`\`\`

### 4. Ignite the Engines

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Test Drive the System

1. **The Dashboard:** Notice the "AWS Bill Spike" alert triggered by the AI anomaly detector.
2. **AI Invoice Processing:** Go to \`/invoices\`, click "Select File", and upload any dummy image. Watch the AI instantly mock-extract the data.
3. **Approve & Automate:** Click "Approve & Pay" on the pending invoice.
4. **General Ledger Magic:** Head over to \`/accounting\` and marvel at how the system automatically generated a balanced Debit/Credit Journal Entry for that payment!

---

<div align="center">
  <b>Built with ❤️ and ☕ by AK</b>
</div>
