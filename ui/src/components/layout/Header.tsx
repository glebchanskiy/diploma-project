import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Brain, User, Sun, Moon, Laptop, Menu, X } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm px-10">
      <div className=" w-full flex h-16 items-center py-4">
        <div className="flex items-center gap-2">
          {/* <Brain className="h-8 w-8 text-primary" /> */}
          <span className="hidden md:inline-block text-xl font-semibold">Обращения</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-10">
          <a 
            href="#/" 
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Главная
          </a>
          <a 
            href="#/history" 
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            История
          </a>
          <a 
            href="#/admin" 
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
           Администрирование
          </a>
        </nav>
        
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {theme === 'light' && <Sun className="min-h-5 min-w-5 " />}
                {theme === 'dark' && <Moon className="min-h-5 min-w-5 " />}
                {theme === 'system' && <Laptop className="min-h-5 min-w-5 " />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                Светлая
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                Тёмная
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Laptop className="h-4 w-4 mr-2" />
                Системная
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="min-h-5 min-w-5 text-white" />
          </Button>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-2 space-y-1">
            <a 
              href="#/" 
              className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </a>
            <a 
              href="#/history" 
              className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              История
            </a>
            <a 
              href="#/admin" 
              className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Администрирование
            </a>
          </div>
        </div>
      )}
    </header>
  );
}