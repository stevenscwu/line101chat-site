import { ImageResponse } from "next/og";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export default function Icon() { return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#345948", color: "#fafaf5", fontSize: 24, fontFamily: "serif", borderRadius: 7 }}>d</div>, size); }
