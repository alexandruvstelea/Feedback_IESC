import ProgressContainer from "./ProgressContainer";
import StarRating from "./StarRating";
import React, { useState, useEffect } from 'react';

export default function RatingOverview({ subjectId }) {
  const [data, setData] = useState({});
  async function fetchRatingData(subjectId, setData) {
    const url = `${process.env.REACT_APP_API_URL}/ratingsnumber/${subjectId}`;

    try {
      const response = await fetch(url, { method: "GET" });

      if (response.status === 404) {
        alert("Data not found for the given subject ID");
        throw new Error('404 Not Found');
      }

      const data = await response.json();
      const total = Object.values(data).reduce((acc, val) => acc + val, 0);
      const percentageData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, parseFloat((value / total * 100).toFixed(1))])
      );
      setData(percentageData);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchRatingData(subjectId, setData);
  }, [subjectId]);
  return (
    <>
      <div className="rating-overview">
        <ProgressContainer name="Nota 1" percentage={data['1_rating']} />
        <ProgressContainer name="Nota 2" percentage={data['2_rating']} />
        <ProgressContainer name="Nota 3" percentage={data['3_rating']} />
        <ProgressContainer name="Nota 4" percentage={data['4_rating']} />
        <ProgressContainer name="Nota 5" percentage={data['5_rating']} />

        <StarRating subjectId={subjectId} />
      </div>
    </>
  )
}