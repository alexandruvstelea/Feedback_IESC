'use client'
import Image from 'next/image'
import React, { useState } from 'react';
import Subject from './Subject';
import styles from './card.module.css'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default function Card({ professor }) {

  const [isFlipped, setIsFlipped] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageNumber = getRandomInt(1, 17);
  const imagePath = professor.gender === 'male' ? `/images/maleImages/M16.png` : "/images/femaleAvatar4.png";

  async function fetchSubject(professor_id) {
    if (!isLoaded) {
      const selectedYear = sessionStorage.getItem("selectedYear");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const adjustedYear = currentMonth < 10 ? currentYear - 1 : currentYear;
      let url = ''
      if (selectedYear == adjustedYear) { url = `${process.env.REACT_APP_API_URL}/subjects/professor/${professor_id}` }
      else { url = `${process.env.REACT_APP_API_URL}/subjects_archive/professor/${selectedYear}/${professor_id}` }

      try {
        const response = await fetch(url);
        const complete_response = await response.json();
        setSubjects(complete_response);
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      fetchSubject(professor.id);
    }
  };


  return (
    <>
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
        <div className={styles.content}>
          <div className={styles.front}>
            <div className={styles.imageContent}>
              <span className={styles.overlay}></span>
              <div className={styles.cardImage}>
                <Image
                  width={158}
                  height={158}
                  src={imagePath}
                  alt="Avatar"
                  className={styles.cardImg} />
              </div>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.name}>{professor.first_name} {professor.last_name}</h2>
              <button className={styles.buttonCard} onClick={flipCard}>Vezi Cursuri</button>
            </div>
          </div>
          <div className={styles.back}>

            <h1 className={styles.titleCurs}>Cursuri:</h1>
            <ul className={styles.coursesList} >
              {isLoaded && subjects.map(subject => (
                <Subject key={subject.id} subject={subject} />
              ))}
            </ul>
            <button className={`${styles.buttonCard} ${styles.backButton}`} onClick={flipCard}>Înapoi</button>
          </div>
        </div>
      </div >
    </>
  )
}