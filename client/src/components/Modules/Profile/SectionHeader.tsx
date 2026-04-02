export default function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8 pb-5 border-b border-white/5">
      <h2 className="text-lg font-medium mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}