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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveAs } from "file-saver";
import { DownloadIcon } from "@chakra-ui/icons";

export default function Archive() {
  const router = useRouter();
  const { contentID } = router.query;
  const contentURL = `https://ipfs.io/ipfs/${contentID}`;
  const [content, setContent] = useState("");
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
      <Tabs>
        <TabList>
          <Tab>Webpage</Tab>
          <Tab>Screenshot</Tab>
          <Tab>Download</Tab>
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
              <Button
                leftIcon={<DownloadIcon />}
                onClick={() => downloadFile(true)}
                isLoading={isLoading}
                colorScheme="blue"
                loadingText="Downloading..."
              >
                Download Webpage
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
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
