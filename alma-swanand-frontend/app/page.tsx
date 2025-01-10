import LeadForm from "@/components/lead-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          <div className="absolute -top-12 -left-12 w-48 h-48">
            <div className="absolute w-32 h-32 bg-[#C5D86D] rounded-full opacity-80" />
            <div className="absolute top-12 left-12 w-24 h-24 bg-[#C5D86D] rounded-full opacity-60" />
            <div className="absolute top-20 left-20 w-16 h-16 bg-[#C5D86D] rounded-full opacity-40" />
          </div>
        </div>
        <LeadForm />
      </div>
    </main>
  );
}
