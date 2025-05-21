import { useQuery } from '@/context/QueryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle, ChevronRight, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'

function formatSourcesEnding(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "источник";
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "источника";
  } else {
    return "источников";
  }
}

export default function HistoryPage() {
  const { queryHistory } = useQuery();
  
  if (queryHistory.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center p-12 text-center text-muted-foreground">
          <div className="max-w-md">
            <Clock className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <h2 className="text-xl font-semibold mb-2">Нет истории запросов</h2>
            <p>Ваша история запросов появится здесь, как только вы начнете задавать вопросы.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'escalated':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="container py-8 w-full mx-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">История запросов</h1>
          <p className="text-muted-foreground">Просмотр и управление вашими предыдущими обращениями</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить историю
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Недавние запросы</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y px-2 py-5">
              {queryHistory.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-muted/50 w-[700px]">
                  <div className="flex items-start justify-between gap-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status.status)}
                        <p className="font-medium">{entry.query}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(entry.timestamp), 'd MMM, yyyy HH:mm', { locale: ru })}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {entry.answer?.sources.length || 0} {formatSourcesEnding(entry.answer?.sources.length || 0)}
                        </Badge>
                        {entry.answer && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(entry.answer.confidence * 100)}% уверенности
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className='group'>
                      <ChevronRight className="min-h-4 min-w-4 text-white group-hover:text-black" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}