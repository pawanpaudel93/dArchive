import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Input,
  Container,
  Center,
  Box,
} from "@chakra-ui/react";
import isURL from "validator/lib/isURL";
import { Formik, Form, Field, FormikState } from "formik";
import { useClient } from "urql";

interface MyFormValues {
  url: string;
}

const query = `
query ($url: String!) {
  urls(where: {url: $url}) {
    id
    url
    archives {
      id
      timestamp
      title
      contentID
    }
  }
}
`;

export const Search = () => {
  const client = useClient();

  function validateURL(value: string) {
    return isURL(value) ? undefined : "Invalid URL";
  }

  return (
    <Container maxW="50%">
      <Box
        borderWidth="1px"
        boxShadow="lg"
        borderRadius="lg"
        overflow="hidden"
        p={6}
      >
        <Formik
          initialValues={{ url: "" }}
          onSubmit={async (values, actions) => {
            const { url } = values;
            const response = await client
              .query(query, {
                url,
              })
              .toPromise();
            console.log(response);
            actions.setSubmitting(false);
          }}
        >
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
                    <FormLabel>
                      Search the archive for saved snapshots
                    </FormLabel>
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
      </Box>
    </Container>
  );
};
