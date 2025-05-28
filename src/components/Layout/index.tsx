import Image from "next/image";
import {AppContainer, MainContainer, MenuContainer, MenuNavigation, NavButton, SignInButton, SignOutButton } from "./styles"
import logo from '../../../assets/Logo.png'

import { Binoculars, ChartLineUp, SignIn, SignOut, User} from "phosphor-react"

import { signOut, useSession } from "next-auth/react";

import { ReactNode, useState } from "react";

import { useRouter } from "next/router";

// type LayoutProps = {
//     name: string
//     avatarUrl: string
//     email: string
// }

type Navigation = {
    buttonName: string
}

// Query types


export default function Layout({children}: {children: ReactNode}){

    const [navigation] = useState<Navigation[]>([
        {
            buttonName: 'home',
        },
        {
            buttonName: 'explore',
        },
        {
            buttonName: 'profile',
        }
    ])

    const router = useRouter()

    const session = useSession()

    const isSigned = session.status === 'authenticated'

    async function handleSignOut(){
        await signOut({redirect: true, callbackUrl: '/'}) 
    }

    return (
        <AppContainer>
            <MenuContainer>
                <Image priority width={128} height={32} src={logo} alt=""/>
                <MenuNavigation>

                    <NavButton isActive={router.pathname.includes(navigation[0].buttonName)} onClick={async () => await router.push('/home')} >
                    <ChartLineUp size={24} />
                    Início
                    </NavButton>
                    <NavButton isActive={router.pathname.includes(navigation[1].buttonName)} onClick={async () => await router.push('/explore')}>
                    <Binoculars size={24} />
                    Explorar
                    </NavButton>

                    {
                        isSigned && (
                    <NavButton isActive={router.pathname.includes(navigation[2].buttonName)} onClick={() => router.push('/profile')}>
                        <User size={24} />
                        Perfil
                    </NavButton>
                    )
                    }
                </MenuNavigation>
                
                {
                    isSigned ? (
                        
                        <SignOutButton onClick={handleSignOut}>
                            <img width={32} height={32} src={session.data.user.avatarUrl} alt=""/>
                            <span>{session.data.user.name}</span>
                            <SignOut size={20}/>
                        </SignOutButton>
                    ) :

                <SignInButton onClick={() => router.push('/')}>
                    Fazer login
                    <SignIn size={20} />
                </SignInButton>
                }

            </MenuContainer> 
        
            <MainContainer>

                {children}
{/*                                
                    {
                        navigation[0].active && (

                            <Home handleNavigation={handleMenuNavigationButtons} />
                        )
                    }

                    {
                        navigation[1].active && (
                            <Explore />
                        )
                    }
                    
                    {
                        navigation[2].active && (
                            <Profile/>
                        )
                    } */}

            </MainContainer>
        </AppContainer>
    )
}

