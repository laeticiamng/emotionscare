
// Only update the sign-in function that has the wrong parameter count
const handleSignIn = async (event: React.FormEvent) => {
  event.preventDefault();
  setIsLoading(true);
  setError("");
  
  try {
    // Update the function call to have the correct number of parameters
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      setError(error.message);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté en tant qu'administrateur."
      });
      navigate(redirectUrl || "/admin/dashboard");
    }
  } catch (err) {
    console.error("Sign in error:", err);
    setError("Une erreur s'est produite lors de la connexion.");
  } finally {
    setIsLoading(false);
  }
};
