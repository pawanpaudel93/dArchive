import {
  Center,
  Container,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";

export default function WorkingConcept() {
  const texts = [
    "Archive: User connects a wallet to the dApp then visit the archive page and enter a URL to archive. Then, the html and screenshot of the webpage is saved and uploaded via web3.storage and the content identifier, title and URL is passed to the smart contract function and emitted as an event and the events are indexed by the graph to create an api to query the saved webpages.",
    "Search: User can query with filters and get the results and visit the results page to view the saved webpage and screenshot and also can download the webpage html and screenshot.",
    "Support: User can support the project and also receive a SoulBound NFT if he/she is supporting the first time.",
    "FAQs: User can visit the FAQ page for Frequently Asked Questions and answers.",
    "About: User can visit the About page to know more about the team members, project repository and technologies powering the project.",
  ];
  return (
    <Container maxW="3xl">
      <Heading
        fontWeight={600}
        fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
        lineHeight={"110%"}
        textAlign={"center"}
      >
        How it{" "}
        <Text as={"span"} color={"blue.400"}>
          works?
        </Text>
      </Heading>

      <Center>
        <OrderedList spacing={4} fontSize="xl" pt="6">
          {texts.map((text, index) => (
            <ListItem key={index}>{text}</ListItem>
          ))}
        </OrderedList>
      </Center>
    </Container>
  );
}
