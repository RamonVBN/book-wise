import { ErrorView } from "@/components/ErrorView";
import { NextPageContext } from "next";


type Props = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode }: Props) {
  return <ErrorView statusCode={statusCode} />;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;

  return { statusCode };
};