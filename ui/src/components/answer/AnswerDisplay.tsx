import { useQuery } from '@/context/QueryContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, ThumbsUp, ThumbsDown, User, ExternalLink } from 'lucide-react';
import { Source } from '@/lib/types';

export default function AnswerDisplay() {
  const { answer, query, escalateToHuman } = useQuery();
  
  if (!answer) return null;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Ответ
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        <div className="mt-2 mb-4">
          <div className="bg-muted p-3 rounded-md mb-4">
            <p className="text-sm font-medium">Ваш вопрос:</p>
            <p className="italic text-muted-foreground">{query}</p>
          </div>
          
          <div className="prose dark:prose-invert prose-sm md:prose-base max-w-none">
            <p>{answer.content}</p>
          </div>
        </div>
        
        {answer.sources.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium mb-3">Источники:</h3>
              <div className="space-y-3">
                {answer.sources.map((source: Source) => (
                  <div key={source.id} className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{source.title}</h4>
                      <Badge source={source} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{source.snippet}</p>
                    {source.url && (
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Посмотреть
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row items-stretch md:items-center gap-4 pt-6">
        <div className="flex items-center gap-2">
          <p className="text-sm">Ответ был полезен?</p>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ThumbsUp className="min-h-4 min-w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ThumbsDown className="min-h-4 min-w-4" />
          </Button>
        </div>
        
        <Separator className="md:hidden" />
        
        <div className="md:ml-auto">
          <Button variant="outline" onClick={escalateToHuman} className="w-full md:w-auto">
            <User className="h-4 w-4 mr-2" />
            Обратиться к человеку
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function Badge({ source }: { source: Source }) {
  const getColor = (relevance: number) => {
    if (relevance >= 0.8) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (relevance >= 0.5) return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };
  
  return (
    <div className={`text-xs px-2 py-0.5 rounded-full ${getColor(source.relevance)}`}>
      {Math.round(source.relevance * 100)}% Релевантность
    </div>
  );
}