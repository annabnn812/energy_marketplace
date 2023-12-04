import Footer from "@/components/instructionsComponent/navigation/footer";
import Header from "./header";
import styles from "../styles/Home.module.css";
import styl from "../styles/Card.module.css";
import React, { useState, useEffect } from 'react';
import CarbonForm from "./SellerForm";
import PendingNFT from "./displayPendingNFT"
import ListedNFT from "./forMarket"



export default function Marketplace() {
  


  return (
    <>
    <Header/>
    <div className={styles.box_acc}>
      <h1 className="text-2xl-semi text-gry-900" style={{ display: "flex", color: "#4c5a6c" ,justifyContent: "center", fontSize: 30 }}>Carbon Credit MarketPlace</h1>
      <div className={styl.container}>
      <div style={{ display: "flex", alignItems: "left", minHeight: "60%", color: "#4c5a6c" }}>
        <h2>Seller Form</h2>
      </div>
      <CarbonForm />
      </div>
      <div style={{ display: "flex", alignItems: "left", minHeight: "60%",justifyContent: "center", color: "#4c5a6c" }}>
        <h2>Pending stock</h2>
      </div>
     <PendingNFT />
      &nbsp;
      &nbsp;
      <div className={styl.container}>
      <div style={{ display: "flex", alignItems: "left", minHeight: "60%", color: "#4c5a6c" }}>
        &nbsp;
      &nbsp;
        <h2>ECO Marketplace </h2>
      </div>
         &nbsp;
       <ListedNFT />
    </div>
     </div>
     <Footer/>
     </>
  );
}

      