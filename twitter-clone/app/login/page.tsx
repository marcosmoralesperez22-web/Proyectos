// app/login/page.tsx
import { getProviders } from "next-auth/react";

export default async function LoginPage() {
  const providers = await getProviders();

  return (
    <div>
      {providers &&
        Object.values(providers).map((provider) => (
          <button key={provider.name}>{provider.name}</button>
        ))}
    </div>
  );
}
