"use client";
import Link from "next/link";
import styles from "./header.module.css";
import DropdownArchive from "@/components/dropdownArchive/DropdownArchive";

export default function Header({ showArchive }) {
  return (
    <>
      <header>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {showArchive && <DropdownArchive />}
          </div>
          <div className={styles.headerCenter}>
            <h1 className={styles.headerTitle}>
              <Link href="/professors">FEEDBACK IESC</Link>
            </h1>
          </div>
          <div className={styles.headerRight}></div>
        </div>
        <div className={styles.dropdownContainer}>
          {showArchive && <DropdownArchive />}
        </div>
      </header>
    </>
  );
}
