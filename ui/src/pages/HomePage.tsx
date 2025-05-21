import QueryInput from '@/components/query/QueryInput';
import QueryStatus from '@/components/query/QueryStatus';
import NavigationVisualizer from '@/components/navigation/NavigationVisualizer';
import AnswerDisplay from '@/components/answer/AnswerDisplay';
import { useQuery } from '@/context/QueryContext';
import { Info } from 'lucide-react';

export default function HomePage() {
  const { queryStatus, navigationPath, answer } = useQuery();
  
  return (
    <div className="container py-8 space-y-8">
      <QueryInput />
      
      {!queryStatus && (
        <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
          <div className="max-w-md">
            <Info className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <h2 className="text-xl font-semibold mb-2">Добро пожаловать в Обращения</h2>
            <p>
              Задайте вопрос выше, и наша система будет проведёт поиск по базе знаний, чтобы найти самый точный ответ для вас.
            </p>
          </div>
        </div>
      )}
      
      {queryStatus && (
        <div className="space-y-6">
          <QueryStatus />
          
          {navigationPath && (
            <div className="grid grid-cols-1 gap-6">
              <NavigationVisualizer />
              {answer && <AnswerDisplay />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}