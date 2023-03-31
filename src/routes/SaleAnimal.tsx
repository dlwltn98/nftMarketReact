import React, { FC, useEffect, useState } from "react";
import { Grid } from "@chakra-ui/react";
import { IMyAnimalCard } from "../components/MyAnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenContract } from "../contracts";
import SaleAnimalCard from "../components/SaleAnimalCard";

interface SaleAnimalProps {
  account: string;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
  const [saleAnimalCardArr, setSaleAnimalCardArr] = useState<IMyAnimalCard[]>();

  // 리팩토링 필요
  const getOnSaleAnimalTokens = async () => {
    try {
      const onSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods
        .getOnSaleAnimalTokenArrayLength()
        .call();

      const tempOnSaleArr: IMyAnimalCard[] = [];
      for (let i = 0; i < parseInt(onSaleAnimalTokenArrayLength, 10); i++) {
        const animalTokenId = await saleAnimalTokenContract.methods
          .onSaleAnimalTokenArray(i)
          .call();

        const animalTy = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId)
          .call();

        const animalPrice = await saleAnimalTokenContract.methods
          .animalTokenPrices(animalTokenId)
          .call();

        tempOnSaleArr.push({ animalTokenId, animalTy, animalPrice });
      }
      setSaleAnimalCardArr(tempOnSaleArr);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleAnimalTokens();
  }, []);

  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {saleAnimalCardArr &&
        saleAnimalCardArr.map((v, i) => {
          return (
            <SaleAnimalCard
              key={i}
              animalTy={v.animalTy}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              account={account}
              getOnSaleAnimalTokens={getOnSaleAnimalTokens}
            />
          );
        })}
    </Grid>
  );
};

export default SaleAnimal;
