import mongoose from 'mongoose';
import { Transaction, JournalEntry, Account } from '@/models';
import { aiService } from './ai.service';
import { AIAnomaly } from '@/models';

class AccountingService {
  /**
   * Processes an approved transaction and creates the corresponding Journal Entry.
   * Ensures Debit = Credit principle.
   */
  public async processTransaction(transactionId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findById(transactionId).session(session);
      if (!transaction) throw new Error('Transaction not found');
      if (transaction.status !== 'COMPLETED') throw new Error('Transaction is not completed yet');

      // Check if Journal Entry already exists
      const existingEntry = await JournalEntry.findOne({ transactionId }).session(session);
      if (existingEntry) {
        throw new Error('Journal Entry already exists for this transaction');
      }

      const amount = transaction.amount;
      const type = transaction.type;

      // Ensure we have relevant accounts
      let debitAccountId: mongoose.Types.ObjectId;
      let creditAccountId: mongoose.Types.ObjectId;

      // Very simplified accounting logic for the demo:
      // If INCOME: Debit Bank/Cash (Asset), Credit Revenue
      // If EXPENSE: Debit Expense, Credit Bank/Cash (Asset)
      
      const bankAccount = await Account.findOne({ code: '1100' }).session(session); // Assume 1100 is Cash/Bank
      const revenueAccount = await Account.findOne({ code: '4000' }).session(session); // Assume 4000 is General Revenue
      const expenseAccount = transaction.accountId || await Account.findOne({ code: '5000' }).session(session); // Assume 5000 is General Expense

      if (!bankAccount || !revenueAccount || !expenseAccount) {
        throw new Error('Required Chart of Accounts missing. Please ensure accounts 1100, 4000, 5000 are seeded.');
      }

      if (type === 'INCOME') {
        debitAccountId = bankAccount._id as mongoose.Types.ObjectId;
        creditAccountId = revenueAccount._id as mongoose.Types.ObjectId;
        
        // Update Account balances
        bankAccount.balance += amount;
        revenueAccount.balance += amount;
        await bankAccount.save({ session });
        await revenueAccount.save({ session });
      } else if (type === 'EXPENSE') {
        debitAccountId = expenseAccount._id as mongoose.Types.ObjectId;
        creditAccountId = bankAccount._id as mongoose.Types.ObjectId;
        
        bankAccount.balance -= amount;
        expenseAccount.balance += amount;
        await bankAccount.save({ session });
        await expenseAccount.save({ session });
      } else {
        throw new Error('Unsupported transaction type for automatic journal entry');
      }

      // Create Journal Entry
      const voucherNumber = `JV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const entry = new JournalEntry({
        voucherNumber,
        date: transaction.date,
        description: `Auto-generated entry for Transaction ${transaction._id}`,
        transactionId: transaction._id,
        lines: [
          { accountId: debitAccountId, type: 'DEBIT', amount },
          { accountId: creditAccountId, type: 'CREDIT', amount },
        ]
      });

      await entry.save({ session });

      // Run AI Anomaly Detection in background (or synchronously for demo)
      await this.runAnomalyDetection(transaction, session);

      await session.commitTransaction();
      session.endSession();

      return entry;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  private async runAnomalyDetection(transaction: any, session: mongoose.ClientSession) {
    // Get historical transactions for this type
    const history = await Transaction.find({ 
      type: transaction.type, 
      _id: { $ne: transaction._id } 
    }).limit(100).session(session);
    
    const anomalyResult = await aiService.detectAnomalies(transaction, history);
    
    if (anomalyResult.isAnomaly) {
      const anomalyRecord = new AIAnomaly({
        severity: anomalyResult.severity,
        transactionId: transaction._id,
        reason: anomalyResult.reason,
        expectedValue: anomalyResult.expectedValue,
        actualValue: anomalyResult.actualValue,
        recommendedAction: anomalyResult.recommendedAction,
      });
      await anomalyRecord.save({ session });
    }
  }
}

export const accountingService = new AccountingService();
