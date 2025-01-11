import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { BRAND } from '@/config/brand';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-background"
      style={{ 
        fontFamily: BRAND.fonts.sans,
        background: `linear-gradient(to bottom right, ${BRAND.colors.primary.light}, ${BRAND.colors.primary.DEFAULT})`
      }}
    >
      <RegisterForm />
    </div>
  );
}