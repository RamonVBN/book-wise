import Image from "next/image";
import {AppContainer, MainContainer, MenuContainer, MenuNavigation, NavButton, SignInButton, SignOutButton } from "./styles"
import logo from '../../../assets/Logo.png'

import { Binoculars, ChartLineUp, SignIn, SignOut, User} from "phosphor-react"

import { signOut, useSession } from "next-auth/react";

import { useState } from "react";

import { useRouter } from "next/router";
import Home from "../../components/home";
import Explore from "../../components/explore";
import Profile from "../../components/profile";


// type LayoutProps = {
//     name: string
//     avatarUrl: string
//     email: string
// }

type Navigation = {
    
    buttonName: string
    active: boolean
}

// Query types

type RatingBookProps = {
    author: string
    name: string
    coverUrl: string,
    summary: string
}

type RatingUserProps = {
    name: string
    avatarUrl: string
    email: string
}

export type RatingProps = {
    id: string
    rate : number
    description: string
    createdAt: string
    book: RatingBookProps
    user: RatingUserProps

}

export type BooksProps = {

    id: string
    name: string
    author: string
    coverUrl: string
    totalPages: number,
    categories: Category[]
    ratings: {
        rate: number
        createdAt: string
        description: string
        user: {
            avatarUrl: string
            name: string
            email: string
        }
    }[]
}

type Category = {
    category: {
        name: string
    }
}

export type AllCategories = {
    name: string
}[]


export default function Layout(){

    const [navigation, setNavigation] = useState<Navigation[]>([
        {
            buttonName: 'start',
            active: true
        },
        {
            buttonName: 'explore',
            active: false
        },
        {
            buttonName: 'profile',
            active: false
        }
    ])

    const router = useRouter()

    const session = useSession()

    const isSigned = session.status === 'authenticated'

    async function handleSignOut(){

        await signOut({redirect: true, callbackUrl: '/'}) 

    }

    function handleMenuNavigationButtons(buttonName: string){

        navigation.map((button) => {
            if (button.buttonName === buttonName) {

                button.active = true
            }else{

                button.active = false
            }
        })

        setNavigation((prevState) => [...prevState])

    }

    return (
        <AppContainer>
            <MenuContainer>
                <Image width={128} height={32} src={logo} alt=""/>
                <MenuNavigation>

                    <NavButton isActive={navigation[0].active} onClick={(e) => handleMenuNavigationButtons(e.currentTarget.name)} name="start">
                    <ChartLineUp size={24} />
                    Início
                    </NavButton>
                    <NavButton isActive={navigation[1].active} onClick={(e) => handleMenuNavigationButtons(e.currentTarget.name)}  name="explore">
                    <Binoculars size={24} />
                    Explorar
                    </NavButton>

                    {
                        isSigned && (
                    <NavButton isActive={navigation[2].active} onClick={(e) => handleMenuNavigationButtons(e.currentTarget.name)} name="profile">
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
                    }

            </MainContainer>
        </AppContainer>
    )
}

