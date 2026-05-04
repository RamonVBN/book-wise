import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string
  isDemo: true;
};

type AuthContextType = {
  demoUser: DemoUser | null;
  loginAsDemo: () => void;
  logout: () => void;
  bannerClosed: boolean,
  handleBanner: () => void
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  const [bannerClosed, setBannerClosed] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("@bookwise-demo-user");
    if (stored) setDemoUser(JSON.parse(stored));
  }, []);

  function loginAsDemo() {
    const demoUser: DemoUser = {
      id: "demo-user",
      name: "Recruiter Demo",
      email: "demo@bookwise.app",
      avatarUrl: "/gigachad.jpg",
      createdAt: new Date().toString(),
      isDemo: true,
    };

    localStorage.setItem("@bookwise-demo-user", JSON.stringify(demoUser));
    setDemoUser(demoUser);
    return router.replace('/home')
  }

  function logout() {
    localStorage.removeItem("@bookwise-demo-user");
    setDemoUser(null);
    router.replace('/')
  }

  function handleBanner(){
    setBannerClosed(false)
    return
  }

  return (
    <AuthContext.Provider value={{ demoUser, loginAsDemo, logout, bannerClosed, handleBanner }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
