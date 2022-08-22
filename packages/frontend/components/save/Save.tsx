import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  Container,
  Center,
  Progress,
  Box,
  useDisclosure,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import isURL from "validator/lib/isURL";
import { Formik, Form, Field, FormikValues, FormikState } from "formik";
import { useAccount, useContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { useClient } from "urql";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NextLink from "next/link";

import { NETWORK_ID } from "@/config";
import contracts from "@/contracts/hardhat_contracts.json";
import { ResaveModal } from "./Modal";
import { IArchive } from "@/interfaces";
import { ExternalProvider } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";
import { getErrorMessage } from "@/parser";
import { serializeError } from "eth-rpc-errors";
const { Biconomy } = require("@biconomy/mexa");

interface MyFormValues {
  url: string;
}

const query = `
query ($url: String!) {
  urls(where: {url: $url}) {
    id
    url
    archives(orderBy: timestamp, orderDirection: desc, first: 1 ) {
      id
      timestamp
      title
      contentID
    }
  }
}
`;

let biconomy: typeof Biconomy;
let dArchive: Contract;

export const Save = () => {
  const toast = useToast();
  const client = useClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues: MyFormValues = { url: "" };
  const chainId = Number(NETWORK_ID);
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [contentID, setContentID] = useState("");
  const [archive, setArchive] = useState<IArchive>({
    id: "",
    title: "",
    contentID: "",
    timestamp: "",
    contentURL: "",
  });

  const allContracts = contracts as any;
  const dArchiveAddress = allContracts[chainId][0].contracts.DArchive.address;
  const dArchiveABI = allContracts[chainId][0].contracts.DArchive.abi;

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dArchiveAddress,
    contractInterface: dArchiveABI,
    functionName: "addArchive",
    args: ["", "", ""],
  });

  function validateURL(value: string) {
    return isURL(value) ? undefined : "Invalid URL";
  }
  async function save(url: string) {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_EXTERNAL_API
          ? `${process.env.NEXT_PUBLIC_EXTERNAL_API}/api/v1/html`
          : "/api/html",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );
      const responseJSON = await response.json();
      const _contentID = responseJSON.contentID;
      const title = responseJSON.title;
      setContentID(_contentID);
      console.log("contentID: ", _contentID);
      if (_contentID) {
        const { balance } = await (
          await fetch(
            process.env.NEXT_PUBLIC_EXTERNAL_API
              ? `${process.env.NEXT_PUBLIC_EXTERNAL_API}/api/v1/balance`
              : "/api/balance"
          )
        ).json();
        if (balance < 0.1) {
          const tx = await writeAsync({
            recklesslySetUnpreparedArgs: [contentID, url, title],
          });
          await tx?.wait();
        } else {
          const provider = await biconomy.getEthersProvider();
          let { data } = await dArchive.populateTransaction.addArchive(
            _contentID,
            url,
            title
          );
          let txParams = {
            data: data,
            to: dArchiveAddress,
            from: address,
            signatureType: "EIP712_SIGN",
          };
          const txHash = await provider.send("eth_sendTransaction", [txParams]);
          await provider.waitForTransaction(txHash);
        }
        toast({
          title: "Saved successfully",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to save",
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: serializeError(error, {
          fallbackError: { code: 4999, message: getErrorMessage(error) },
        }).message,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (
    values: FormikValues,
    actions: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    setIsLoading(true);
    const { url } = values;
    try {
      const response = await client
        .query(query, {
          url,
        })
        .toPromise();
      if (response.data.urls.length > 0) {
        const tempArchive = response.data.urls[0].archives[0];
        setArchive({
          id: tempArchive.id,
          timestamp: tempArchive.timestamp,
          title: tempArchive.title,
          contentID: tempArchive.contentID,
          contentURL: response.data.urls[0].url,
        });
        onOpen();
      } else {
        await save(url);
      }
    } catch (e) {
      console.log(getErrorMessage(e));
    } finally {
      setIsLoading(false);
      actions.setSubmitting(false);
    }
  };

  async function biconomyInit() {
    if (!biconomy) {
      biconomy = new Biconomy(window.ethereum as ExternalProvider, {
        apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY!,
        debug: true,
      });
      dArchive = new ethers.Contract(
        dArchiveAddress,
        dArchiveABI,
        new ethers.providers.Web3Provider(biconomy)
      );
    }
  }

  useEffect(() => {
    biconomyInit();
  }, [isConnected]);

  return (
    <Container>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        p={6}
      >
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {(props) => (
            <Form>
              <Field name="url" validate={validateURL}>
                {({
                  field,
                  form,
                }: {
                  field: { name: string; value: string };
                  form: FormikState<MyFormValues>;
                }) => (
                  <FormControl
                    isInvalid={!!form.errors.url && !!form.touched.url}
                  >
                    <FormLabel>Archive URL content</FormLabel>
                    <Input {...field} placeholder="URL to archive" />
                    <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {isLoading && (
                <Progress size="xs" isIndeterminate hasStripe isAnimated />
              )}
              <Center>
                {isConnected ? (
                  <Button
                    mt={4}
                    colorScheme="blue"
                    isLoading={props.isSubmitting || isLoading}
                    type="submit"
                    isDisabled={!isConnected}
                  >
                    Save
                  </Button>
                ) : (
                  <div
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    <ConnectButton label="Sign in" accountStatus="avatar" />
                  </div>
                )}
              </Center>
            </Form>
          )}
        </Formik>
      </Box>

      {!isLoading && contentID && (
        <Alert status="info">
          <AlertIcon />
          <NextLink href={"/search/" + contentID}>
            <Link>See archived result</Link>
          </NextLink>
        </Alert>
      )}

      {isOpen && (
        <ResaveModal
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
          archive={archive}
          save={save}
        />
      )}
    </Container>
  );
};
