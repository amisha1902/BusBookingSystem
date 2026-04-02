import { motion } from "framer-motion";
import bus from "../assets/bus.png";

export default function BusAnimation() {
  return (
    <div style={styles.container}>
      
      <motion.img
        src={bus}
        alt="bus"
        initial={{ x: "100vw" }}
        animate={{ x: "-120%" }}
        transition={{
          duration: 10, 
          ease: "linear",
          repeat: Infinity,
        }}
        style={styles.bus}
      />

    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    overflow: "hidden",
  },
  bus: {
    width: "260px",
    display: "block",
  },
};