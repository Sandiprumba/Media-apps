import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader.jsx";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  //FETCH THE USER AND PASSED IT TO THE USERHEADER COMPONENT pass it via props and imp

  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPost] = useState(true);

  useEffect(() => {
    //get the post of the user
    const getsPosts = async () => {
      if (!user) return;
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPost(false);
      }
    };

    getsPosts();
  }, [username, showToast, setPosts, user]);

  //when component first render user might be null or uninitialized in this case we dont want to render the component until the user data is available to prevent displaying incomplete or incorrect information..
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User Not Found!!</h1>;

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not Posted anything yet.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
