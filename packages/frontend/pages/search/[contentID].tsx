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
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveAs } from "file-saver";
import { DownloadIcon } from "@chakra-ui/icons";
import { BsArrowsFullscreen } from "react-icons/bs";
import { SiIpfs } from "react-icons/si";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export default function Archive() {
  const router = useRouter();
  const handle = useFullScreenHandle();
  const { contentID } = router.query;
  const contentURL = `https://ipfs.io/ipfs/${contentID}`;
  const [isLoading, setIsLoading] = useState(false);

  function downloadFile(html = true) {
    setIsLoading(true);
    if (html) {
      saveAs(contentURL, "index.html");
    } else {
      saveAs(contentURL + "/screenshot.png", "screenshot.png");
    }
    setIsLoading(false);
  }

  return (
    <div>
      <Button position="absolute" right={0} onClick={handle.enter}>
        <Tooltip label="View FullScreen" aria-label="View FullScreen">
          <BsArrowsFullscreen />
        </Tooltip>
      </Button>
      <FullScreen handle={handle}>
        <Tabs variant="line">
          <TabList>
            <Tab>Webpage</Tab>
            <Tab>Screenshot</Tab>
            <Tab>Open/Download</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <AspectRatio>
                <iframe src={contentURL} />
              </AspectRatio>
            </TabPanel>
            <TabPanel>
              <Center>
                <Img src={contentURL + "/screenshot.png"} alt="screenshot" />
              </Center>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} mt={4}>
                <HStack>
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
                </HStack>
                <Divider />
                <HStack>
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
                </HStack>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </FullScreen>
    </div>
  );
}
