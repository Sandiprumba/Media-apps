import authScreenAtom from "../atoms/authAtoms.js";
import { useRecoilValue } from "recoil";

import LoginCard from "../components/LoginCard.jsx";
import SignupCard from "../components/SignupCard.jsx";

//EVERY STATE IS A ATOMS IN RECOIL

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);

  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;
