import { BookDetailsModalBody } from "@/pages/explore/components/BookDetails/styles";
import { ProviderButton } from "../ProviderButton/styles";
import Image from "next/image";
import googleLogo from "../../../assets/logos_google-icon.png";
import githubLogo from "../../../assets/akar-icons_github-fill.png";
import { signIn } from "next-auth/react";

type AuthModalProps = {
    description: string
}

export function AuthModal({ description }: AuthModalProps) {
  return (
    <BookDetailsModalBody>
      <h3>{description}</h3>
      <div>
        <ProviderButton onClick={async () => signIn("google")}>
          <Image src={googleLogo} alt="" />
          Entrar com Google
        </ProviderButton>

        <ProviderButton onClick={async () => signIn("github")}>
          <Image src={githubLogo} alt="" />
          Entrar com Github
        </ProviderButton>
      </div>
    </BookDetailsModalBody>
  );
}
