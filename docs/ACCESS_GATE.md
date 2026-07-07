# Access Gate

Bridge uses a simple access-code gate before the study app is shown.

This is not full authentication. It is a lightweight barrier to limit casual sharing while the app is being developed and tested.

## Configuration

Set `BRIDGE_ACCESS_CODE` in Vercel environment variables.

For local development only, the fallback access code is:

```text
MGB
```

The production code must not be hardcoded into client-side code.

## Cookie

Successful entry sets an `httpOnly` cookie named `bridge_access` for about 90 days.

The cookie is used only to remember that the visitor entered the access code. It is for limiting casual sharing, not for tracking users.

## Public Repository Warning

The full dataset should not be added while the GitHub repository is public.

The access gate protects the deployed app route, but it does not make public source code or public repository content private.
