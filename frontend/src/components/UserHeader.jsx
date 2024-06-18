import { Avatar, Box, Flex, VStack, Text, Link, MenuButton, Menu, Portal, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

// "http://localhost:5173/username";

//this is the user that we look in to their profile
const UserHeader = ({ user }) => {
  console.log("props passed", user);
  const { name, username, bio, profilePic, followers } = user;

  //GET THE CURRENT USER that is logged in
  const currentUser = useRecoilValue(userAtom);
  //check the user is follwing or not
  const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
  const [updating, setUpdating] = useState(false);

  //display the notification after its done....from chakra ui

  const showToast = useShowToast();

  const HandleCopyURLClick = () => {
    //retrieve the current URL of the webpage
    const currentURL = window.location.href;
    //this line writes the currentutl to the clipboard it returns a promise and specify a callback function that will execute after the URL has been successfully copied to the clipboard.
    //DISPLAY THE MESSAGE USING TOAST AFTER COPING THE URL OF THE USER
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Account copied", "success", "Profile link copied");
    });
  };

  //follow unfollow user
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }

    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      showToast("Success", "followed successfully");
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `unfollowed ${user.name}`, "success");
        user.followers.pop(); //simulates removing from followers
      } else {
        showToast("Success", `followed ${user.name}`, "success");
        user.followers.push(currentUser?._id); //simulates adding to followers
      }
      setFollowing(!following);
      console.log(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{username}</Text>
            {/* the color gray,dark is defined inside main.jsx and i am using here 
            ..IN CHAKRA UI YOU CAN DEFINE ATHEME IN ONE PLACE AND THEN ACCESS THE THEMES VALUES THROUGH OUT APPS USING CHAKRA UI STYLES PROPS OR CUSTOM CSS IN JS SYNTAX*/}
            <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {profilePic && (
            <Avatar
              name={name}
              src={profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!profilePic && (
            <Avatar
              name={name}
              src="/zuck-avatar.png"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{bio}</Text>

      {currentUser?._id === user._id && (
        // to ensure navigation behaviour remain consistent
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>update profile</Button>
        </Link>
      )}
      {/* else display follow ...ISLOADING IS A PROP FROM CHAKRA  */}
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "unfollow" : "follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{followers.length} followers</Text>
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
