export default function FeatureCard({ icon, title, subtitle }) {
  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-white shadow hover:shadow-lg transition-all duration-300 border border-white/30">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm opacity-90">{subtitle}</p>
    </div>
  );
}
