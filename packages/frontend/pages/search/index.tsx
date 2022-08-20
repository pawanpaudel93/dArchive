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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
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

Search.displayName = "Search";
export default function Search() {
  const client = useClient();
  const numberOfArchivesToLoad = 10;
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<IUrl[]>([]);
  const [selectValue, setSelectValue] = useState("url");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [isEnabled, setIsEnabled] = useState<{
    [key: string]: boolean;
  }>({});

  async function fetchData() {
    setIsLoading(true);
    setHasMore(true);
    try {
      const response = await client
        .query(query.replace("replace_filter", selectValue), {
          url,
          first: numberOfArchivesToLoad,
          skip,
        })
        .toPromise();
      if (response.data.urls.length > 0) {
        setSkip(skip + numberOfArchivesToLoad);
        setUrls([...urls, ...response.data.urls]);
        if (response.data.urls.length < numberOfArchivesToLoad) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchClicked(true);
    await fetchData();
  }

  return (
    <div>
      <Center>
        <Box
          position="fixed"
          top="80px"
          borderWidth="1px"
          boxShadow="lg"
          borderRadius="lg"
          overflow="hidden"
          width={{
            base: "100%",
            lg: "50%",
          }}
          p={3}
          zIndex={1}
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
                    setUrls([]);
                    setHasMore(false);
                    setSearchClicked(false);
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
              mt={20}
            >
              <TableContainer>
                <InfiniteScroll
                  dataLength={urls.length}
                  next={fetchData}
                  hasMore={hasMore}
                  loader={<h4>Loading more archives...</h4>}
                  endMessage={
                    <p style={{ textAlign: "center", marginTop: "5px" }}>
                      <b>No more archives...</b>
                    </p>
                  }
                >
                  <Table variant="striped">
                    <Thead>
                      <Tr>
                        <Th>Url</Th>
                        <Th>Archive</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <>
                        {urls.map((url: IUrl) => (
                          <Tr key={url.id}>
                            <Td>
                              <VStack>
                                <NextLink
                                  href={
                                    "/search/" +
                                    url.archives[url.archives.length - 1]
                                      .contentID
                                  }
                                  passHref
                                >
                                  <Link color="blue">
                                    {
                                      url.archives[url.archives.length - 1]
                                        .title
                                    }
                                  </Link>
                                </NextLink>
                                <Link href={url.url} isExternal>
                                  {url.url}
                                </Link>
                              </VStack>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                {url.archives.length > 3 ? (
                                  isEnabled[url.id] ? (
                                    url.archives.map((archive) => (
                                      <VStack>
                                        <NextLink
                                          href={"/search/" + archive.contentID}
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
                                            "/search/" +
                                            url.archives[0].contentID
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
                                            parseInt(
                                              url.archives[0].timestamp
                                            ) * 1000
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
                                            "/search/" +
                                            url.archives[
                                              url.archives.length - 1
                                            ].contentID
                                          }
                                          passHref
                                        >
                                          <Image
                                            src={
                                              "https://ipfs.io/ipfs/" +
                                              url.archives[
                                                url.archives.length - 1
                                              ].contentID +
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
                                              url.archives[
                                                url.archives.length - 1
                                              ].timestamp
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
                                        href={"/search/" + archive.contentID}
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
                      </>
                    </Tbody>
                  </Table>
                </InfiniteScroll>
              </TableContainer>
            </Box>
          </Center>
        )}
        {urls.length === 0 && url !== "" && searchClicked && !isLoading && (
          <Center mt={20}>
            <Alert status="info">
              <AlertIcon />
              No archives found
            </Alert>
          </Center>
        )}
      </Center>
    </div>
  );
}
