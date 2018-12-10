import { CardProps } from "../frontend/Card";

function toCard(data): CardProps {
  return data.map( classData => {
    return {
      header: `${classData.subject} ${classData.number}`,
      subheader: classData.name,
    }
  });
}

export default toCard;
