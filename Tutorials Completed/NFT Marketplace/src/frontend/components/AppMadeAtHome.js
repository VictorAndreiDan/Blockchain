
import logo from './logo.png';
import './App.css';
import { ethers } from 'ethers';
import { useState } from 'react';
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import Navigation from './Navbar.js'
import{
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './Home.js'
import Create from './Create.js'
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
import { Spinner } from 'react-bootstrap';

function App() {
  //create useState variable for storing on the front end
  const [account, setAccount]         = useState(null);
  const [nft, setNFT]                 = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [loading, setLoading]         = useState(true);

  //login metamask
  const web3Handler = async () =>{
    //get provide for metamask
    const provider    = new ethers.providers.Web3Provider(window.ethereum);
    //get accounts from metamask
    const accounts    = await window.ethereum.request({method: 'eth_requestAccounts'});
    //console.log(accounts[0]);
    //set first account from metamask for front end
    setAccount(accounts[0]);
    //get signers
    const signer      = provider.getSigner();
    //load the contracts from the blockchain
    loadContracts(signer);
  }
  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
    setLoading(false);
  }

  return (
    <BrowserRouter>
    <div className = "App">
      <Navigation web3Handler={web3Handler} account = {account}/>
      <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Create marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          )}
        </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
