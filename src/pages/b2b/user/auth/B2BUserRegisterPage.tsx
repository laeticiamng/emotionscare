
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, User, Building, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

const B2BUserRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    department: '',
    jobTitle: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for access request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Demande d\'accès envoyée ! Vous recevrez un email de confirmation sous 24h.');
      navigate('/b2b/user/login');
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/b2b/selection')}
              className="self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Demande d'accès Collaborateur
            </CardTitle>
            <CardDescription>
              Rejoignez l'espace bien-être de votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom *</label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email professionnel *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="votre@entreprise.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Entreprise *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    name="company"
                    placeholder="Nom de votre entreprise"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Département</label>
                <Input
                  type="text"
                  name="department"
                  placeholder="RH, IT, Marketing..."
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Poste</label>
                <Input
                  type="text"
                  name="jobTitle"
                  placeholder="Votre fonction"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note :</strong> Votre demande sera examinée par l'administrateur de votre entreprise. 
                  Vous recevrez un email de confirmation dans les 24h.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer ma demande'
                )}
              </Button>

              <div className="text-center space-y-2">
                <div className="text-sm text-slate-600">
                  Déjà un accès collaborateur ?{' '}
                  <Link
                    to="/b2b/user/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserRegisterPage;
