import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Maximize2, Minimize2, ZoomIn, ZoomOut, Plus, Trash } from 'lucide-react';

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  
  // Mock graph data for visualization
const nodes = [
  { id: 'dnd', label: 'D&D', x: 400, y: 100, radius: 30, color: '#3B82F6' },

  // Primary Categories
  { id: 'rules', label: 'Rules', x: 100, y: 250, radius: 25, color: '#8B5CF6' },
  { id: 'classes', label: 'Classes', x: 250, y: 250, radius: 25, color: '#8B5CF6' },
  { id: 'races', label: 'Races', x: 400, y: 250, radius: 25, color: '#8B5CF6' },
  { id: 'spells', label: 'Spells', x: 550, y: 250, radius: 25, color: '#8B5CF6' },
  { id: 'equipment', label: 'Equipment', x: 700, y: 250, radius: 25, color: '#8B5CF6' },
  { id: 'monsters', label: 'Monsters', x: 850, y: 250, radius: 25, color: '#8B5CF6' },
  { id: 'mechanics', label: 'Mechanics', x: 1000, y: 250, radius: 25, color: '#8B5CF6' },

  // Rules Decomposition (Simplified)
  { id: 'core_rules', label: 'Core Rules', x: 50, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'basic_rules', label: 'Basic Rules', x: 150, y: 400, radius: 20, color: '#0EA5E9' },

  // Classes Decomposition (Simplified)
  { id: 'martial_classes', label: 'Martial', x: 200, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'magical_classes', label: 'Magical', x: 300, y: 400, radius: 20, color: '#0EA5E9' },

  // Races Decomposition (Simplified)
  { id: 'common_races', label: 'Common', x: 350, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'uncommon_races', label: 'Uncommon', x: 450, y: 400, radius: 20, color: '#0EA5E9' },

  // Spells Decomposition (Simplified)
  { id: 'spell_levels', label: 'Spell Levels', x: 500, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'spell_schools', label: 'Spell Schools', x: 600, y: 400, radius: 20, color: '#0EA5E9' },

  // Equipment Decomposition (Simplified)
  { id: 'weapons', label: 'Weapons', x: 650, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'armor', label: 'Armor', x: 750, y: 400, radius: 20, color: '#0EA5E9' },

  // Monsters Decomposition (Simplified)
  { id: 'monster_types', label: 'Types', x: 800, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'challenge_ratings', label: 'CR', x: 900, y: 400, radius: 20, color: '#0EA5E9' },

  // Mechanics Decomposition (Simplified)
  { id: 'combat', label: 'Combat', x: 950, y: 400, radius: 20, color: '#0EA5E9' },
  { id: 'magic_system', label: 'Magic System', x: 1050, y: 400, radius: 20, color: '#0EA5E9' },
];

const edges = [
  // Connect the root to main categories
  { from: 'dnd', to: 'rules' },
  { from: 'dnd', to: 'classes' },
  { from: 'dnd', to: 'races' },
  { from: 'dnd', to: 'spells' },
  { from: 'dnd', to: 'equipment' },
  { from: 'dnd', to: 'monsters' },
  { from: 'dnd', to: 'mechanics' },

  // Rules decomposition
  { from: 'rules', to: 'core_rules' },
  { from: 'rules', to: 'basic_rules' },

  // Classes decomposition
  { from: 'classes', to: 'martial_classes' },
  { from: 'classes', to: 'magical_classes' },

  // Races decomposition
  { from: 'races', to: 'common_races' },
  { from: 'races', to: 'uncommon_races' },

  // Spells decomposition
  { from: 'spells', to: 'spell_levels' },
  { from: 'spells', to: 'spell_schools' },

  // Equipment decomposition
  { from: 'equipment', to: 'weapons' },
  { from: 'equipment', to: 'armor' },

  // Monsters decomposition
  { from: 'monsters', to: 'monster_types' },
  { from: 'monsters', to: 'challenge_ratings' },

  // Mechanics decomposition
  { from: 'mechanics', to: 'combat' },
  { from: 'mechanics', to: 'magic_system' },
];

  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const adjustZoom = (delta: number) => {
    setZoomLevel(prev => {
      const newZoom = prev + delta;
      return Math.max(0.5, Math.min(2, newZoom));
    });
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw edges
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#94a3b8';
      
      edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x * zoomLevel, fromNode.y * zoomLevel);
          ctx.lineTo(toNode.x * zoomLevel, toNode.y * zoomLevel);
          ctx.stroke();
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Node circle
        ctx.beginPath();
        ctx.arc(
          node.x * zoomLevel, 
          node.y * zoomLevel, 
          node.radius * zoomLevel, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 * zoomLevel}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x * zoomLevel, node.y * zoomLevel + 4 * zoomLevel);
      });
    };
    
    drawGraph();
    
    // Handle canvas resize on fullscreen toggle
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      drawGraph();
    });
    
    resizeObserver.observe(canvas);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [nodes, edges, zoomLevel, isFullscreen]);
  
  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50" : "w-full h-[500px]"}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Граф знаний
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-46 h-8">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все фрагменты</SelectItem>
              <SelectItem value="accounts">Раздел правил</SelectItem>
              <SelectItem value="billing">Раздел истории</SelectItem>
              <SelectItem value="support">Раздел инструкций</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="min-h-8 min-w-8" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="min-h-4 min-w-4" /> : <Maximize2 className="min-h-4 min-w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative p-0 h-full">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-move"
          width={800}
          height={500}
        />
        
        <div className="absolute bottom-4 right-4 flex flex-row gap-2">
          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => adjustZoom(0.1)}>
            <ZoomIn className="min-h-4 min-w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => adjustZoom(-0.1)}>
            <ZoomOut className="min-h-4 min-w-4" />
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Button size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            Добавить фрагмент
          </Button>
          <Button variant="destructive" size="sm" className="h-8">
            <Trash className="h-4 w-4 mr-1" />
            Удалить
          </Button>
        </div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className="bg-background">
            {nodes.length} Фрагменты
          </Badge>
          <Badge variant="outline" className="bg-background">
            {edges.length} Связи
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}