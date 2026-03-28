import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Family Hub</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage your shared family dashboard.
          </p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-400"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-400"
              placeholder="familyhub123"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
