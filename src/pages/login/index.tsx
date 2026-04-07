import Image from "next/image";
import { AuthContainer, LogoFilter, Container, ImageContainer, LoginContainer, LoginContainerHeader, ProviderContainer } from "./styles";

import logo from '../../../assets/Logo.png'

import googleLogo from '../../../assets/logos_google-icon.png'
import githubLogo from '../../../assets/akar-icons_github-fill.png'
import visitLogo from '../../../assets/RocketLaunch.png'

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { ProviderButton } from "@/components/ProviderButton/styles";

export default function Login(){

    const router = useRouter()

    const session = useSession()

    async function handleGoogleSignIn(){
     
        await signIn('google', {redirect: true, callbackUrl: '/home'})
    }

    async function handleGithubSignIn(){

        await signIn('github', {redirect: true, callbackUrl: '/home'})
    }

    async function handleRedirect(){

        await router.push('/home')
    }

    if (session.status === 'authenticated') {
        
        handleRedirect()
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
                    <Image src={logo} alt="" />
                </LogoFilter>
                
            </ImageContainer>
            
            <AuthContainer>
                <LoginContainer>
                    <LoginContainerHeader>
                        <h1>Boas vindas!</h1>
                        <p>Faça seu login ou acesse como visitante.</p>
                    </LoginContainerHeader>

                    <ProviderContainer>
                    <ProviderButton login onClick={handleGoogleSignIn}>
                        <Image src={googleLogo} alt=""/>
                        Entrar com Google
                    </ProviderButton>
                    <ProviderButton login onClick={handleGithubSignIn}>
                        <Image src={githubLogo} alt=""/>
                        Entrar com Github
                    </ProviderButton>
                    <ProviderButton login onClick={handleRedirect}>
                        <Image src={visitLogo} alt=""/>
                        Acessar como visitante
                    </ProviderButton>
                    </ProviderContainer>
                </LoginContainer>
            </AuthContainer>
        </Container>
        </>
    )
}
