import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Copy } from 'lucide-react';
import { TEMPLATE_VARIABLES } from './types';

interface VariableSelectorProps {
  onInsertVariable: (variableName: string) => void;
}

export const VariableSelector = ({ onInsertVariable }: VariableSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Code className="w-4 h-4" />
          Variables disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {TEMPLATE_VARIABLES.map((variable) => (
              <div
                key={variable.name}
                className="p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                onClick={() => onInsertVariable(variable.name)}
              >
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono">{`{{${variable.name}}}`}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInsertVariable(variable.name);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {variable.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
