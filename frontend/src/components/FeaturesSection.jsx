import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-10">Why Use ARMOR?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon="🔍" 
            title="Verify UPI IDs" 
            subtitle="Instantly check if a UPI ID is safe or reported as fraudulent."
          />
          <FeatureCard 
            icon="🚨" 
            title="Report Frauds" 
            subtitle="Help protect others by reporting suspicious UPI accounts."
          />
          <FeatureCard 
            icon="📊" 
            title="Track & Analyze" 
            subtitle="View fraud trends and verified reports in real-time."
          />
        </div>
      </div>
    </section>
  );
}
