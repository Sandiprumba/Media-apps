import { Flex, Image, useColorMode } from "@chakra-ui/react";

const Header = () => {
  //colorMode is a property provided byu chakra ui's useColormode hook that allows to access and control the current color mode of ui
  //TOGGLECOLORMODE IS A FUNCTION PROVIDED BY CHAKRA USECOLORMODE HOOK THAT ALLOWS TO TOGGLE BETWEEN COLOR MODES
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"center"} mt={6} mb="12">
      <Image cursor={"pointer"} alt="logo" w={6} src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"} onClick={toggleColorMode} />
    </Flex>
  );
};

export default Header;
