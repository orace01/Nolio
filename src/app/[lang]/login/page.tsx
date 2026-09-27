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
}: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).account.login.metaTitle };
}

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const t = dict.account.login;
  const fields = dict.account.fields;

  return (
    <SplitPage lang={lang} dict={dict} current="login">
      <p className={page.kicker}>{t.kicker}</p>
      <h1 className={page.title}>{t.title}</h1>

      <AuthForm
        submit={t.submit}
        notice={dict.account.notice}
        fields={[
          {
            name: "email",
            label: fields.email,
            type: "email",
            autoComplete: "email",
            placeholder: fields.emailPlaceholder,
          },
          {
            name: "password",
            label: fields.password,
            type: "password",
            autoComplete: "current-password",
          },
        ]}
        extra={
          <Link href={`/${lang}/forgot-password`} className={account.forgot}>
            {t.forgot}
          </Link>
        }
      />

      <p className={account.alt}>
        {t.alt} <Link href={`/${lang}/signup`}>{t.altLink}</Link>
      </p>
    </SplitPage>
  );
}
