import { useStore } from '@/lib/store';
import OnboardingScreen from '@/components/auth/OnboardingScreen';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import AppShell from '@/components/layout/AppShell';
import ToastContainer from '@/components/layout/Toast';
import CoinAnimation from '@/components/ui/CoinAnimation';

export default function App() {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const authScreen = useStore(s => s.authScreen);

  if (!isAuthenticated) {
    return (
      <>
        {authScreen === 'onboarding' && <OnboardingScreen />}
        {authScreen === 'login' && <LoginForm />}
        {authScreen === 'signup' && <SignupForm />}
        <ToastContainer />
        <CoinAnimation />
      </>
    );
  }

  return (
    <>
      <AppShell />
      <ToastContainer />
      <CoinAnimation />
    </>
  );
}
