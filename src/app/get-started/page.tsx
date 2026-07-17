export default function GetStartedPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">List a property</h1>
      <p className="mt-4 text-gray-600">
        This is where agents create listings. Hook this up to a multi-step
        form (mirroring your CoopWise onboarding-wizard pattern) that POSTs
        to <code className="rounded bg-gray-100 px-1.5 py-0.5">/api/properties</code>.
      </p>
    </div>
  );
}
