import { BookDetailsModalBody } from "@/pages/explore/components/BookDetails/styles";
import { ProviderButton } from "../ProviderButton/styles";
import Image from "next/image";
import googleLogo from "../../../assets/logos_google-icon.png";
import githubLogo from "../../../assets/akar-icons_github-fill.png";
import { signIn } from "next-auth/react";
import { BriefcaseBusiness } from "lucide-react";
import { useAuth } from "../AuthContext";

type AuthModalProps = {
  description: string;
  handleCloseModal?: () => void
};

export function AuthModal({ description, handleCloseModal }: AuthModalProps) {

  const { loginAsDemo } = useAuth()

  function handleLoginAsDemo() {
    if(handleCloseModal){
      handleCloseModal()
    }
    loginAsDemo()
  }

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

        <ProviderButton onClick={handleLoginAsDemo}>
          <BriefcaseBusiness />
          Entrar como recrutador (demo)
        </ProviderButton>
      </div>
    </BookDetailsModalBody>
  );
}
