// src/components/illustrations/CloudShapes.jsx
import Cloud1 from "./images/cloud1.svg";
import Cloud2 from "./images/cloud2.svg";
import Cloud3 from "./images/cloud3.svg";

export default function CloudShape({ type = "A", color = "#FFFFFF", size = 200 }) {
  const common = {
    width: size,
    height: size * 0.6,
    fill: color,
  };

  switch (type) {
    case "A":
      return <Cloud1 {...common} />;
    case "B":
      return <Cloud2 {...common} />;
    case "C":
      return <Cloud3 {...common} />;
    default:
      return <Cloud1 {...common} />;
  }
}
