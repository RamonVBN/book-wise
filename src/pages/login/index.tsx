import Image from "next/image";
import { AuthContainer, LogoFilter, Container, ImageContainer, LoginContainer, LoginContainerHeader,  ProviderButton, ProviderContainer } from "./styles";

import homeImage from '../../../assets/homeImage.png'
import logo from '../../../assets/Logo.png'

import googleLogo from '../../../assets/logos_google-icon.png'
import githubLogo from '../../../assets/akar-icons_github-fill.png'
import visitLogo from '../../../assets/RocketLaunch.png'
import { signIn, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";




export default function Login(){

    const router = useRouter()

    const session = useSession()

    async function handleGoogleSignIn(){
     
        await signIn('google')
    }

    async function handleGithubSignIn(){

        await signIn('github')
    }

    if (session.status === 'authenticated') {
        
        router.push('/app')
    }

    console.log(session)

    return (
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
                    <ProviderButton onClick={handleGoogleSignIn}>
                        <Image src={googleLogo} alt=""/>
                        Entrar com Google
                    </ProviderButton>
                    <ProviderButton onClick={handleGithubSignIn}>
                        <Image src={githubLogo} alt=""/>
                        Entrar com Github
                    </ProviderButton>
                    <ProviderButton onClick={() => router.push('/app')}>
                        <Image src={visitLogo} alt=""/>
                        Acessar como visitante
                    </ProviderButton>
                    </ProviderContainer>
                </LoginContainer>
            </AuthContainer>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps = async({req, res}) => {

    const session = await getServerSession(req, res, authOptions)
    
    const email = session?.user?.email
    const name = session?.user?.email
    const avatarUrl = session?.user?.image
    

    const sessionWithoutDate = {
        user: {
            email,
            name,
            avatarUrl
        }

    }

    return {
        props:{
            ...sessionWithoutDate
        }
    }
}