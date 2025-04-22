import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AboutModal from '@/components/AboutModal';
import BasicSavings from '@/components/calculators/BasicSavings';
import GoalBasedSavings from '@/components/calculators/GoalBasedSavings';
import PlanComparison from '@/components/calculators/PlanComparison';

export default function Home() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('basic');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <header className="bg-primary rounded-lg p-6 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          {t('app.title')}
        </h1>
        <LanguageSwitcher />
      </header>
      
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">{t('app.basicSavings')}</TabsTrigger>
          <TabsTrigger value="goal">{t('app.goalBasedSavings')}</TabsTrigger>
          <TabsTrigger value="compare">{t('app.planComparison')}</TabsTrigger>
        </TabsList>
        
        {/* Calculator Container */}
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <TabsContent value="basic">
            <BasicSavings />
          </TabsContent>
          
          <TabsContent value="goal">
            <GoalBasedSavings />
          </TabsContent>
          
          <TabsContent value="compare">
            <PlanComparison />
          </TabsContent>
          
          <div className="text-center text-sm text-gray-500 mt-8">
            {t('app.footer')}
            <div className="mt-2">
              <AboutModal />
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
