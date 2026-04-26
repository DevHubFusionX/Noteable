# Re-enabling Auth

## 1. `src/proxy.ts`
Uncomment everything inside the `proxy` function and remove the `return NextResponse.next()` at the top.
Also uncomment the `TOKEN_KEYS` import at the top.

```ts
import { TOKEN_KEYS } from "@/lib/constants";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  if (!isDashboard) return NextResponse.next();
  const token = req.cookies.get(TOKEN_KEYS.access)?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
```

---

## 2. `src/app/dashboard/layout.tsx`
Uncomment the `useEffect` auth guard and the `if (!isAuthenticated) return null` line (~line 23–31).

```ts
useEffect(() => {
  fetchMe().then(() => {
    if (!useAuthStore.getState().isAuthenticated) {
      router.replace("/");
    }
  });
}, []);

if (!isAuthenticated) return null;
```
