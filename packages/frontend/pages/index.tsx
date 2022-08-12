import { Save } from "@/components/save";
import { Search } from "@/components/search";

export default function Home() {
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
      <br />
      <Search />
    </div>
  );
}
