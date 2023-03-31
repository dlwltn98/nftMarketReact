import React, { FC } from "react";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Stack h="100vh">
      <Flex
        bg="purple.200"
        p={4}
        justifyContent="space-around"
        alignItems="center"
      >
        <Box>
          <Text fontWeight="bold" fontSize={25}>
            dlwltn98-Animals
          </Text>
        </Box>
        <Link to="/">
          <Button size="sm" w={150} h={35} colorScheme="purple">
            Main
          </Button>
        </Link>
        <Link to="/MyAnimal">
          <Button size="sm" w={150} h={35} colorScheme="purple">
            My Animal
          </Button>
        </Link>
        <Link to="/SaleAnimal">
          <Button size="sm" w={150} h={35} colorScheme="purple">
            Sale Animal
          </Button>
        </Link>
      </Flex>
      <Flex
        direction="column"
        h="full"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Flex>
    </Stack>
  );
};

export default Layout;
