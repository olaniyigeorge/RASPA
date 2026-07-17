export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Contact us</h1>
      <form className="mt-8 space-y-4">
        <input
          name="name"
          placeholder="Full name"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <textarea
          name="message"
          placeholder="Message"
          rows={5}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-800"
        >
          Send message
        </button>
      </form>
      {/* TODO: wire this to a server action + email provider (Resend/SES) */}
    </div>
  );
}
