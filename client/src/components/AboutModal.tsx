import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  
  return (
    <>
      <Button 
        variant="secondary" 
        className="bg-secondary/70 hover:bg-secondary text-white rounded-md" 
        onClick={() => setIsOpen(true)}
        size="sm"
      >
        {t('app.about')}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary font-semibold">
              {t('about.title')}
            </DialogTitle>
            <DialogDescription className="text-foreground opacity-90">
              {t('about.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2">
            <p className="mb-2">{t('about.features')}</p>
            <ul className="list-disc pl-5 mb-4">
              {t('about.featuresList', { returnObjects: true }).map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p className="mb-4">{t('about.conclusion')}</p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
            >
              {t('about.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
