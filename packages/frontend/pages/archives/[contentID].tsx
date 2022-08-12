import {
  AspectRatio,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { saveAs } from "file-saver";
import { DownloadIcon } from "@chakra-ui/icons";

export default function Archive() {
  const router = useRouter();
  const { contentID } = router.query;
  const contentURL = `https://ipfs.io/ipfs/${contentID}`;
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // async function loadAndParse() {
  //   const response = await fetch(contentURL);
  //   setContent(await response.text());
  // }

  // useEffect(() => {
  //   if (contentID && content === "") {
  //     loadAndParse();
  //   }
  // }, [contentID]);

  // if (!content) {
  //   return <div>Loading...</div>;
  // }

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
      <base target="_parent" />
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
            {/* <div>{parse(content)}</div> */}
            {/* <html dangerouslySetInnerHTML={{ __html: content }} /> */}
          </TabPanel>
          <TabPanel>
            <Image src={contentURL + "/screenshot.png"} alt="screenshot" />
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
