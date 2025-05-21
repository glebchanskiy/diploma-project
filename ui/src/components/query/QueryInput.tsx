import { useState } from 'react';
import { useQuery } from '@/context/QueryContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizontal, RefreshCw } from 'lucide-react';

export default function QueryInput() {
  const { submitQuery, isLoading, query } = useQuery();
  const [queryText, setQueryText] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      submitQuery(queryText);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Задайте вопрос</CardTitle>
        <CardDescription>
          Наша система проведёт поиск по базе знаний, чтобы найти самый точный ответ.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Как мне сбросить пароль?"
            className="min-h-32 p-4 text-base resize-none"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            {query && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setQueryText('')}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Новый запрос
              </Button>
            )}
            <Button 
              type="submit" 
              className="min-w-32 group"
              disabled={!queryText.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <SendHorizontal className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}