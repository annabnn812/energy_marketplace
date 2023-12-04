
import Footer from "@/components/instructionsComponent/navigation/footer";
import React from "react";
import Header from "./header";
import ATable from "./Table"
import Image from 'next/image'
import styles from "../styles/Home.module.css";

  
export default function EnergyMarket() {
  return (
    <>
   <Header/>
   <h1 className="text-2xl-semi text-gry-900" style={{ display: "flex", color: "#4c5a6c" ,justifyContent: "center", fontSize: 30 }}>P2P MarketPlace</h1>
   <div className={styles.block_meter_container}>
      <iframe
        width='50%'
        height="450"
        style={{ border: 0 }}
        src="https://indibad9103080ce.maps.arcgis.com/apps/mapviewer/index.html?webmap=18c8754c04624fb3b5cec14dc79621d8&extent=71.2699,17.7681,97.1756,30.3525"
        allowFullScreen={true}
      ></iframe>
      <div className={styles.meter_container}>
      <Image
      src="/met.gif"
      width={300}
      height={300}
      alt="Meter"
    />
    <header className={styles.header_container}>
        <div className={styles.header}>
          <h3>
          <span>Your Smart meter connected to the red zone</span> 
          <Image
      src="/red.jpg"
      width={30}
      height={30}
      alt="red"
    />
          </h3>
        </div>
      </header>
      <h4>Here is a list sellers from your zone</h4>
          </div>
          </div>

        <ATable />
      <Footer/>
    </>
  );
}

      

