import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="w-full flex flex-col md:flex-row items-center justify-between py-8 md:h-16 md:py-0 gap-4 px-10">
        <div className="flex items-center gap-2">
          {/* <Brain className="h-5 w-5 text-primary" /> */}
          <span className="text-sm font-medium">Обращения</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Все права защищены.
        </p>
        
        <div className="flex items-center gap-4">
          <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Политика конфиденциальности
          </a>
          <a href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Условия использования
          </a>
          <a href="/support" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Поддержка
          </a>
        </div>
      </div>
    </footer>
  );
}