import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

import {
  Flex,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Button,
  Input,
  ModalFooter,
  useDisclosure,
  ModalHeader,
} from "@chakra-ui/react";
import postsAtom from "../atoms/postsAtom";

//props renamed cause declared state variable named post ...
const Action = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();

  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false); //liking post process takes time so to make it
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");

  const handleLikeAndUnlike = async () => {
    if (!user) return showToast("Error", "You must be logged in to like the post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts/like/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      showToast("Success", "Liked post success", "success");
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      console.log(data);

      if (!liked) {
        //add the id of the current user to post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        //remove the id of the current user from post likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user) return showToast("Error", "You must be logged in to reply the post", "error");
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch("/api/posts/reply/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        //json.strigify converts the js obj created into json string
        body: JSON.stringify({ text: reply }), //create a JSON string representation of an object single prop text whose value is reply
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      //updated replies
      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);

      showToast("Success", "Reply posted successfully", "success");
      setReply("");
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };
  return (
    <Flex flexDirection={"column"}>
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237,73,86" : ""}
          fill={liked ? "rgb(237,73,86)" : "transparent"}
          height="24"
          role="img"
          viewBox="0 0 24 22"
          width="24"
          onClick={handleLikeAndUnlike}
        >
          <title>Like</title>
          <path
            d="M1.34375 7.53125L1.34375 7.54043C1.34374 8.04211 1.34372 8.76295 1.6611 9.65585C1.9795 10.5516 2.60026 11.5779 3.77681 12.7544C5.59273 14.5704 7.58105 16.0215 8.33387 16.5497C8.73525 16.8313 9.26573 16.8313 9.66705 16.5496C10.4197 16.0213 12.4074 14.5703 14.2232 12.7544C15.3997 11.5779 16.0205 10.5516 16.3389 9.65585C16.6563 8.76296 16.6563 8.04211 16.6562 7.54043V7.53125C16.6562 5.23466 15.0849 3.25 12.6562 3.25C11.5214 3.25 10.6433 3.78244 9.99228 4.45476C9.59009 4.87012 9.26356 5.3491 9 5.81533C8.73645 5.3491 8.40991 4.87012 8.00772 4.45476C7.35672 3.78244 6.47861 3.25 5.34375 3.25C2.9151 3.25 1.34375 5.23466 1.34375 7.53125Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg aria-label="Comment" color="fill" height="24" role="img" viewBox="0 0 24 24" width="24" onClick={onOpen}>
          <title>Comment</title>
          <path
            d="M15.376 13.2177L16.2861 16.7955L12.7106 15.8848C12.6781 15.8848 12.6131 15.8848 12.5806 15.8848C11.3779 16.5678 9.94767 16.8931 8.41995 16.7955C4.94194 16.5353 2.08152 13.7381 1.72397 10.2578C1.2689 5.63919 5.13697 1.76863 9.75264 2.22399C13.2307 2.58177 16.0261 5.41151 16.2861 8.92429C16.4161 10.453 16.0586 11.8841 15.376 13.0876C15.376 13.1526 15.376 13.1852 15.376 13.2177Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
        <RepostSVG />
        <ShareSVG />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post?.replies?.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post?.likes?.length} likes
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input placeholder="Reply goes here" value={reply} onChange={(e) => setReply(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} size={"sm"} onClick={handleReply} isLoading={isReplying}>
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Action;

const RepostSVG = () => {
  return (
    <svg aria-label="Repost" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <title>Repost</title>
      <path d="M6.41256 1.23531C6.6349 0.971277 7.02918 0.937481 7.29321 1.15982L9.96509 3.40982C10.1022 3.52528 10.1831 3.69404 10.1873 3.87324C10.1915 4.05243 10.1186 4.2248 9.98706 4.34656L7.31518 6.81971C7.06186 7.05419 6.66643 7.03892 6.43196 6.7856C6.19748 6.53228 6.21275 6.13685 6.46607 5.90237L7.9672 4.51289H5.20312C3.68434 4.51289 2.45312 5.74411 2.45312 7.26289V9.51289V11.7629C2.45312 13.2817 3.68434 14.5129 5.20312 14.5129C5.5483 14.5129 5.82812 14.7927 5.82812 15.1379C5.82812 15.4831 5.5483 15.7629 5.20312 15.7629C2.99399 15.7629 1.20312 13.972 1.20312 11.7629V9.51289V7.26289C1.20312 5.05375 2.99399 3.26289 5.20312 3.26289H7.85002L6.48804 2.11596C6.22401 1.89362 6.19021 1.49934 6.41256 1.23531Z"></path>
      <path d="M11.5874 17.7904C11.3651 18.0545 10.9708 18.0883 10.7068 17.8659L8.03491 15.6159C7.89781 15.5005 7.81687 15.3317 7.81267 15.1525C7.80847 14.9733 7.8814 14.801 8.01294 14.6792L10.6848 12.206C10.9381 11.9716 11.3336 11.9868 11.568 12.2402C11.8025 12.4935 11.7872 12.8889 11.5339 13.1234L10.0328 14.5129H12.7969C14.3157 14.5129 15.5469 13.2816 15.5469 11.7629V9.51286V7.26286C15.5469 5.74408 14.3157 4.51286 12.7969 4.51286C12.4517 4.51286 12.1719 4.23304 12.1719 3.88786C12.1719 3.54269 12.4517 3.26286 12.7969 3.26286C15.006 3.26286 16.7969 5.05373 16.7969 7.26286V9.51286V11.7629C16.7969 13.972 15.006 15.7629 12.7969 15.7629H10.15L11.512 16.9098C11.776 17.1321 11.8098 17.5264 11.5874 17.7904Z"></path>
    </svg>
  );
};

const ShareSVG = () => {
  return (
    <svg aria-label="Share" role="img" viewBox="0 0 24 24" color="" fill="(243,245,247)" height="20" width="20">
      <title>Share</title>

      <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
  );
};
