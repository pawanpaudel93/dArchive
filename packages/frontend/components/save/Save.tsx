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

export const Save = () => {
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
