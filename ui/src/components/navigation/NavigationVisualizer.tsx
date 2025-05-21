import { useEffect, useState } from 'react';
import { useQuery } from '@/context/QueryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { NavigationStep } from '@/lib/types';
import { CheckCircle2, CircleDot, Circle, ArrowRight } from 'lucide-react';

export default function NavigationVisualizer() {
  const { navigationPath } = useQuery();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (navigationPath) {
      const completedSteps = navigationPath.steps.filter(step => step.status === 'completed').length;
      const totalSteps = navigationPath.steps.length;
      
      // Add current step as partial progress if active
      const activeStep = navigationPath.steps.find(step => step.status === 'active');
      const activeStepValue = activeStep ? 1 : 0;
      
      const progressValue = ((completedSteps + (activeStepValue * 0.5)) / totalSteps) * 100;
      
      // Animate the progress
      setProgress(0);
      const timer = setTimeout(() => setProgress(progressValue), 100);
      return () => clearTimeout(timer);
    }
  }, [navigationPath]);
  
  if (!navigationPath) return null;
  
  const renderStepIcon = (step: NavigationStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'active':
        return <CircleDot className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'pending':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Выполнение поиска</span>
          <Badge variant="outline" className="ml-2">
            {Math.round(progress)}% Завершено
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Progress value={progress} className="h-2 mb-6" />
        
        <div className="space-y-6">
          {navigationPath.steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step connector line */}
              {index < navigationPath.steps.length - 1 && (
                <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-border" 
                     style={{ transform: 'translateX(-50%)' }} />
              )}
              
              <div className="flex items-start gap-4">
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  {renderStepIcon(step)}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className={`font-medium ${step.status === 'active' ? 'text-blue-500' : ''}`}>
                      {step.label}
                    </h3>
                    
                    {step.status === 'active' && (
                      <Badge className="bg-blue-500">В процессе</Badge>
                    )}
                    
                    {step.status === 'completed' && step.confidence > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Уверенность: {Math.round(step.confidence * 100)}%
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  
                  {/* Next step arrow for active step */}
                  {step.status === 'active' && index < navigationPath.steps.length - 1 && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2 gap-1">
                      <span>Далее:</span> 
                      <ArrowRight className="h-3 w-3" />
                      <span>{navigationPath.steps[index + 1].label}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}