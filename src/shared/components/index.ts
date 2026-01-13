/**
 * Shared Components - Composants UI réutilisables (Design System)
 * Re-export depuis shadcn/ui et composants custom génériques
 */

// ===== SHADCN/UI PRIMITIVES =====
export { Button, buttonVariants } from '@/components/ui/button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
export { Input } from '@/components/ui/input';
export { Label } from '@/components/ui/label';
export { Textarea } from '@/components/ui/textarea';
export { Badge } from '@/components/ui/badge';
export { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export { Progress } from '@/components/ui/progress';
export { Skeleton } from '@/components/ui/skeleton';
export { Separator } from '@/components/ui/separator';
export { Switch } from '@/components/ui/switch';
export { Slider } from '@/components/ui/slider';
export { Checkbox } from '@/components/ui/checkbox';
export { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// ===== NAVIGATION & LAYOUT =====
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// ===== FEEDBACK =====
export { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
export { useToast, toast } from '@/hooks/use-toast';

// ===== FORMS =====
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// ===== DATA DISPLAY =====
export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
