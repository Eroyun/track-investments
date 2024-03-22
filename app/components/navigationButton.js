import React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const NavigationButton = ({ dataType }) => {
  const router = useRouter();

  const handleClick = () => {
    if (dataType !== "transactions") {
      router.push("/transactions");
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      startIcon={<ArrowBackIosIcon />}
      onClick={handleClick}
      disableRipple
    >
      {dataType !== "transactions" ? "Transactions" : "Holdings"}
    </Button>
  );
};

export default NavigationButton;
