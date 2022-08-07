import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  Container,
  Center,
} from "@chakra-ui/react";
import isURL from "validator/lib/isURL";
import { Formik, Form, Field, FormikValues, FormikState } from "formik";
import { NETWORK_ID } from "@/config";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import contracts from "@/contracts/hardhat_contracts.json";
import { useState } from "react";

interface MyFormValues {
  url: string;
}

export const Save = () => {
  const initialValues: MyFormValues = { url: "" };
  const [htmlContent, setHtmlContent] = useState("");
  const chainId = Number(NETWORK_ID);
  const { isConnected } = useAccount();

  const allContracts = contracts as any;
  const dArchiveAddress = allContracts[chainId][0].contracts.DArchive.address;
  const dArchiveABI = allContracts[chainId][0].contracts.DArchive.abi;

  const { config } = usePrepareContractWrite({
    addressOrName: dArchiveAddress,
    contractInterface: dArchiveABI,
    functionName: "addArchive",
    chainId,
    args: ["", ""],
  });

  const { write } = useContractWrite(config);

  function validateURL(value: string) {
    return isURL(value) ? undefined : "Invalid URL";
  }

  const handleSubmit = async (
    values: FormikValues,
    actions: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    try {
      const { url } = values;
      if (!htmlContent) {
        const response = await fetch("/api/html", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });
        let { html } = await response.json();
        if (response.status === 200) {
          setHtmlContent(html);
        }
      }
      if (htmlContent) {
        const blob = new Blob([htmlContent], { type: "text/html" });
        const file = new File([blob], "index.html");
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/web3upload", {
          method: "POST",
          body: formData,
        });
        if (response.status === 200) {
          const { contentID } = await response.json();
          write?.({ args: [contentID, url] });
          setHtmlContent("");
          console.log(contentID);
        }
      }
    } catch (error) {
      console.log(error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Container>
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
    </Container>
  );
};
