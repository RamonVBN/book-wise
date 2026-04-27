import Image from "next/image";
import {
  AuthContainer,
  LogoFilter,
  Container,
  ImageContainer,
  LoginContainer,
  LoginContainerHeader,
  ProviderContainer,
} from "./styles";

import logo from "../../../assets/Logo.png";

import googleLogo from "../../../assets/logos_google-icon.png";
import githubLogo from "../../../assets/akar-icons_github-fill.png";
import visitLogo from "../../../assets/RocketLaunch.png";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { ProviderButton } from "@/components/ProviderButton/styles";
import { BriefcaseBusiness } from "lucide-react";

import { useAuth } from "@/components/AuthContext";


export default function Login() {

  const { loginAsDemo, logout }  = useAuth()

  const router = useRouter();

  const session = useSession();

  async function handleGoogleSignIn() {
    logout()
    await signIn("google", { redirect: true, callbackUrl: "/home" });
  }

  async function handleGithubSignIn() {
    logout()
    await signIn("github", { redirect: true, callbackUrl: "/home" });
  }

  async function handleRedirect() {
    logout()
    await router.push("/home");
  }

  if (session.status === "authenticated") {
    handleRedirect();
  }

  return (
    <>
      <NextSeo
        title="Login | BookWise"
        description="Faça login para começar sua jornada literária"
      />
      <Container>
        <ImageContainer>
          <LogoFilter>
            <Image unoptimized priority quality={100} src={logo} alt="" />
          </LogoFilter>
        </ImageContainer>

        <AuthContainer>
           <div> <Image unoptimized priority quality={100} src={logo} alt="" /></div>
          <LoginContainer>
            <LoginContainerHeader>
              <h1>Boas vindas!</h1>
              <p>Faça seu login ou acesse como visitante.</p>
            </LoginContainerHeader>

            <ProviderContainer>
              <ProviderButton onClick={handleGoogleSignIn}>
                <Image unoptimized src={googleLogo} alt="" />
                Entrar com Google
              </ProviderButton>
              <ProviderButton onClick={handleGithubSignIn}>
                <Image unoptimized src={githubLogo} alt="" />
                Entrar com Github
              </ProviderButton>
              <ProviderButton onClick={handleRedirect}>
                <Image unoptimized src={visitLogo} alt="" />
                Acessar como visitante
              </ProviderButton>
              <ProviderButton onClick={loginAsDemo}>
                <BriefcaseBusiness/>
                Entrar como recrutador (demo)
              </ProviderButton>
            </ProviderContainer>
          </LoginContainer>
        </AuthContainer>    
      </Container>
    </>
  );
}
