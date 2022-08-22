import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  IconProps,
  Icon,
  useToast,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { NETWORK_ID } from "@/config";
import { useState, FormEvent } from "react";
import { useContractWrite } from "wagmi";
import { ethers } from "ethers";
import { getErrorMessage } from "@/parser";
import { serializeError } from "eth-rpc-errors";
import contracts from "@/contracts/hardhat_contracts.json";

const avatars = [
  {
    name: "0",
    url: "https://avatars.dicebear.com/api/avataaars/02.svg",
  },
  {
    name: "1",
    url: "https://avatars.dicebear.com/api/avataaars/10.svg",
  },
  {
    name: "2",
    url: "https://avatars.dicebear.com/api/avataaars/22.svg",
  },
  {
    name: "3",
    url: "https://avatars.dicebear.com/api/avataaars/32.svg",
  },
  {
    name: "4",
    url: "https://avatars.dicebear.com/api/avataaars/42.svg",
  },
];

Support.displayName = "Support";
export default function Support() {
  const toast = useToast();
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const chainId = Number(NETWORK_ID);

  const allContracts = contracts as any;
  const dArchiveAddress = allContracts[chainId][0].contracts.DArchive.address;
  const dArchiveABI = allContracts[chainId][0].contracts.DArchive.abi;

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: dArchiveAddress,
    contractInterface: dArchiveABI,
    functionName: "support",
    args: [],
  });

  async function support(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tx = await writeAsync({
        recklesslySetUnpreparedOverrides: {
          value: ethers.utils.parseEther(amount.toString()),
        },
      });
      await tx.wait();
      toast({
        title: "Thank you for your support!",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: serializeError(error, {
          fallbackError: { code: 4999, message: getErrorMessage(error) },
        }).message,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
          >
            dArchive needs your support{" "}
          </Heading>
          <Stack direction={"row"} spacing={4} align={"center"}>
            <AvatarGroup>
              {avatars.map((avatar) => (
                <Avatar
                  key={avatar.name}
                  name={avatar.name}
                  src={avatar.url}
                  size={useBreakpointValue({ base: "md", md: "lg" })}
                  position={"relative"}
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: "full",
                    height: "full",
                    rounded: "full",
                    transform: "scale(1.125)",
                    bgGradient: "linear(to-bl, blue.400,pink.400)",
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}
                />
              ))}
            </AvatarGroup>
            <Text fontFamily={"heading"} fontSize={{ base: "4xl", md: "6xl" }}>
              +
            </Text>
            <Flex
              align={"center"}
              justify={"center"}
              fontFamily={"heading"}
              fontSize={{ base: "sm", md: "lg" }}
              bg={"gray.800"}
              color={"white"}
              rounded={"full"}
              width={useBreakpointValue({ base: "44px", md: "60px" })}
              height={useBreakpointValue({ base: "44px", md: "60px" })}
              position={"relative"}
              _before={{
                content: '""',
                width: "full",
                height: "full",
                rounded: "full",
                transform: "scale(1.125)",
                bgGradient: "linear(to-bl, orange.400,yellow.400)",
                position: "absolute",
                zIndex: -1,
                top: 0,
                left: 0,
              }}
            >
              YOU
            </Flex>
          </Stack>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Support this project
              <Text
                as={"span"}
                bgGradient="linear(to-r, blue.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              All the support will go towards paying for storage, hosting,
              domain and also the gas fees for your and others next save. A
              soulbound supporter NFT will be minted for you if you are
              supporting for the first time.
            </Text>
          </Stack>
          <form onSubmit={support}>
            <Box mt={10}>
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    placeholder="Amount"
                    type="number"
                    value={amount}
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                  <InputRightAddon
                    children="MATIC"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    fontWeight="medium"
                  />
                </InputGroup>
              </Stack>
              <Button
                type="submit"
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, blue.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, blue.400,pink.400)",
                  boxShadow: "xl",
                }}
                isLoading={isLoading}
              >
                Support
              </Button>
            </Box>
          </form>
        </Stack>
      </Container>
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
    </Box>
  );
}

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: "100%", md: "40vw", lg: "30vw" })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};
