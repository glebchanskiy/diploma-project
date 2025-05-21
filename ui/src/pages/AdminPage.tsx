import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Database, Settings, BarChart3, Import, Import as Export, Save } from 'lucide-react';
import KnowledgeGraph from '@/components/admin/KnowledgeGraph';

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Администрирование базы знаний</h1>
          <p className="text-muted-foreground">Управляйте и организуйте ваши знания</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9">
            <Import className="h-4 w-4 mr-2" />
            Импорт
          </Button>
          <Button variant="outline" className="h-9">
            <Export className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
          <Button className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Добавить фрагмент
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9">
          <Tabs defaultValue="graph">
            <TabsList className="grid grid-cols-3 mb-6 gap-2">
              <TabsTrigger value="graph">
                <Database className="h-4 w-4 mr-2" />
                База знаний
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Аналитика
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Настройки
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="graph" className="space-y-6">
              <div className="flex items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Искать в графе..."
                    className="pl-8 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <KnowledgeGraph />
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Analytics</CardTitle>
                  <CardDescription>Monitor usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки базы знаний</CardTitle>
                  <CardDescription>Поведения и настройки системы</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Порог доверия</Label>
                    <Input id="threshold" type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                    <p className="text-xs text-muted-foreground">
                      Минимальный уровень доверия, необходимый для перехода на должность человека-оператора.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="operators">Операторы</Label>
                    <Textarea 
                      id="operators" 
                      placeholder="email@example.com, another@example.com" 
                      className="min-h-20"
                      defaultValue="admin@example.com, support@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      Адреса электронной почты операторов, которые будут получать запросы при эскалации.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить настройки
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Подробности фрагмента</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Выбрать фаргмент в графе, чтобы просмотреть или изменить его.
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-xs">Название</Label>
                  <Input id="title" disabled placeholder="Выбрать фрагмент" />
                </div>
                
                <div>
                  <Label htmlFor="content" className="text-xs">Содержимое</Label>
                  <Textarea id="content" disabled placeholder="Выбрать фрагмент" className="h-24" />
                </div>
                
                <div>
                  <Label className="text-xs">Теги</Label>
                  <div className="flex flex-wrap gap-1 mt-1 p-2 border rounded-md min-h-10">
                    <Badge variant="secondary" className="text-xs">Выбрать фрагмент</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-4">
              <Button variant="outline" size="sm" disabled>
                Отмена
              </Button>
              <Button size="sm" disabled>
                <Save className="h-3 w-3 mr-1" />
                Сохранить
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Статистика</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Общее кол-во фрагментов</dt>
                  <dd className="font-medium">42</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Связи</dt>
                  <dd className="font-medium">78</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Запросов за сегодня</dt>
                  <dd className="font-medium">156</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Средняя уверенность</dt>
                  <dd className="font-medium">87%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Эскалаций на человека</dt>
                  <dd className="font-medium">12 (7.7%)</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}