import { get } from "@/lib/api";
import FeatureGridClient from "./featureGridClient"; // ← নতুন file

export default async function FeatureGrid() {
  let prompts = [];
  let error = null;

  try {
    const data = await get("/analytics/featured-prompts");
    prompts = data || [];
  } catch (err) {
    error = err;
  }

  if (error) {
    return (
      <div className="container-xy">
        <div className="alert alert-error">
          <span>Failed to load featured prompts</span>
        </div>
      </div>
    );
  }

  // ✅ data fetch করে Client Component এ পাঠিয়ে দাও
  return <FeatureGridClient prompts={prompts} />;
}