import { SERVICE_NAME } from "@/lib/constants";

type EnterPageProps = {
  searchParams: Promise<{
    error?: string;
    from?: string;
  }>;
};

export default async function EnterPage({ searchParams }: EnterPageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";
  const from = params.from ?? "/";

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-black px-5 py-8 text-white">
      <section className="w-full max-w-sm rounded-lg bg-[#121212] p-6 shadow-soft">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold text-[rgb(var(--accent))]">Bridge</p>
          <h1 className="mt-3 text-balance text-2xl font-black leading-tight">
            {SERVICE_NAME}
          </h1>
        </div>

        <form action="/api/enter" method="post" className="space-y-5">
          <input type="hidden" name="from" value={from} />

          <div className="space-y-2">
            <label
              htmlFor="access-code"
              className="block text-sm font-bold text-white/72"
            >
              입장 코드
            </label>
            <input
              id="access-code"
              name="code"
              type="password"
              autoComplete="one-time-code"
              className="min-h-14 w-full rounded-lg border border-white/5 bg-white/10 px-4 text-lg font-bold text-white outline-none transition focus:bg-white/12 focus:ring-2 focus:ring-[rgb(var(--accent))]"
              required
            />
            {hasError ? (
              <p className="text-sm font-bold text-rose-300">
                입장 코드가 맞지 않아요.
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="min-h-14 w-full rounded-lg bg-[rgb(var(--accent))] px-4 text-lg font-black text-black transition active:scale-[0.99]"
          >
            들어가기
          </button>
        </form>
      </section>
    </main>
  );
}
