
'use client'

import React from "react";
import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import styles from "../../../../styles/Navbar.module.css";
import Image from "next/image";
import logo from "../../../../styles/logo.png"


const Navbar: React.FC = () => {
  const categories = [
    "Home",
    "P2P Marketplace",
    "Carbon Credit",
    "Profile",
    
  ];

  return (
    <header className={styles.header}>
    <div className={styles.logoContainer}>
      <Link href="/" passHref>
      
          <Image
            className={styles.logo}
            src={logo}
            width="60"
            height="60"
            alt="Logo"
          />
     
      </Link>
    </div>
    <nav>
      <ul className={styles.menu}>
        {categories.map((category, index) => (
          <li key={index}>
            <Link
              href={category === "Home" ? "/" : `/${category.toLowerCase().replace(" ", "-")}`}
              passHref
            >
              {category}
            </Link>
          </li>
        ))}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <ConnectKitButton/>
        </div>
      </ul>
    </nav>
  </header>
);
}


export default Navbar;

