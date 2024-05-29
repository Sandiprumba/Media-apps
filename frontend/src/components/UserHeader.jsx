import { Avatar, Box, Flex, VStack, Text, Link, MenuButton, Menu, Portal, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

// "http://localhost:5173/username";

const UserHeader = () => {
  //display the notification after its done....from chakra ui
  const toast = useToast();

  const HandleCopyURLClick = () => {
    //retrieve the current URL of the webpage
    const currentURL = window.location.href;
    //this line writes the currentutl to the clipboard it returns a promise and specify a callback function that will execute after the URL has been successfully copied to the clipboard.
    //DISPLAY THE MESSAGE USING TOAST AFTER COPING THE URL OF THE USER
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Account Copied",
        status: "success",
        description: "Profile Link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Samson Rumba Lama
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>samsonrumba</Text>
            {/* the color gray,dark is defined inside main.jsx and i am using here 
            ..IN CHAKRA UI YOU CAN DEFINE ATHEME IN ONE PLACE AND THEN ACCESS THE THEMES VALUES THROUGH OUT APPS USING CHAKRA UI STYLES PROPS OR CUSTOM CSS IN JS SYNTAX*/}
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name="Samson Rumba Lama"
            src="/zuck-avatar.png"
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>handsome and sexiest boy of the world...</Text>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>1m followers</Text>
          <Box w="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"grey.dark"}>
                  <MenuItem bg={"grey.dark"} onClick={HandleCopyURLClick}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
