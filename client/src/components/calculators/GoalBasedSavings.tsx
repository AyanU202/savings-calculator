import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateRequiredContribution, formatCurrency } from '@/lib/calculators';

export default function GoalBasedSavings() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    targetAmount: 200000,
    initialInvestment: 10000,
    annualInterestRate: 7,
    timePeriod: 10
  });
  
  const [results, setResults] = useState<{
    monthlyContribution: number;
    totalContributions: number;
    totalInterest: number;
    balanceHistory: number[];
  } | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };
  
  const handleCalculate = () => {
    const { targetAmount, initialInvestment, annualInterestRate, timePeriod } = formData;
    
    // Validate inputs
    if (targetAmount <= 0 || initialInvestment < 0 || annualInterestRate < 0 || timePeriod <= 0) {
      alert(t('validation.targetAmountValid'));
      return;
    }
    
    const result = calculateRequiredContribution(
      targetAmount,
      initialInvestment,
      annualInterestRate,
      timePeriod
    );
    
    setResults(result);
  };
  
  const chartData = results?.balanceHistory.map((balance, index) => ({
    year: index,
    balance,
    target: formData.targetAmount
  })) || [];
  
  return (
    <div>
      <h2 className="text-xl text-primary font-semibold mb-6 text-center">{t('goalBasedSavings.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label htmlFor="targetAmount" className="block text-sm text-gray-400 mb-1">
            {t('goalBasedSavings.targetAmount')}
          </label>
          <Input
            id="targetAmount"
            name="targetAmount"
            type="number"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.targetAmount}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="initialInvestment" className="block text-sm text-gray-400 mb-1">
            {t('goalBasedSavings.initialInvestment')}
          </label>
          <Input
            id="initialInvestment"
            name="initialInvestment"
            type="number"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.initialInvestment}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="annualInterestRate" className="block text-sm text-gray-400 mb-1">
            {t('goalBasedSavings.annualInterestRate')}
          </label>
          <Input
            id="annualInterestRate"
            name="annualInterestRate"
            type="number"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.annualInterestRate}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="timePeriod" className="block text-sm text-gray-400 mb-1">
            {t('goalBasedSavings.timePeriod')}
          </label>
          <Input
            id="timePeriod"
            name="timePeriod"
            type="number"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.timePeriod}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <Button 
          variant="secondary" 
          onClick={handleCalculate}
          className="bg-secondary hover:bg-blue-600 text-white"
        >
          {t('goalBasedSavings.calculate')}
        </Button>
      </div>
      
      {results && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-gray-400 mb-2">{t('goalBasedSavings.requiredMonthlyContribution')}</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.monthlyContribution)}
              </p>
            </div>
            
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-gray-400 mb-2">{t('goalBasedSavings.totalContributions')}</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.totalContributions)}
              </p>
            </div>
            
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-gray-400 mb-2">{t('goalBasedSavings.totalInterestEarned')}</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.totalInterest)}
              </p>
            </div>
          </div>
          
          <h3 className="text-center mb-4 text-lg">{t('goalBasedSavings.progressTowardsGoal')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="year" 
                  label={{ 
                    value: 'Year', 
                    position: 'insideBottom', 
                    offset: -5,
                    fill: 'rgba(255, 255, 255, 0.7)'
                  }} 
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} 
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <Line 
                  type="monotone" 
                  name={t('goalBasedSavings.balance')}
                  dataKey="balance" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  name={t('goalBasedSavings.target')}
                  dataKey="target" 
                  stroke="rgba(220, 53, 69, 0.8)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
