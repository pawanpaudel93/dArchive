import { Save } from "@/components/save";

export default function Archive() {
  return (
    <div
      style={{
        minHeight: "60vh",
        flex: "1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Save />
    </div>
  );
}
