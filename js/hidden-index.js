const select = document.getElementById("weather");
const para = document.getElementById("weather-comment");

const gumball = document.getElementById("gumball");
const gumballText = document.getElementById("gumball-text");

select.addEventListener("change", setWeather);
gumball.addEventListener("click", dispenseGumball);

const gumballs = ["go for a walk in seward park", "dump the compost", "vacuum", "play some simon & garfunkel"]

function dispenseGumball() {
  const currGumballNum = Math.floor(Math.random() * gumballs.length);
  console.log(currGumballNum);
  gumballText.textContent = gumballs[currGumballNum];
}

function setWeather() {
  const choice = select.value;

  switch (choice) {
    case "sunny":
      para.textContent =
        "It is nice and sunny outside today. Wear shorts! Go to the beach, or the park, and get an ice cream.";
      break;
    case "rainy":
      para.textContent =
        "Rain is falling outside; take a rain coat and an umbrella, and don't stay out for too long.";
      break;
    case "snowing":
      alert("WHOAAA")
      para.textContent =
        "The snow is coming down — it is freezing! Best to stay in with a cup of hot chocolate, or go build a snowman.";
      break;
    case "overcast":
      para.textContent =
        "It isn't raining, but the sky is grey and gloomy; it could turn any minute, so take a rain coat just in case.";
      break;
    default:
      para.textContent = "";
  }
}