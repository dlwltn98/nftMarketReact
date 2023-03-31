import React, { FC, useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import AnimalCard from "./AnimalCard";
import {
  mintAnimalTokenContract,
  saleAnimalTokenContract,
  web3,
} from "../contracts";

interface SaleAnimalCardProps {
  animalTy: string;
  animalPrice: string;
  animalTokenId: string;
  account: string;
  getOnSaleAnimalTokens: () => Promise<void>;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  animalTy,
  animalPrice,
  animalTokenId,
  account,
  getOnSaleAnimalTokens,
}) => {
  const [isBuyable, setIsBuyable] = useState<boolean>(false);

  const getAnimalTokenOwner = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        .ownerOf(animalTokenId)
        .call();

      setIsBuyable(
        response.toLocaleLowerCase() === account.toLocaleLowerCase()
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!account) return;

      const respones = await saleAnimalTokenContract.methods
        .purchaseAnimalToken(animalTokenId)
        .send({ from: account, value: animalPrice });

      if (respones.status) {
        getOnSaleAnimalTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnimalTokenOwner();
  });
  return (
    <Box textAlign="center" w={150}>
      <AnimalCard animalTy={animalTy} />
      <Box>
        <Text d="inline-block">{web3.utils.fromWei(animalPrice)} Matic</Text>
        <Button
          size="sm"
          colorScheme="purple"
          m={2}
          disabled={isBuyable}
          onClick={onClickBuy}
        >
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;
