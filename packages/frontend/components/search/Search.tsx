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

export const Search = () => {
  function validateURL(value: string) {
    return isURL(value) ? undefined : "Invalid URL";
  }

  return (
    <Container>
      <Formik
        initialValues={{ url: "" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(props) => (
          <Form>
            <Field name="url" validate={validateURL}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.url && form.touched.url}>
                  <FormLabel>Search the archive for saved snapshots</FormLabel>
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
              >
                Search
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
