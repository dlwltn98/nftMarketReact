import React, { FC, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalTy, setNewAnimalTy] = useState<string>();

  const onClickMint = async () => {
    try {
      if (!account) return; // 계정이 없는 경우

      const respones = await mintAnimalTokenContract.methods
        .mintAnimalToken()
        .send({ from: account });

      if (respones.status) {
        // 민팅한 갯수 알아냄
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(account)
          .call();

        // 동물 토큰 아이디 얻음
        const animalTokenId = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 1)
          .call();

        // 동물 토큰 아이디로 동물 카드의 종류가 무엇인지 알아냄
        const animalTy = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId)
          .call();

        setNewAnimalTy(animalTy);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Box>
        {newAnimalTy ? (
          <AnimalCard animalTy={newAnimalTy} />
        ) : (
          <Text>Let's mint Animal Card!!!</Text>
        )}
      </Box>
      <Button mt={4} size="sm" colorScheme="purple" onClick={onClickMint}>
        Mint
      </Button>
    </Flex>
  );
};

export default Main;
