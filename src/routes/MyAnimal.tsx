import React, { FC, useEffect, useState } from "react";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import {
  mintAnimalTokenContract,
  saleAnimalTokenAddress,
  saleAnimalTokenContract,
} from "../contracts";
import MyAnimalCard, { IMyAnimalCard } from "../components/MyAnimalCard";

interface MyAnimalProps {
  account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(Boolean);

  const getAnimalTokens = async () => {
    try {
      // 민팅한 갯수
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(account)
        .call();

      if (balanceLength == "0") return;

      // 토큰 아이디로 타입을 알아내서 배열에 넣음
      const tempAnimalCardArr: IMyAnimalCard[] = [];

      const respones = await mintAnimalTokenContract.methods
        .getAnimalTokens(account)
        .call();
      respones.map((v: IMyAnimalCard) => {
        tempAnimalCardArr.push({
          animalTokenId: v.animalTokenId,
          animalTy: v.animalTy,
          animalPrice: v.animalPrice,
        });
      });

      setAnimalCardArray(tempAnimalCardArr);
    } catch (error) {
      console.error(error);
    }
  };

  const getIsApprovedForAll = async () => {
    try {
      const respones = await mintAnimalTokenContract.methods
        .isApprovedForAll(account, saleAnimalTokenAddress)
        .call();

      if (respones) {
        setSaleStatus(respones);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;

      const respones = await mintAnimalTokenContract.methods
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        .send({ from: account });

      if (respones.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;

    getIsApprovedForAll();
    getAnimalTokens();
  }, [account]);

  return (
    <>
      <Flex alignItems="center">
        <Text display="inline-block">
          Sale Status : {saleStatus ? "True" : "False"}
        </Text>
        <Button
          size="xs"
          ml={2}
          colorScheme={saleStatus ? "gray" : "whatsapp"}
          onClick={onClickApproveToggle}
        >
          {saleStatus ? "Cancel" : "Approved"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={4}>
        {animalCardArray &&
          animalCardArray.map((v, i) => {
            return (
              <MyAnimalCard
                key={i}
                animalTokenId={v.animalTokenId}
                animalTy={v.animalTy}
                animalPrice={v.animalPrice}
                saleStatus={saleStatus}
                account={account}
              />
            );
          })}
      </Grid>
    </>
  );
};

export default MyAnimal;
