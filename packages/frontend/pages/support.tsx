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
import { useState, useEffect, FormEvent } from "react";
import bioconomyGasTank from "@/contracts/bioconomy_gastank.json";
import { useContractRead, useContractWrite } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { getErrorMessage } from "@/parser";

const avatars = [
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Segun Adebayo",
    url: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Kent Dodds",
    url: "https://bit.ly/kent-c-dodds",
  },
  {
    name: "Prosper Otemuyiwa",
    url: "https://bit.ly/prosper-baba",
  },
  {
    name: "Christian Nwamba",
    url: "https://bit.ly/code-beast",
  },
];

Support.displayName = "Support";
export default function Support() {
  const toast = useToast();
  const [amount, setAmount] = useState(1);
  const [minAmount, setminAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const gasTankContracts = bioconomyGasTank as any;
  const chainId = Number(NETWORK_ID);
  const gassTankAddress =
    gasTankContracts[chainId][0].contracts.DappGasTank.address;
  const gassTankABI = gasTankContracts[chainId][0].contracts.DappGasTank.abi;

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: gassTankAddress,
    contractInterface: gassTankABI,
    functionName: "depositFor",
    args: [process.env.NEXT_PUBLIC_BICONOMY_FUNDING_KEY!],
  });

  const { data: minDeposit } = useContractRead({
    addressOrName: gassTankAddress,
    contractInterface: gassTankABI,
    functionName: "minDeposit",
  });

  useEffect(() => {
    if (minDeposit) {
      const _minDeposit = parseFloat(
        ethers.utils.formatEther(
          ((minDeposit as unknown) as BigNumber).toString()
        )
      );
      setminAmount(_minDeposit);
      setAmount(_minDeposit);
    }
  }, [minDeposit]);

  async function support(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tx = await writeAsync({
        recklesslySetUnpreparedArgs: [
          process.env.NEXT_PUBLIC_BICONOMY_FUNDING_KEY!,
        ],
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
        description: getErrorMessage(error) ?? "Unknown error",
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
              All the support will go towards paying the gas fees for you and
              others. It may be used towards paying for storage, hosting, domain
              etc too.
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
                    min={minAmount}
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
