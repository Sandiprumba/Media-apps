import { useState } from "react";

import { Avatar, Flex, Text, Image, Box, Divider, Button } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";

import Action from "../components/Action";
import Comment from "../components/Comment";

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark zukerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              Samson Rumba Lama
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>Let&apos;s Talk about Threads..</Text>
      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
        <Image src={"/post1.png"} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Action liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          238 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>🖐🏻</Text>
          <Text color={"gray.light"}>Get the app to like , reply and post..</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      <Comment comment="looks great keep on going" createdAt="2d" likes={100} username="Daddy" userAvatar="https://bit.ly/dan-abramov" />
      <Comment comment="looks great keep on going" createdAt="2d" likes={100} username="Momma" userAvatar="https://bit.ly/kent-c-dodds" />
      <Comment comment="looks great keep on going" createdAt="2d" likes={100} username="POPO" userAvatar="https://bit.ly/code-beast" />
    </>
  );
};

export default PostPage;
