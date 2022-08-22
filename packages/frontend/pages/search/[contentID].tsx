import {
  AspectRatio,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  VStack,
  Img,
  Center,
  Tooltip,
  Divider,
  Spinner,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveAs } from "file-saver";
import { DownloadIcon } from "@chakra-ui/icons";
import { BsArrowsFullscreen } from "react-icons/bs";
import { SiIpfs } from "react-icons/si";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

SingleSearch.displayName = "Search";
export default function SingleSearch() {
  const router = useRouter();
  const handle = useFullScreenHandle();
  const { contentID } = router.query;
  const contentURL = `https://ipfs.io/ipfs/${contentID}`;
  const [isLoading, setIsLoading] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  function downloadFile(html = true) {
    setIsLoading(true);
    if (html) {
      saveAs(contentURL, "index.html");
    } else {
      saveAs(contentURL + "/screenshot.png", "screenshot.png");
    }
    setIsLoading(false);
  }

  function onLoad() {
    setIframeLoading(false);
  }

  return (
    <div>
      <Tooltip label="View FullScreen" aria-label="View FullScreen">
        <IconButton
          aria-label="View Fullscreen"
          position="absolute"
          right={0}
          onClick={handle.enter}
          icon={<BsArrowsFullscreen />}
        ></IconButton>
      </Tooltip>

      <FullScreen handle={handle}>
        <Tabs variant="enclosed-colored">
          <TabList>
            <Tab>Webpage</Tab>
            <Tab>Screenshot</Tab>
            <Tab>Open/Download</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} m={0}>
              <div>
                {iframeLoading && (
                  <Center>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  </Center>
                )}
                <iframe
                  src={contentURL}
                  onLoad={onLoad}
                  style={{
                    overflow: "hidden",
                    height: "100vh",
                    width: "100%",
                  }}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <Center>
                <Img src={contentURL + "/screenshot.png"} alt="screenshot" />
              </Center>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} mt={4}>
                <Stack direction={["column", "row"]}>
                  <Button
                    leftIcon={<SiIpfs />}
                    onClick={() => {
                      window.open(contentURL, "_blank");
                    }}
                    colorScheme="blue"
                  >
                    Open Webpage IPFS Link
                  </Button>
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={() => downloadFile(true)}
                    isLoading={isLoading}
                    colorScheme="blue"
                    loadingText="Downloading..."
                  >
                    Download Webpage
                  </Button>
                </Stack>
                <Divider />
                <Stack direction={["column", "row"]}>
                  <Button
                    leftIcon={<SiIpfs />}
                    onClick={() => {
                      window.open(contentURL + "/screenshot.png", "_blank");
                    }}
                    colorScheme="blue"
                  >
                    Open screenshot IPFS Link
                  </Button>
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={() => downloadFile(false)}
                    isLoading={isLoading}
                    colorScheme="blue"
                    loadingText="Downloading..."
                  >
                    Download Screenshot
                  </Button>
                </Stack>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </FullScreen>
    </div>
  );
}
