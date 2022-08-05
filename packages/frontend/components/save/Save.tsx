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
import { Formik, Form, Field } from "formik";
import formidable, { IncomingForm } from "formidable";

export const Save = () => {
  function validateURL(value: string) {
    return isURL(value) ? undefined : "Invalid URL";
  }

  return (
    <Container>
      <Formik
        initialValues={{ url: "" }}
        onSubmit={async (values, actions) => {
          const { url } = values;
          let response = await fetch("/api/html", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          });
          const responseBody = await response.json();
          console.log(
            "responseBody: ",
            responseBody,
            response.status,
            response.statusText
          );
          const blob = new Blob([responseBody.html], { type: "text/html" });
          const file = new File([blob], "index.html");
          const formData = new FormData();
          formData.append("file", file);
          console.log(formData, file);
          response = await fetch("/api/web3upload", {
            method: "POST",
            body: formData,
          });
          console.log(await response.json());
          actions.setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <Field name="url" validate={validateURL}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.url && form.touched.url}>
                  <FormLabel>Archive URL content</FormLabel>
                  <Input {...field} placeholder="url" />
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
