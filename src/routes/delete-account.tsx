import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { TopHeader } from "@/components/app/TopHeader";
import { SITE } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/delete-account")({
  head: () => ({
    meta: [
      { title: "অ্যাকাউন্ট মুছে ফেলা — 7AWAKE NEWS NETWORK DIGITAL" },
      { name: "description", content: "How to delete your 7AWAKE NEWS NETWORK DIGITAL account and data." },
      { property: "og:title", content: "Delete your account — 7AWAKE NEWS NETWORK DIGITAL" },
      { property: "og:description", content: "Steps to permanently delete your account and associated data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeleteAccount,
});

function DeleteAccount() {
  const { language } = useLanguage();
  const bn = language === "bn";
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent("Account deletion request")}`;
  return (
    <AppShell>
      <TopHeader subtitle={bn ? "অ্যাকাউন্ট মুছুন" : "Delete account"} />
      <div className="mt-6 space-y-4 px-5 text-sm leading-relaxed">
        <h1 className="font-display text-xl">{bn ? "অ্যাকাউন্ট ও তথ্য মুছে ফেলা" : "Delete your account and data"}</h1>
        <p className="text-muted-foreground">
          {bn
            ? "অ্যাপে: লগইন করুন → প্রোফাইল → \"অ্যাকাউন্ট মুছে ফেলুন\"। নিশ্চিত করলে আপনার লগইন অ্যাকাউন্ট, প্রোফাইল (নাম, ইমেল) ও ভূমিকা তথ্য সঙ্গে সঙ্গে স্থায়ীভাবে মুছে যায়।"
            : "In the app: sign in → Profile → \"Delete account\". After you confirm, your sign-in account, profile (name, email) and role record are permanently deleted right away."}
        </p>
        <p className="text-muted-foreground">
          {bn
            ? "অ্যাপ ব্যবহার করতে না পারলে, যে ইমেল দিয়ে অ্যাকাউন্ট খুলেছিলেন সেখান থেকে আমাদের ইমেল করুন। আমরা পরিচয় যাচাই করে অ্যাকাউন্ট মুছে দেব।"
            : "If you can't use the app, email us from the address you signed up with. We will verify the request and delete the account."}
        </p>
        <p className="text-muted-foreground">
          {bn
            ? "নিরাপত্তার জন্য সার্ভারে থাকা প্রযুক্তিগত লগ আমাদের পরিষেবা প্রদানকারীর নিয়ম অনুযায়ী সীমিত সময় পরে স্বয়ংক্রিয়ভাবে মুছে যায়।"
            : "Technical security logs held by our hosting provider are removed automatically after a limited period under that provider's retention rules."}
        </p>
        <a href={mail} className="font-medium text-primary">{SITE.email}</a>
        <p>
          <Link to="/privacy" className="text-primary">{bn ? "গোপনীয়তা নীতি" : "Privacy Policy"}</Link>
        </p>
      </div>
    </AppShell>
  );
}
