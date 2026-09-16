import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { 
  User, Department, Employee, Customer, Vendor, 
  Transaction, TransactionCategory, Account, Budget 
} from '../models/index';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected!');

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Employee.deleteMany({}),
    Customer.deleteMany({}),
    Vendor.deleteMany({}),
    Transaction.deleteMany({}),
    TransactionCategory.deleteMany({}),
    Account.deleteMany({}),
    Budget.deleteMany({})
  ]);

  console.log('Seeding Accounts...');
  const accounts = await Account.insertMany([
    { code: '1100', name: 'Cash and Bank', type: 'ASSET', balance: 500000 },
    { code: '1200', name: 'Accounts Receivable', type: 'ASSET', balance: 0 },
    { code: '2100', name: 'Accounts Payable', type: 'LIABILITY', balance: 0 },
    { code: '3000', name: 'Owner Equity', type: 'EQUITY', balance: 500000 },
    { code: '4000', name: 'Sales Revenue', type: 'REVENUE', balance: 0 },
    { code: '5000', name: 'General Expenses', type: 'EXPENSE', balance: 0 },
    { code: '5100', name: 'Technology Expenses', type: 'EXPENSE', balance: 0 },
    { code: '5200', name: 'Marketing Expenses', type: 'EXPENSE', balance: 0 },
  ]);

  console.log('Seeding Departments...');
  const depts = await Department.insertMany([
    { name: 'Engineering', managerName: 'Rahul Sharma', budget: 1000000 },
    { name: 'Marketing', managerName: 'Priya Singh', budget: 500000 },
    { name: 'Sales', managerName: 'Amit Patel', budget: 800000 },
    { name: 'Finance', managerName: 'Neha Gupta', budget: 200000 },
    { name: 'HR', managerName: 'Vikram Mehta', budget: 150000 },
  ]);

  console.log('Seeding Users...');
  await User.create([
    { name: 'Admin User', email: 'admin@financeaiml.com', passwordHash: 'hashed_password_mock', role: 'ADMIN' },
    { name: 'Finance Manager', email: 'manager@financeaiml.com', passwordHash: 'hashed_password_mock', role: 'FINANCE_MANAGER' },
  ]);

  console.log('Seeding Customers and Vendors...');
  const customers = await Customer.insertMany([
    { name: 'TechCorp India', company: 'TechCorp', revenue: 0, outstandingAmount: 0 },
    { name: 'Global Retailers', company: 'Global Retail', revenue: 0, outstandingAmount: 0 },
  ]);

  const vendors = await Vendor.insertMany([
    { name: 'AWS India', company: 'Amazon Web Services', totalTransactions: 0, totalAmount: 0 },
    { name: 'WeWork', company: 'WeWork India', totalTransactions: 0, totalAmount: 0 },
  ]);

  console.log('Seeding Transaction Categories...');
  const categories = await TransactionCategory.insertMany([
    { name: 'Cloud Services', type: 'EXPENSE' },
    { name: 'Office Rent', type: 'EXPENSE' },
    { name: 'Client Revenue', type: 'INCOME' },
    { name: 'Consulting', type: 'INCOME' },
  ]);

  console.log('Seeding historical transactions for AI modeling...');
  const transactions = [];
  const now = new Date();
  
  // Create 60 days of history
  for (let i = 60; i >= 0; i--) {
    const txDate = new Date(now);
    txDate.setDate(txDate.getDate() - i);
    
    // Revenue
    if (i % 3 === 0) {
      transactions.push({
        date: txDate,
        type: 'INCOME',
        amount: 50000 + (Math.random() * 20000),
        description: 'Monthly Retainer',
        status: 'COMPLETED',
        categoryId: categories[2]._id,
        customerId: customers[0]._id,
        accountId: accounts.find(a => a.code === '4000')?._id,
        departmentId: depts[2]._id // Sales
      });
    }

    // Expense
    if (i % 7 === 0) {
      transactions.push({
        date: txDate,
        type: 'EXPENSE',
        amount: 20000 + (Math.random() * 5000), // Cloud usually 20k-25k
        description: 'AWS Cloud Hosting',
        status: 'COMPLETED',
        categoryId: categories[0]._id,
        vendorId: vendors[0]._id,
        accountId: accounts.find(a => a.code === '5100')?._id,
        departmentId: depts[0]._id // Engineering
      });
    }
  }

  // Add an intentional anomaly (High AWS Bill recently)
  transactions.push({
    date: new Date(),
    type: 'EXPENSE',
    amount: 95000, // Spike from 20k to 95k
    description: 'AWS Cloud Hosting (Traffic Spike)',
    status: 'COMPLETED',
    categoryId: categories[0]._id,
    vendorId: vendors[0]._id,
    accountId: accounts.find(a => a.code === '5100')?._id,
    departmentId: depts[0]._id
  });

  await Transaction.insertMany(transactions);

  console.log('Done seeding!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
