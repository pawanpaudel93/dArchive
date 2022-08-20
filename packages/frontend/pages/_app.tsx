import * as React from "react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { withUrqlClient } from 'next-urql'
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import NextNProgress from 'nextjs-progressbar'
import { Footer, NavBar } from "../components/navigation";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import { useIsMounted } from "../hooks";
import { dedupExchange, fetchExchange } from "urql";

// Get environment variables
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;

const hardhatChain: Chain = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Hardhat",
    symbol: "HARD",
  },
  network: "hardhat",
  rpcUrls: {
    default: "http://127.0.0.1:8545",
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  // [hardhatChain, chain.polygon, chain.polygonMumbai],
  // [alchemyProvider({ apiKey: alchemyId }), publicProvider()]
  [chain.polygonMumbai],
  [alchemyProvider({ apiKey: alchemyId })]
);

const { connectors } = getDefaultWallets({
  appName: "dArchive",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <NextHead>
          <title>dArchive</title>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </NextHead>
        <ChakraProvider>
          <NextNProgress />
          <NavBar />
          <div
            style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}
          >
            <Component {...pageProps} />
          </div>
          <Footer />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default withUrqlClient((ssrExchange) => ({
  url: "https://api.thegraph.com/subgraphs/name/pawanpaudel93/darchive",
  exchanges: [ssrExchange, dedupExchange, fetchExchange],
}))(App);
