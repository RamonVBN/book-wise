import Image from "next/image";
import {
  AppContainer,
  MainContainer,
  MenuContainer,
  MenuNavigation,
  NavButton,
  SignInButton,
  SignInButtonContainer,
  SignOutButton,
  SignOutButtonContainer,
} from "./styles";
import logo from "../../../assets/Logo.png";

import { Binoculars, ChartLineUp, SignIn, SignOut, User } from "phosphor-react";

import { signOut, useSession } from "next-auth/react";

import { ReactNode, useState } from "react";

import { useRouter } from "next/router";

import { AppTooltip } from "../Tooltip";
import { slugifyUserName } from "@/utils/slugifyUserName";
import { Avatar } from "../Avatar";
import { useAuth } from "../AuthContext";
import { DemoBanner } from "../DemoBanner";
import { useQueryClient } from "@tanstack/react-query";

type Navigation = {
  buttonName: string;
};

export default function Layout({ children }: { children: ReactNode }) {

  const queryClient = useQueryClient()

  const { demoUser, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [navigation] = useState<Navigation[]>([
    {
      buttonName: "home",
    },
    {
      buttonName: "explore",
    },
    {
      buttonName: "profile",
    },
  ]);

  const router = useRouter();

  const session = useSession();

  const isSigned = session.status === "authenticated";

  const userId = session.data?.user.id;

  const isDemoUserSigned = demoUser?.isDemo;

  const demoUserId = demoUser?.id;

  async function handleSignOut() {
    setIsLoggingOut(true);

    if (isSigned) {
      await signOut({ redirect: true, callbackUrl: "/" });
    } else {
      logout();
    }

    queryClient.clear()
    return;
  }

  return (
    <AppContainer>
      <DemoBanner />
      <MenuContainer>
        <Image
          priority
          quality={100}
          width={128}
          height={32}
          src={logo}
          alt=""
        />
        <MenuNavigation>
          <div>
            <NavButton
              prefetch
              isActive={router.pathname.includes(navigation[0].buttonName)}
              href={"/home"}
            >
              <span>
                <ChartLineUp size={24} />
                Início
              </span>
            </NavButton>
            <NavButton
              prefetch
              isActive={router.pathname.includes(navigation[1].buttonName)}
              href={"/explore?category=Fiction"}
            >
              <span>
                <Binoculars size={24} />
                Explorar
              </span>
            </NavButton>

            {(isSigned || isDemoUserSigned) && (
              <NavButton
                prefetch
                isActive={router.pathname.includes(navigation[2].buttonName)}
                href={`/profile/${slugifyUserName(session?.data?.user.name ?? demoUser?.name ?? "User")}/${userId ?? demoUserId}?filter=allUserBooks`}
              >
                <span>
                  <User size={24} />
                  Perfil
                </span>
              </NavButton>
            )}
          </div>

          {isSigned || isDemoUserSigned ? (
            <SignOutButtonContainer>
              <span>
                <Avatar
                  width={32}
                  height={32}
                  src={session?.data?.user.avatarUrl ?? demoUser?.avatarUrl}
                  userName={
                    session?.data?.user.name ?? demoUser?.name ?? "User"
                  }
                />
                <span>{session?.data?.user.name ?? demoUser?.name}</span>
              </span>
              <AppTooltip content="Sair do BookWise">
                <SignOutButton disabled={isLoggingOut} onClick={handleSignOut}>
                  <SignOut size={20} />
                </SignOutButton>
              </AppTooltip>
            </SignOutButtonContainer>
          ) : (
            <SignInButtonContainer>
              Fazer login
              <AppTooltip content="Ir para página de login">
                <SignInButton prefetch href={"/"}>
                  <SignIn size={20} />
                </SignInButton>
              </AppTooltip>
            </SignInButtonContainer>
          )}
        </MenuNavigation>
      </MenuContainer>

      <MainContainer>{children}</MainContainer>
    </AppContainer>
  );
}
