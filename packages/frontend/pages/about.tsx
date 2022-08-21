import {
  keyframes,
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  IconButton,
  Link,
  VStack,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { BsGithub, BsTwitter } from "react-icons/bs";

About.displayName = "About";
export default function About() {
  const pulseRing = keyframes`
	0% {
        transform: scale(0.33);
    }
    40%,
    50% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
    `;
  return (
    <Center py={6}>
      <VStack>
        <Heading
          fontSize={{
            base: "2xl",
            md: "3xl",
          }}
          color="#0E76FD"
        >
          Team Members
        </Heading>

        <Box
          maxW={"270px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
        >
          <Image
            h={"120px"}
            w={"full"}
            src={
              "https://pbs.twimg.com/profile_banners/712587738541731840/1636429574/1500x500"
            }
            objectFit={"cover"}
          />
          <Flex justify={"center"} mt={-12}>
            <Box
              as="div"
              position="relative"
              w={"96px"}
              h={"96px"}
              _before={{
                content: "''",
                position: "relative",
                display: "block",
                width: "300%",
                height: "300%",
                boxSizing: "border-box",
                marginLeft: "-100%",
                marginTop: "-100%",
                borderRadius: "50%",
                bgColor: "#0E76FD",
                animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
              }}
            >
              <Avatar
                src="https://avatars.dicebear.com/api/avataaars/59.svg"
                size="full"
                position="absolute"
                top={0}
              />
            </Box>
          </Flex>

          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                Blockchainaholic
              </Heading>
              <Text color={"gray.500"}>Web3 Developer</Text>
            </Stack>

            <Stack direction={"row"} justify={"center"} spacing={6}>
              <Link href="https://github.com/pawanpaudel93">
                <IconButton
                  aria-label="github"
                  variant="ghost"
                  size="lg"
                  fontSize="3xl"
                  icon={<BsGithub />}
                  _hover={{
                    bg: "blue.500",
                    color: useColorModeValue("white", "gray.700"),
                  }}
                  isRound
                />
              </Link>
              <Link href="https://twitter.com/Blokchainaholic">
                <IconButton
                  aria-label="twitter"
                  variant="ghost"
                  size="lg"
                  icon={<BsTwitter size="28px" />}
                  _hover={{
                    bg: "blue.500",
                    color: useColorModeValue("white", "gray.700"),
                  }}
                  isRound
                />
              </Link>
            </Stack>
          </Box>
        </Box>
        <Divider colorScheme="#0E76FD" size="10" />
        <Heading
          fontSize={{
            base: "2xl",
            md: "3xl",
          }}
          color="#0E76FD"
          mt={6}
        >
          Project Repository
        </Heading>
        <Link href="https://github.com/pawanpaudel93/dArchive">
          <IconButton
            aria-label="github"
            variant="ghost"
            size="lg"
            fontSize="3xl"
            icon={<BsGithub />}
            _hover={{
              bg: "blue.500",
              color: useColorModeValue("white", "gray.700"),
            }}
            isRound
          />
        </Link>
        <Divider colorScheme="#0E76FD" size="10" />
        <Heading
          fontSize={{
            base: "2xl",
            md: "3xl",
          }}
          mt={6}
          color="#0E76FD"
        >
          Powered by
        </Heading>
        <HStack boxShadow={"2xl"} p={10}>
          <Link href="https://polygon.technology/">
            <Image
              h={"120px"}
              w={"full"}
              src={"polygon.svg"}
              objectFit={"cover"}
            />
          </Link>
          <Link href="https://ipfs.tech/">
            <Image
              h={"120px"}
              w={"full"}
              src={"ipfs.png"}
              objectFit={"cover"}
            />
          </Link>
          <Link href="https://filecoin.io/">
            <Image
              h={"120px"}
              w={"full"}
              src={"filecoin.png"}
              objectFit={"cover"}
            />
          </Link>
          <Link href="https://spheron.network/">
            <Image
              h={"120px"}
              w={"full"}
              src={"spheron.jpeg"}
              objectFit={"cover"}
            />
          </Link>
        </HStack>
      </VStack>
    </Center>
  );
}
