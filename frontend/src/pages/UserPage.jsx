import UserHeader from "../components/UserHeader.jsx";
import UserPost from "../components/UserPost.jsx";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="lets go " />
      <UserPost likes={200} replies={481} postImg="/post1.png" postTitle="lets go second " />
      <UserPost likes={100} replies={481} postImg="/post1.png" postTitle="lets go third " />
      <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="lets go fourth" />
    </>
  );
};

export default UserPage;
