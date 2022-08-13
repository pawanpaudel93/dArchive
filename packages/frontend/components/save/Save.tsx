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
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import isURL from "validator/lib/isURL";
import { Formik, Form, Field, FormikValues, FormikState } from "formik";
import { useAccount, useContractWrite } from "wagmi";
import { useState } from "react";
import { useClient } from "urql";

import { NETWORK_ID } from "@/config";
import contracts from "@/contracts/hardhat_contracts.json";
import { ResaveModal } from "./Modal";
import { IArchive } from "@/interfaces";

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

export const Save = () => {
  const toast = useToast();
  const client = useClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialValues: MyFormValues = { url: "" };
  const chainId = Number(NETWORK_ID);
  const { isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch("/api/html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const { contentID, title } = await response.json();
      console.log("contentID: ", contentID);
      if (contentID) {
        const tx = await writeAsync({
          recklesslySetUnpreparedArgs: [contentID, url, title],
        });
        await tx?.wait();
        toast({
          title: "Saved successfully",
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error?.message || "Something went wrong",
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
      console.log(e);
    } finally {
      actions.setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="50%">
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
              {isLoading && <Progress size="xs" isIndeterminate />}
              <Center>
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={props.isSubmitting}
                  type="submit"
                  isDisabled={!isConnected}
                >
                  Save
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Box>
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
