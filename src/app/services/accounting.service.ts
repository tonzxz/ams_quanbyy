// src/app/services/accounting.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GeneralJournalEntry {
  entryNo: string;
  date: Date;
  description: string;
  debitTotal: number;
  creditTotal: number;
  transactions: JournalTransaction[];
}

export interface JournalTransaction {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface LedgerAccount {
  accountCode: string;
  accountName: string;
  debitTotal: number;
  creditTotal: number;
  balance: number;
  transactions: LedgerTransaction[];
}

export interface LedgerTransaction {
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  private journalEntries = new BehaviorSubject<GeneralJournalEntry[]>([]);
  private ledgerAccounts = new BehaviorSubject<LedgerAccount[]>([]);

  constructor() {}

  getJournalEntries() {
    return this.journalEntries.asObservable();
  }

  getLedgerAccounts() {
    return this.ledgerAccounts.asObservable();
  }

  generateAccountingEntries(journalVoucher: any) {
    // Generate journal entry
    const journalEntry: GeneralJournalEntry = {
      entryNo: `JE-${Date.now()}`,
      date: new Date(),
      description: `Journal entry for voucher ${journalVoucher.voucherNo}`,
      debitTotal: journalVoucher.totalAmountDue,
      creditTotal: journalVoucher.totalAmountDue,
      transactions: [
        ...journalVoucher.debitEntries.map((entry: { accountCode: string; accountName: string; amount: number }) => ({
          accountCode: entry.accountCode,
          accountName: entry.accountName,
          debit: entry.amount,
          credit: 0
        })),
        ...journalVoucher.creditEntries.map((entry: { accountCode: string; accountName: string; amount: number }) => ({
          accountCode: entry.accountCode,
          accountName: entry.accountName,
          debit: 0,
          credit: entry.amount
        }))
      ]
    };

    // Update journal entries
    const currentJournalEntries = this.journalEntries.value;
    this.journalEntries.next([...currentJournalEntries, journalEntry]);

    // Generate ledger entries
    const uniqueAccounts = new Set([
      ...journalVoucher.debitEntries.map((e: { accountCode: string }) => e.accountCode),
      ...journalVoucher.creditEntries.map((e: { accountCode: string }) => e.accountCode)
    ]);

    const currentLedgerAccounts = this.ledgerAccounts.value;
    const updatedLedgerAccounts = [...currentLedgerAccounts];

    uniqueAccounts.forEach(accountCode => {
      const accountEntries = journalVoucher.debitEntries
        .filter((e: { accountCode: string }) => e.accountCode === accountCode)
        .concat(journalVoucher.creditEntries.filter((e: { accountCode: string }) => e.accountCode === accountCode));

      const existingAccount = updatedLedgerAccounts.find((a: { accountCode: string }) => a.accountCode === accountCode);
      if (existingAccount) {
        // Update existing account
        const newTransaction: LedgerTransaction = {
          date: new Date(),
          description: `From voucher ${journalVoucher.voucherNo}`,
          debit: accountEntries.reduce((sum: number, e: { debit: number }) => sum + (e.debit || 0), 0),
          credit: accountEntries.reduce((sum: number, e: { credit: number }) => sum + (e.credit || 0), 0),
          balance: existingAccount.balance + 
            accountEntries.reduce((sum: number, e: { debit: number; credit: number }) => sum + (e.debit || 0) - (e.credit || 0), 0)
        };

        existingAccount.transactions.push(newTransaction);
        existingAccount.debitTotal += newTransaction.debit;
        existingAccount.creditTotal += newTransaction.credit;
        existingAccount.balance = newTransaction.balance;
      } else {
        // Create new account
        const newAccount: LedgerAccount = {
          accountCode,
          accountName: accountEntries[0].accountName,
          debitTotal: accountEntries.reduce((sum: number, e: { debit: number }) => sum + (e.debit || 0), 0),
          creditTotal: accountEntries.reduce((sum: number, e: { credit: number }) => sum + (e.credit || 0), 0),
          balance: accountEntries.reduce((sum: number, e: { debit: number; credit: number }) => sum + (e.debit || 0) - (e.credit || 0), 0),
          transactions: [{
            date: new Date(),
            description: `From voucher ${journalVoucher.voucherNo}`,
            debit: accountEntries.reduce((sum: number, e: { debit: number }) => sum + (e.debit || 0), 0),
            credit: accountEntries.reduce((sum: number, e: { credit: number }) => sum + (e.credit || 0), 0),
            balance: accountEntries.reduce((sum: number, e: { debit: number; credit: number }) => sum + (e.debit || 0) - (e.credit || 0), 0)
          }]
        };
        updatedLedgerAccounts.push(newAccount);
      }
    });

    this.ledgerAccounts.next(updatedLedgerAccounts);
  }

  clearAll() {
    this.journalEntries.next([]);
    this.ledgerAccounts.next([]);
  }
}