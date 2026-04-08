"use client";

const stats = [
  { label: "Active Users", value: "500K+" },
  { label: "Reviews Written", value: "2.4M" },
  { label: "Titles Indexed", value: "150K" },
  { label: "Ratings Average", value: "4.8" },
];

export default function StatisticsSection() {
  return (
    <section className="py-20 bg-primary/10 text-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-6xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary/70 font-medium uppercase tracking-widest text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
