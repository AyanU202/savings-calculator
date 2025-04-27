import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateCompoundInterest, formatCurrency } from '@/lib/calculators';

export default function BasicSavings() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    initialInvestment: 10000,
    monthlyContribution: 1000,
    annualInterestRate: 7,
    investmentPeriod: 10
  });
  
  const [results, setResults] = useState<{
    finalBalance: number;
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
    const { initialInvestment, monthlyContribution, annualInterestRate, investmentPeriod } = formData;
    
    // Validate inputs
    if (initialInvestment < 0 || monthlyContribution < 0 || annualInterestRate < 0 || investmentPeriod <= 0) {
      alert(t('validation.positiveValues'));
      return;
    }
    
    const result = calculateCompoundInterest(
      initialInvestment,
      monthlyContribution,
      annualInterestRate,
      investmentPeriod
    );
    
    setResults(result);
  };
  
  const chartData = results?.balanceHistory.map((balance, index) => ({
    year: index,
    balance
  })) || [];
  
  return (
    <div>
      <h2 className="text-xl text-primary font-semibold mb-6 text-center">{t('basicSavings.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div>
          <label htmlFor="initialInvestment" className="block text-sm text-gray-400 mb-1">
            {t('basicSavings.initialInvestment')}
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
          <label htmlFor="monthlyContribution" className="block text-sm text-gray-400 mb-1">
            {t('basicSavings.monthlyContribution')}
          </label>
          <Input
            id="monthlyContribution"
            name="monthlyContribution"
            type="number"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.monthlyContribution}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="annualInterestRate" className="block text-sm text-gray-400 mb-1">
            {t('basicSavings.annualInterestRate')}
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
          <label htmlFor="investmentPeriod" className="block text-sm text-gray-400 mb-1">
            {t('basicSavings.investmentPeriod')}
          </label>
          <Input
            id="investmentPeriod"
            name="investmentPeriod"
            type="number"
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.investmentPeriod}
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
          {t('basicSavings.calculate')}
        </Button>
      </div>
      
      {results && (
        <div className="mb-8">
          <h3 className="text-center mb-4 text-lg">{t('basicSavings.savingsGrowth')}</h3>
          <div className="h-64 mb-8">
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
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Balance']}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-gray-400 mb-2">{t('basicSavings.finalBalance')}</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.finalBalance)}
              </p>
            </div>
            
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-gray-400 mb-2">{t('basicSavings.totalContributions')}</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.totalContributions)}
              </p>
            </div>
            
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-gray-400 mb-2">{t('basicSavings.totalInterestEarned')}</h4>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.totalInterest)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
