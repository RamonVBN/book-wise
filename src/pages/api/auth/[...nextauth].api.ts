import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider, {GithubProfile} from "next-auth/providers/github"
import GoogleProvider, {type GoogleProfile} from "next-auth/providers/google"


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,

      profile(profile: GithubProfile) {

        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatar_url
        }
      },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_SECRET_KEY ?? '',
        allowDangerousEmailAccountLinking: true,
        authorization: {
          params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
              scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
          },
      },
    profile(profile: GoogleProfile){

      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.picture
      } 
    },
      }),  
    // ...add more providers here
  ],

  callbacks: {

    async signIn() {
      
      return true
    },

    async session({session, user}){

      return {
          ...session,
          user
      }
  }
  }
}

export default NextAuth(authOptions)