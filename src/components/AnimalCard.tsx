import React, { FC } from "react";
import { Image } from "@chakra-ui/react";

interface AnimalCardProps {
  animalTy: string;
}

const AnimalCard: FC<AnimalCardProps> = ({ animalTy }) => {
  return <Image w={150} h={150} src={`images/${animalTy}.png`} />;
};

export default AnimalCard;
