import { useUser } from './UserContex.js';

export const useAuth = () => {
  const { setUserId } = useUser();

  const handleSignIn = async (authResult) => {
    const userId = authResult.user.uid;
    setUserId(userId);
  };

  return { handleSignIn };
};