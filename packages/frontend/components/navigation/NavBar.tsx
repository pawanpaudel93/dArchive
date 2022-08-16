import { ReactNode } from "react";
import {
  Box,
  Flex,
  Link,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  useDisclosure,
  HStack,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";

interface NavItem {
  key: number;
  label: string;
  href?: string;
}

const NavItems: Array<NavItem> = [
  {
    key: 0,
    label: "Archive",
    href: "/archive",
  },
  {
    key: 1,
    label: "Search",
    href: "/search",
  },
];

const Logo = () => {
  return (
    <svg
      height={32}
      viewBox="0 0 35 28"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline" }}
    >
      <image xlinkHref="/logo.png" height="32" />
    </svg>
  );
};

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <NextLink href={href} passHref>
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
    >
      {children}
    </Link>
  </NextLink>
);

export const NavBar = function() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex as="header" position="fixed" w="100%" top={0} zIndex={1000}>
        <Box w="100%" bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <NextLink href="/" passHref>
                <Box cursor="pointer" p={2}>
                  {/* <Logo /> */}
                  <Heading size="md">dArchive</Heading>
                </Box>
              </NextLink>

              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {NavItems.map((navItem) => (
                  <NavLink key={navItem.key} href={navItem.href as string}>
                    {navItem.label}
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={3}>
                <Button onClick={toggleColorMode} mr={3}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
                <ConnectButton label="Sign in" accountStatus="avatar" />
              </Stack>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {NavItems.map((navItem) => (
                  <NavLink key={navItem.key} href={navItem.href as string}>
                    {navItem.label}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Flex>
    </>
  );
};
