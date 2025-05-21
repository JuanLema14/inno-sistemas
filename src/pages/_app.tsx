import "@/styles/global.css";
import type { AppProps } from "next/app";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isMainRoute = router.pathname.startsWith("/main");

  if (isMainRoute) {
    return (
      <MainLayout user={pageProps.user}>
        <Component {...pageProps} />
      </MainLayout>
    );
  }

  return <Component {...pageProps} />;
}

