
import React, { useState } from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, UserPlus, Filter, MoreHorizontal, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TeamManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      department: 'Marketing',
      role: 'Manager',
      status: 'active',
      lastActive: 'Aujourd\'hui'
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      email: 'thomas.dubois@example.com',
      department: 'Développement',
      role: 'Développeur senior',
      status: 'active',
      lastActive: 'Hier'
    },
    {
      id: 3,
      name: 'Camille Leroy',
      email: 'camille.leroy@example.com',
      department: 'RH',
      role: 'Responsable RH',
      status: 'active',
      lastActive: 'Il y a 3 jours'
    },
    {
      id: 4,
      name: 'Lucas Bernard',
      email: 'lucas.bernard@example.com',
      department: 'Finance',
      role: 'Comptable',
      status: 'inactive',
      lastActive: 'Il y a 2 semaines'
    },
    {
      id: 5,
      name: 'Emma Petit',
      email: 'emma.petit@example.com',
      department: 'Marketing',
      role: 'Designer',
      status: 'pending',
      lastActive: 'Jamais'
    }
  ];
  
  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactif</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Gestion d'équipe</h1>
        
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Membres de l'équipe</CardTitle>
                    <CardDescription>Gérez les membres de votre organisation</CardDescription>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Ajouter un membre
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Inviter un nouveau membre</DialogTitle>
                        <DialogDescription>
                          Envoyez une invitation par email pour ajouter un nouveau membre à votre équipe
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">Prénom</Label>
                            <Input id="first-name" placeholder="Prénom" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Nom</Label>
                            <Input id="last-name" placeholder="Nom" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="email@exemple.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Département</Label>
                          <Select>
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Sélectionner un département" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="development">Développement</SelectItem>
                              <SelectItem value="hr">Ressources Humaines</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="sales">Ventes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Poste</Label>
                          <Input id="role" placeholder="Poste ou fonction" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" className="mr-2">
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer l'invitation
                        </Button>
                        <Button type="submit">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter directement
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and filters */}
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input 
                        placeholder="Rechercher un membre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={18} />
                      <span className="hidden md:inline">Filtres</span>
                    </Button>
                  </div>
                  
                  {/* Team members table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Membre</TableHead>
                          <TableHead className="hidden md:table-cell">Département</TableHead>
                          <TableHead className="hidden md:table-cell">Rôle</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="hidden md:table-cell">Dernière activité</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              Aucun membre trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div>{member.name}</div>
                                    <div className="text-xs text-muted-foreground">{member.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{member.department}</TableCell>
                              <TableCell className="hidden md:table-cell">{member.role}</TableCell>
                              <TableCell>{getStatusBadge(member.status)}</TableCell>
                              <TableCell className="hidden md:table-cell">{member.lastActive}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Réinitialiser le mot de passe</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Désactiver le compte</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Départements</CardTitle>
                <CardDescription>Gérez les départements de votre organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau département
                  </Button>
                  
                  {/* Department list */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom du département</TableHead>
                          <TableHead>Membres</TableHead>
                          <TableHead>Manager</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Marketing</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>Sophie Martin</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir les membres</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Développement</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>Thomas Dubois</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir les membres</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">RH</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>Camille Leroy</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir les membres</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Finance</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell>Lucas Bernard</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir les membres</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <CardTitle>Invitations en attente</CardTitle>
                <CardDescription>Gérez les invitations envoyées aux nouveaux membres</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouvelle invitation
                  </Button>
                  
                  {/* Invitations list */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Département</TableHead>
                          <TableHead>Envoyée le</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>emma.petit@example.com</TableCell>
                          <TableCell>Marketing</TableCell>
                          <TableCell>21/05/2025</TableCell>
                          <TableCell>
                            <Badge variant="secondary">En attente</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Renvoyer</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>alexandre.durand@example.com</TableCell>
                          <TableCell>Développement</TableCell>
                          <TableCell>20/05/2025</TableCell>
                          <TableCell>
                            <Badge variant="secondary">En attente</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Renvoyer</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default TeamManagementPage;
