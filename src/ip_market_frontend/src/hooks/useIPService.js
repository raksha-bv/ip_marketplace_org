import { useAuth } from "../context/AuthProvider";
import { Principal } from "@dfinity/principal";

export const useIPService = () => {
  const { actor, principal } = useAuth(); // ✅ use context

  const getUserIPs = async () => {
    if (!principal) throw new Error("Principal is undefined");
    const principalObj = Principal.fromText(principal); // ✅ safe now
    return await actor.get_user_ips(principalObj);
  };

  const mintNFT = async (payload) => {
    return await actor.mint_ip_nft(payload);
  };

  const getNFTMETADATA = async (nftId) => {
    if (!nftId) throw new Error("NFT ID is required");
    return await actor.get_nft_metadata(nftId);
  };

  return { getUserIPs, mintNFT };
};
