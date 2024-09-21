import React from "react";

const Card = () => {
  const busNames = [
    "City Express",
    "Rapid Transit",
    "Metro Rider",
    "Skyline Shuttle",
    "Sunrise Express",
    "Green Valley Coach",
    "Riverfront Rapid",
    "Sunset Cruiser",
    "Ocean Breeze Transit",
    "Blue Horizon Bus",
    "Golden Gate Coach",
    "Mountain Trail Transit",
    "Lakeside Shuttle",
    "Silver Starline",
    "Urban Glide",
    "Harbor View Express",
    "Highway Pioneer",
    "Countryside Cruiser",
    "Forest Grove Transit",
    "Central Park Shuttle",
  ];

  const busRandNum = Math.floor(Math.random() * 20);
  const busRand = busNames[busRandNum];

  const value = Math.floor(Math.random() * 10) + 1;
  const num = Math.floor(Math.random() * 10000) + 1;
  const fin = 4 - num.toString().length;
  let f = "";
  for (let i = 0; i < fin; i++) {
    f = f + "0";
  }
  f = f + num;

  // let color = "#" + Math.floor(Math.random() * 255)
  let red = Math.floor(Math.random() * 220);
  let green = Math.floor(Math.random() * 220);
  let blue = Math.floor(Math.random() * 220);
  const color = `rgb(${red}, ${green}, ${blue})`;

  return (
    <div className="border rounded-lg py-6 px-6">
      <div className="text-xl font-bold">{busRand}</div>
      <div className="text-muted-foreground">source - destination</div>
      <div>{`KL ${busRandNum} D ${f}`}</div>
      <div className="pt-2">
        color{" "}
        <span
          className="ms-1 w-3 rounded-full aspect-square inline-block"
          style={{ backgroundColor: color }}
        ></span>
      </div>
      <div className="text-3xl font-bold tracking-tighter flex mt-4">
        {value}{" "}
        <span className="ms-1 text-3xl self-end">{`${
          value != 1 ? "schedules" : "schedule"
        }`}</span>
      </div>
    </div>
  );
};

export default Card;
