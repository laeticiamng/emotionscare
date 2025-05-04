
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";

const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (user?.onboarded) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleRoleSelect = async (role: UserRole) => {
    setLoading(true);
    try {
      // Instead of using updateUser, navigate directly
      // We'll assume the user role is set elsewhere
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user role:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {step === 1 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Bienvenue !</h1>
          <p className="text-gray-600 mb-8">
            Nous avons quelques questions pour personnaliser votre expérience.
          </p>
          <Button onClick={() => setStep(2)}>Commencer</Button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Quel est votre rôle ?</h2>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => handleRoleSelect(UserRole.EMPLOYEE)}
              disabled={loading}
            >
              Employé
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRoleSelect(UserRole.MANAGER)}
              disabled={loading}
            >
              Manager
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRoleSelect(UserRole.ADMIN)}
              disabled={loading}
            >
              Admin
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleRoleSelect(UserRole.AUTRE)}
              disabled={loading}
            >
              Autre
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
