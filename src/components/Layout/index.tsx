import Image from "next/image";
import {AppContainer, MainContainer, MenuContainer, MenuNavigation, NavButton, SignInButton, SignInButtonContainer, SignOutButton, SignOutButtonContainer } from "./styles"
import logo from '../../../assets/Logo.png'

import { Binoculars, ChartLineUp, SignIn, SignOut, User} from "phosphor-react"

import { signOut, useSession } from "next-auth/react";

import { ReactNode, useState } from "react";

import { useRouter } from "next/router";


type Navigation = {
    buttonName: string
}

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

                    <div>
                        <NavButton prefetch isActive={router.pathname.includes(navigation[0].buttonName)} href={'/home'} >
                            <span>
                                <ChartLineUp size={24} />
                                Início
                            </span>
                            </NavButton>
                        <NavButton prefetch isActive={router.pathname.includes(navigation[1].buttonName)} href={'/explore'}>
                            <span>
                                <Binoculars size={24} />
                                Explorar
                            </span>
                        </NavButton>
                    

                        {
                            isSigned && (
                        <NavButton prefetch isActive={router.pathname.includes(navigation[2].buttonName)} href={'/profile'}>
                            <span>
                                <User size={24} />
                                Perfil
                            </span>
                        </NavButton>
                        )
                        }

                    </div>

                    {
                        isSigned ? (
                            
                            <SignOutButtonContainer>
                                   <span>
                                        <Image width={32} height={32} src={session.data.user.avatarUrl} alt=""/>
                                        <span>{session.data.user.name}</span>
                                   </span>

                                <SignOutButton onClick={handleSignOut}>
                                    <SignOut size={20}/>
                                </SignOutButton>
                            </SignOutButtonContainer>
                        ) :
                        <SignInButtonContainer>
                                Fazer login
                            <SignInButton prefetch href={'/'}>
                                <SignIn size={20} />
                            </SignInButton>
                        </SignInButtonContainer>
                    }

                </MenuNavigation>
                

            </MenuContainer> 
        
            <MainContainer>
                {children}
            </MainContainer>
        </AppContainer>
    )
}

