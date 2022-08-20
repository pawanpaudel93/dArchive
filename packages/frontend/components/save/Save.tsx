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
import { useAccount, useContractWrite, useProvider } from "wagmi";
import { useEffect, useState } from "react";
import { useClient } from "urql";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Biconomy } from "@biconomy/mexa";
import NextLink from "next/link";

import { NETWORK_ID } from "@/config";
import contracts from "@/contracts/hardhat_contracts.json";
import { ResaveModal } from "./Modal";
import { IArchive } from "@/interfaces";
import { ExternalProvider } from "@ethersproject/providers";
import { Contract, ethers } from "ethers";
import { getErrorMessage } from "@/parser";
import { serializeError } from "eth-rpc-errors";

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

let biconomy: Biconomy;
let dArchive: Contract;

export const Save = () => {
  const toast = useToast();
  const client = useClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues: MyFormValues = { url: "" };
  const chainId = Number(NETWORK_ID);
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [contentID, setContentID] = useState("");
  const [balance, setBalance] = useState(0);
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
    args: [""],
  });

  function validateURL(value: string) {
    return isURL(value) ? undefined : "Invalid URL";
  }

  async function save(url: string) {
    try {
      const response = await fetch("/api/html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const responseJSON = await response.json();
      const _contentID = responseJSON.contentID;
      setContentID(_contentID);
      console.log("contentID: ", _contentID);
      if (_contentID) {
        // const tx = await writeAsync({
        //   recklesslySetUnpreparedArgs: [contentID],
        // });
        // await tx?.wait();
        // toast({
        //   title: "Saved successfully",
        //   status: "success",
        //   position: "top-right",
        //   isClosable: true,
        // });
        // setIsLoading(false);
        const provider = biconomy.provider;
        let { data } = await dArchive.populateTransaction.addArchive(
          _contentID
        );
        let txParams = {
          data: data,
          to: dArchiveAddress,
          from: address,
          signatureType: "EIP712_SIGN",
        };
        provider.send?.(
          { method: "eth_sendTransaction", params: [txParams] },
          (err, tx) => {
            if (err) {
              console.log("error: ", err);
            } else {
              console.log("tx: ", tx);
            }
          }
        );
        biconomy.on(
          "txHashGenerated",
          (data: { transactionId: string; transactionHash: string }) => {
            console.log("txHashGenerated:", data);
          }
        );

        biconomy.on(
          "txMined",
          (data: {
            msg: string;
            id: string;
            hash: string;
            receipt: string;
          }) => {
            setIsLoading(false);
            toast({
              title: "Saved successfully",
              status: "success",
              position: "top-right",
              isClosable: true,
            });
            console.log("txMined:", data);
          }
        );

        biconomy.on(
          "onError",
          (data: { error: any; transactionId: string }) => {
            console.log("onError:", data);
            toast({
              title: serializeError(data.error).message,
              status: "error",
              position: "top-right",
              isClosable: true,
            });
          }
        );

        biconomy.on(
          "txHashChanged",
          (data: { transactionId: string; transactionHash: string }) => {
            console.log("txHashChanged:", data);
          }
        );
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
      actions.setSubmitting(false);
    }
  };

  async function biconomyInit() {
    if (!biconomy) {
      biconomy = new Biconomy(window.ethereum as ExternalProvider, {
        apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY!,
        debug: true,
        contractAddresses: [dArchiveAddress.toLowerCase()],
        jsonRpcUrl: "https://rpc.ankr.com/polygon_mumbai",
      });
      dArchive = new ethers.Contract(
        dArchiveAddress,
        dArchiveABI,
        biconomy.ethersProvider
      );
      await biconomy.init();
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
