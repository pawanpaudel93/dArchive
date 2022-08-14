import {
  FormControl,
  Button,
  Input,
  Box,
  HStack,
  Td,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Center,
  VStack,
  Link,
  Image,
  Select,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useClient } from "urql";
import { FormEvent, useState } from "react";
import NextLink from "next/link";
import dayjs from "dayjs";

const query = `
  query ($url: String!, $first: Int!, $skip: Int!) {
    urls(where: {replace_filter: $url}, first: $first, skip: $skip) {
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

const filters = {
  url: "Exact Match",
  url_contains_nocase: "Contains",
  url_starts_with_nocase: "Starts With",
  url_ends_with_nocase: "Ends With",
};

interface IArchives {
  id: string;
  timestamp: string;
  title: string;
  contentID: string;
}

interface IUrl {
  id: string;
  url: string;
  archives: IArchives[];
}

export default function Archives() {
  const client = useClient();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<IUrl[]>([]);
  const [selectValue, setSelectValue] = useState("url");
  const [skip, setSkip] = useState(0);
  const [isEnabled, setIsEnabled] = useState<{
    [key: string]: boolean;
  }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await client
        .query(query.replace("replace_filter", selectValue), {
          url,
          first: 10,
          skip,
        })
        .toPromise();
      setSkip(skip + 10);
      setUrls([...urls, ...response.data.urls]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Center>
        <Box
          borderWidth="1px"
          boxShadow="lg"
          borderRadius="lg"
          overflow="hidden"
          width={{
            base: "100%",
            lg: "50%",
          }}
          p={3}
        >
          <form onSubmit={onSubmit}>
            <HStack px={2}>
              <Select
                placeholder="Select filter"
                value={selectValue}
                width={{
                  base: "50%",
                }}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                {Object.entries(filters).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>

              <FormControl>
                <Input
                  placeholder="Search URL"
                  value={url}
                  onChange={(e) => {
                    setSkip(0);
                    setUrl(e.target.value);
                  }}
                  required
                />
              </FormControl>

              <Button
                colorScheme="blue"
                isLoading={isLoading}
                p={2}
                type="submit"
              >
                <SearchIcon />
              </Button>
            </HStack>
          </form>
        </Box>
      </Center>
      <Center>
        {urls.length > 0 && (
          <Center>
            <Box
              width={{
                base: "100%",
                // md: "80%",
                // lg: "60%",
              }}
              mt={4}
            >
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Url</Th>
                      <Th>Archive</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {urls.map((url: IUrl) => (
                      <Tr key={url.id}>
                        <Td>
                          <VStack>
                            <NextLink
                              href={
                                "/archives/" +
                                url.archives[url.archives.length - 1].contentID
                              }
                              passHref
                            >
                              <Link color="blue">
                                {url.archives[url.archives.length - 1].title}
                              </Link>
                            </NextLink>
                            <Link href={url.url}>{url.url}</Link>
                          </VStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {url.archives.length > 3 ? (
                              isEnabled[url.id] ? (
                                url.archives.map((archive) => (
                                  <VStack>
                                    <NextLink
                                      href={"/archives/" + archive.contentID}
                                      passHref
                                    >
                                      <Image
                                        src={
                                          "https://ipfs.io/ipfs/" +
                                          archive.contentID +
                                          "/screenshot.png"
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        boxSize="100px"
                                      />
                                    </NextLink>
                                    <small>
                                      {dayjs(
                                        parseInt(archive.timestamp) * 1000
                                      ).format("D MMM YYYY HH:mm")}
                                    </small>
                                  </VStack>
                                ))
                              ) : (
                                <>
                                  <VStack>
                                    <NextLink
                                      href={
                                        "/archives/" + url.archives[0].contentID
                                      }
                                      passHref
                                    >
                                      <Image
                                        src={
                                          "https://ipfs.io/ipfs/" +
                                          url.archives[0].contentID +
                                          "/screenshot.png"
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        boxSize="100px"
                                      />
                                    </NextLink>
                                    <small>
                                      {dayjs(
                                        parseInt(url.archives[0].timestamp) *
                                          1000
                                      ).format("D MMM YYYY HH:mm")}
                                    </small>
                                  </VStack>

                                  <Button
                                    onClick={() => {
                                      setIsEnabled({
                                        ...isEnabled,
                                        [url.id]: true,
                                      });
                                    }}
                                  >
                                    View more
                                  </Button>

                                  <VStack>
                                    <NextLink
                                      href={
                                        "/archives/" +
                                        url.archives[url.archives.length - 1]
                                          .contentID
                                      }
                                      passHref
                                    >
                                      <Image
                                        src={
                                          "https://ipfs.io/ipfs/" +
                                          url.archives[url.archives.length - 1]
                                            .contentID +
                                          "/screenshot.png"
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        boxSize="100px"
                                      />
                                    </NextLink>
                                    <small>
                                      {dayjs(
                                        parseInt(
                                          url.archives[url.archives.length - 1]
                                            .timestamp
                                        ) * 1000
                                      ).format("D MMM YYYY HH:mm")}
                                    </small>
                                  </VStack>
                                </>
                              )
                            ) : (
                              url.archives.map((archive) => (
                                <VStack key={archive.id}>
                                  <NextLink
                                    href={"/archives/" + archive.contentID}
                                    passHref
                                  >
                                    <Image
                                      src={
                                        "https://ipfs.io/ipfs/" +
                                        archive.contentID +
                                        "/screenshot.png"
                                      }
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      boxSize="100px"
                                    />
                                  </NextLink>
                                  <small>
                                    {dayjs(
                                      parseInt(archive.timestamp) * 1000
                                    ).format("D MMM YYYY HH:mm")}
                                  </small>
                                </VStack>
                              ))
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Center>
        )}
      </Center>
    </div>
  );
}
