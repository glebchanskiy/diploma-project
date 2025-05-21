import { useQuery } from '@/context/QueryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function QueryStatus() {
  const { queryStatus } = useQuery();

  if (!queryStatus) return null;

  const getStatusDetails = () => {
    switch (queryStatus.status) {
      case 'pending':
        return {
          label: 'Ожидание',
          icon: <Clock className="h-5 w-5" />,
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
          description: 'Ваш запрос ожидает обработки.',
        };
      case 'processing':
        return {
          label: 'Обработка',
          icon: <HelpCircle className="h-5 w-5" />,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
          description: 'Ваш запрос обрабатывается нашей системой знаний.',
        };
      case 'completed':
        return {
          label: 'Завершено',
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          description: 'Ваш запрос успешно обработан.',
        };
      case 'escalated':
        return {
          label: 'Передано оператору',
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          description: 'Ваш запрос передан оператору-человеку.',
        };
      default:
        return {
          label: 'Неизвестно',
          icon: <HelpCircle className="h-5 w-5" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
          description: 'Статус неизвестен.',
        };
    }
  };

  const { label, icon, color, description } = getStatusDetails();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Статус запроса</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{label}</h3>
              <Badge variant="outline" className="text-xs font-normal">
                ID: {queryStatus.id.substring(0, 6)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Последнее обновление: {queryStatus.updatedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
