import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthForm } from "@/components/account/AuthForm";
import page from "@/components/pages/page.module.css";
import { SplitPage } from "@/components/site/SplitPage";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { configured } from "@/server/env";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/reset-password">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).account.reset.metaTitle };
}

/* Reached from the "new password" email, once the link has opened a session */
export default async function ResetPasswordPage({ params }: PageProps<"/[lang]/reset-password">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const t = dict.account.reset;

  return (
    <SplitPage lang={lang} dict={dict}>
      <p className={page.kicker}>{t.kicker}</p>
      <h1 className={page.title}>{t.title}</h1>

      <AuthForm
        mode="reset"
        lang={lang}
        remote={configured.supabase}
        messages={dict.account.messages}
        submit={t.submit}
        notice={dict.account.notice}
        fields={[
          {
            name: "password",
            label: dict.account.fields.password,
            type: "password",
            autoComplete: "new-password",
            hint: dict.account.fields.passwordHint,
            minLength: 8,
          },
        ]}
      />
    </SplitPage>
  );
}
