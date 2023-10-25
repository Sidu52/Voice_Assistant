import React from 'react'
import axios from 'axios';

export default function Apitexter() {
  const findapitext = async () => {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather?units=metric&q=Gwalior&appid=3635ccdd49d8c5ef64d414c92a92a6c2");
    console.log(response.data)
  }
  return (
    <div>
      <button onClick={findapitext}>DAta</button>
    </div>
  )
}
