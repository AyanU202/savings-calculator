// Utility functions for financial calculations

/**
 * Formats a number to Indian currency format with ₹ symbol
 * @param amount - The number to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  // Convert to Indian numbering format (e.g., 1,00,000 instead of 100,000)
  const numStr = Math.round(amount).toString();
  let result = '';
  let count = 0;
  
  for (let i = numStr.length - 1; i >= 0; i--) {
    count++;
    result = numStr[i] + result;
    
    if (i !== 0) {
      if (count === 3 && numStr.length - count > 0) {
        result = ',' + result;
      } else if (count > 3 && (count - 3) % 2 === 0) {
        result = ',' + result;
      }
    }
  }
  
  return '₹' + result;
}

/**
 * Calculates compound interest with monthly contributions
 * @param principal - Initial investment amount
 * @param monthlyContribution - Monthly contribution amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Number of years
 * @returns Object with final balance, total contributions, interest earned, and balance history
 */
export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  let balance = principal;
  const balanceHistory = [balance];
  
  for (let i = 1; i <= months; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (i % 12 === 0) {
      balanceHistory.push(balance);
    }
  }
  
  const totalContributions = principal + (monthlyContribution * months);
  const totalInterest = balance - totalContributions;
  
  return {
    finalBalance: balance,
    totalContributions: totalContributions,
    totalInterest: totalInterest,
    balanceHistory: balanceHistory
  };
}

/**
 * Calculates required monthly contribution to reach a target amount
 * @param targetAmount - Target amount to reach
 * @param principal - Initial investment amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Number of years
 * @returns Object with required monthly contribution and balance history
 */
export function calculateRequiredContribution(
  targetAmount: number,
  principal: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  
  // Formula: PMT = (FV - PV*(1+r)^n) / (((1+r)^n - 1)/r)
  const futureValueOfPrincipal = principal * Math.pow(1 + monthlyRate, months);
  const requiredFuture = targetAmount - futureValueOfPrincipal;
  const annuityFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  
  const monthlyContribution = requiredFuture / annuityFactor;
  const contribution = Math.max(0, monthlyContribution);
  
  // Simulate growth to generate balance history
  const balanceHistory = simulateGrowth(principal, contribution, annualRate, years);
  const totalContributions = principal + (contribution * years * 12);
  const totalInterest = targetAmount - totalContributions;
  
  return {
    monthlyContribution: contribution,
    totalContributions,
    totalInterest,
    balanceHistory
  };
}

/**
 * Simulates the growth of an investment over time
 * @param principal - Initial investment amount
 * @param monthlyContribution - Monthly contribution amount
 * @param annualRate - Annual interest rate (as percentage)
 * @param years - Number of years
 * @returns Array of balances at the end of each year
 */
export function simulateGrowth(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number[] {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  let balance = principal;
  const balanceHistory = [balance];
  
  for (let i = 1; i <= months; i++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (i % 12 === 0) {
      balanceHistory.push(balance);
    }
  }
  
  return balanceHistory;
}
