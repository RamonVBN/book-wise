import { LinkButton } from "@/pages/home/styles";
import { CaretLeft } from "phosphor-react";
import { useSession } from "next-auth/react";
import { useAuth } from "../AuthContext";
import { Code, Container, Message } from "./styles";


type Props = {
  statusCode?: number;
};

export function ErrorView({ statusCode = 500 }: Props) {

  const session = useSession();

  const { demoUser } = useAuth()

  const isSigned = session.status === 'authenticated'

  const isDemoUserSigned = demoUser?.isDemo

  return (
    <Container>
      <Code>{statusCode}</Code>

      <Message>
        {statusCode === 404
          ? "Página não encontrada."
          : "Algo inesperado aconteceu. Tente novamente mais tarde."}
      </Message>

      <LinkButton href={isSigned || isDemoUserSigned ? '/home' : '/'}>
        <CaretLeft />
        Voltar para BookWise
      </LinkButton>
    </Container>
  );
}
