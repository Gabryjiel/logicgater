import "./marker.css";
import { cl } from "../lib/cl";
import { PIXELS_PER_CHIP } from "../providers/constants";
import { useAppSelector } from "../providers/redux";

export function Marker() {
  const marker = useAppSelector((state) => state.marker);

  return (
        <div
          className={cl("marker", {
            idle: marker.status === "idle",
            placed: marker.status === "placed",
            holding: marker.status === "holding",
          })}
          style={{
            top: PIXELS_PER_CHIP * marker.position.y,
            left: PIXELS_PER_CHIP * marker.position.x,
          }}
        />
  )
}
