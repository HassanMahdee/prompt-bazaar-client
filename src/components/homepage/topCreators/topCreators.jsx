import { get } from "@/lib/api";
import TopCreatorsClient from "./topCreatorsClient"; // ← যোগ করো

export default async function TopCreators() {
  let creators = [];
  let error = null;

  try {
    const data = await get("/analytics/top-creators");
    creators = data || [];
  } catch (err) {
    error = err;
  }

  if (error)
    return (
      <section className="container-xy">
        <div className="alert alert-error">
          <span>Failed to load top creators</span>
        </div>
      </section>
    );

  if (creators.length === 0) return null;

  // ✅ শুধু data পাঠাও
  return <TopCreatorsClient creators={creators} />;
}
