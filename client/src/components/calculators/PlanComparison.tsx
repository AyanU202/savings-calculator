import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { calculateCompoundInterest, formatCurrency } from '@/lib/calculators';

export default function PlanComparison() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    planA: {
      annualInterestRate: 7,
      initialInvestment: 10000,
      monthlyContribution: 1000,
    },
    planB: {
      annualInterestRate: 9,
      initialInvestment: 10000,
      monthlyContribution: 1000,
    },
    comparisonPeriod: 10
  });
  
  const [results, setResults] = useState<{
    planA: {
      finalBalance: number;
      totalContributions: number;
      totalInterest: number;
      balanceHistory: number[];
    };
    planB: {
      finalBalance: number;
      totalContributions: number;
      totalInterest: number;
      balanceHistory: number[];
    };
    difference: number;
    percentageDiff: number;
  } | null>(null);
  
  const handleInputChange = (plan: 'planA' | 'planB', field: string, value: number) => {
    setFormData({
      ...formData,
      [plan]: {
        ...formData[plan],
        [field]: value
      }
    });
  };

  const handlePeriodChange = (value: number[]) => {
    setFormData({
      ...formData,
      comparisonPeriod: value[0]
    });
  };
  
  const handleCalculate = () => {
    const { planA, planB, comparisonPeriod } = formData;
    
    // Validate inputs
    if (
      planA.annualInterestRate < 0 || planA.initialInvestment < 0 || planA.monthlyContribution < 0 ||
      planB.annualInterestRate < 0 || planB.initialInvestment < 0 || planB.monthlyContribution < 0 ||
      comparisonPeriod <= 0
    ) {
      alert(t('validation.positiveValues'));
      return;
    }
    
    const resultA = calculateCompoundInterest(
      planA.initialInvestment,
      planA.monthlyContribution,
      planA.annualInterestRate,
      comparisonPeriod
    );
    
    const resultB = calculateCompoundInterest(
      planB.initialInvestment,
      planB.monthlyContribution,
      planB.annualInterestRate,
      comparisonPeriod
    );
    
    // Calculate difference
    const difference = resultB.finalBalance - resultA.finalBalance;
    const percentageDiff = (difference / resultA.finalBalance) * 100;
    
    setResults({
      planA: resultA,
      planB: resultB,
      difference,
      percentageDiff
    });
  };
  
  const chartData = results ? Array.from({ length: formData.comparisonPeriod + 1 }, (_, i) => ({
    year: i,
    planA: results.planA.balanceHistory[i] || 0,
    planB: results.planB.balanceHistory[i] || 0,
  })) : [];
  
  return (
    <div>
      <h2 className="text-xl text-primary font-semibold mb-6 text-center">{t('planComparison.title')}</h2>
      
      <div className="mb-6">
        <h3 className="text-primary text-lg mb-4">{t('planComparison.planASettings')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="planA-rate" className="block text-sm text-gray-400 mb-1">
              {t('planComparison.annualInterestRate')}
            </label>
            <Input
              id="planA-rate"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={formData.planA.annualInterestRate}
              onChange={(e) => handleInputChange('planA', 'annualInterestRate', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <label htmlFor="planA-initial" className="block text-sm text-gray-400 mb-1">
              {t('planComparison.initialInvestment')}
            </label>
            <Input
              id="planA-initial"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={formData.planA.initialInvestment}
              onChange={(e) => handleInputChange('planA', 'initialInvestment', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <label htmlFor="planA-monthly" className="block text-sm text-gray-400 mb-1">
              {t('planComparison.monthlyContribution')}
            </label>
            <Input
              id="planA-monthly"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={formData.planA.monthlyContribution}
              onChange={(e) => handleInputChange('planA', 'monthlyContribution', parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-primary text-lg mb-4">{t('planComparison.planBSettings')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="planB-rate" className="block text-sm text-gray-400 mb-1">
              {t('planComparison.annualInterestRate')}
            </label>
            <Input
              id="planB-rate"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={formData.planB.annualInterestRate}
              onChange={(e) => handleInputChange('planB', 'annualInterestRate', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <label htmlFor="planB-initial" className="block text-sm text-gray-400 mb-1">
              {t('planComparison.initialInvestment')}
            </label>
            <Input
              id="planB-initial"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={formData.planB.initialInvestment}
              onChange={(e) => handleInputChange('planB', 'initialInvestment', parseFloat(e.target.value))}
            />
          </div>
          
          <div>
            <label htmlFor="planB-monthly" className="block text-sm text-gray-400 mb-1">
              {t('planComparison.monthlyContribution')}
            </label>
            <Input
              id="planB-monthly"
              type="number"
              className="bg-gray-800 border-gray-700 text-white"
              value={formData.planB.monthlyContribution}
              onChange={(e) => handleInputChange('planB', 'monthlyContribution', parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-primary text-lg mb-4">{t('planComparison.commonSettings')}</h3>
        <div>
          <label htmlFor="compare-years" className="block text-sm text-gray-400 mb-1">
            {t('planComparison.comparisonPeriod')}
          </label>
          <div className="flex items-center gap-4">
            <Slider
              id="compare-years"
              min={1}
              max={30}
              step={1}
              value={[formData.comparisonPeriod]}
              onValueChange={handlePeriodChange}
              className="w-full h-2 bg-gray-700"
            />
            <span className="text-white min-w-[2rem] text-center">{formData.comparisonPeriod}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <Button 
          variant="secondary" 
          onClick={handleCalculate}
          className="bg-secondary hover:bg-blue-600 text-white"
        >
          {t('planComparison.comparePlans')}
        </Button>
      </div>
      
      {results && (
        <div className="mb-4">
          <h3 className="text-center mb-4 text-lg">{t('planComparison.planComparisonOverTime')}</h3>
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
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <Line 
                  type="monotone" 
                  name={t('planComparison.planA')}
                  dataKey="planA" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  name={t('planComparison.planB')}
                  dataKey="planB" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border-l-4 border-primary p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-blue-400 mb-2">{t('planComparison.planA')}</h4>
              <p className="text-sm text-gray-400 mb-1">{t('planComparison.finalBalance')}</p>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.planA.finalBalance)}
              </p>
            </div>
            
            <div className="border-l-4 border-yellow-500 p-4 bg-gray-800/50 rounded-r-md">
              <h4 className="text-yellow-400 mb-2">{t('planComparison.planB')}</h4>
              <p className="text-sm text-gray-400 mb-1">{t('planComparison.finalBalance')}</p>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(results.planB.finalBalance)}
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 p-4 bg-gray-800/50 rounded-r-md">
              <p className="text-sm text-gray-400 mb-1">{t('planComparison.differenceInFinalBalance')}</p>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(Math.abs(results.difference))}
              </p>
              <p className={`text-sm ${results.difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {results.difference >= 0 ? '+' : ''}{results.percentageDiff.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
