import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import account from "@/components/account/account.module.css";
import { AuthForm } from "@/components/account/AuthForm";
import page from "@/components/pages/page.module.css";
import { SplitPage } from "@/components/site/SplitPage";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/forgot-password">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).account.forgot.metaTitle };
}

export default async function ForgotPasswordPage({
  params,
}: PageProps<"/[lang]/forgot-password">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const t = dict.account.forgot;

  return (
    <SplitPage lang={lang} dict={dict}>
      <p className={page.kicker}>{t.kicker}</p>
      <h1 className={page.title}>{t.title}</h1>
      <p className={page.lead}>{t.lead}</p>

      <AuthForm
        submit={t.submit}
        notice={dict.account.notice}
        fields={[
          {
            name: "email",
            label: dict.account.fields.email,
            type: "email",
            autoComplete: "email",
            placeholder: dict.account.fields.emailPlaceholder,
          },
        ]}
      />

      <p className={account.alt}>
        {t.alt} <Link href={`/${lang}/login`}>{t.altLink}</Link>
      </p>
    </SplitPage>
  );
}
