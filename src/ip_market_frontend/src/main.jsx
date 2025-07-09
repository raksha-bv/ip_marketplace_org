import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import MarketPlace from "./pages/MarketPlace";
import MintNFT from "./pages/MintNFT";
import NFTDetails from "./pages/NFTDetails";
import NFTExplorer from "./pages/NFTExplorer";
import ListNFTForSale from "./pages/ListNFTForSale";
import SelectNFTToList from "./pages/SelectNFTToList";
import BuyNFT from "./pages/BuyNFT";
import BidNFT from "./pages/BidNFT";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import IPSearch from "./pages/IPSearch";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<MarketPlace />} />
      <Route path="/marketplace/list" element={<SelectNFTToList />} />
      <Route path="/mint-nft" element={<MintNFT />} />
      <Route path="/explore" element={<NFTExplorer />} />
      <Route path="/search" element={<IPSearch />} />

      {/* NFT Routes */}
      <Route path="/nft/:nftId" element={<NFTDetails />} />
      <Route path="/nft/:nftId/list" element={<ListNFTForSale />} />

      {/* Marketplace Routes */}
      <Route path="/listing/:listingId/buy" element={<BuyNFT />} />
      <Route path="/listing/:listingId/bid" element={<BidNFT />} />

      {/* User Profile Routes */}
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
