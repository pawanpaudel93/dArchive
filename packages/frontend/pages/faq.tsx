import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Center,
} from "@chakra-ui/react";
import { FcFaq } from "react-icons/fc";

const items = [
  {
    id: "1",
    title: "What is the purpose of the Dapp?",
    content:
      "The purpose of the Dapp is to create archive of the webpage content and to provide a way to search for specific content.",
  },
  {
    id: "2",
    title: "What and where is the webpage contents stored?",
    content:
      "The contents of a webpage like html, screenshot and metadata like title, url, etc are stored using web3.storage to IPFS and Filecoin multiple storage providers.",
  },
  {
    id: "3",
    title: "How long the webpage content will be stored?",
    content:
      "It will be stored forever using IPFS and Filecoin storage providers.",
  },
];

Faq.displayName = "Faq";
export default function Faq() {
  return (
    <Container>
      <Box textAlign="center" py={10} px={6}>
        <Center>
          <FcFaq size={56} />
        </Center>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          FAQ
        </Heading>
      </Box>
      <Accordion allowToggle>
        {items.map((item) => (
          <AccordionItem key={item.id}>
            <h2>
              <AccordionButton _expanded={{ bg: "#0E76FD", color: "white" }}>
                <Box flex="1" textAlign="left">
                  {item.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{item.content}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
}
