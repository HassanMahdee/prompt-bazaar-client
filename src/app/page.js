import HeroBanner from "@/components/homepage/banner/banner";
import FeatureGrid from "@/components/homepage/featureSection/featureGrid";
import WhyChooseUs from "@/components/homepage/whyChooseUsSection/whyChooseUs";
import TopCreators from "@/components/homepage/topCreators/topCreators";
import CustomerReviews from "@/components/homepage/customerReviewSection/customerReview";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FeatureGrid />
      <WhyChooseUs />
      <TopCreators />
      <CustomerReviews />
    </div>
  );
}
