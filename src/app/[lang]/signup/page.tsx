import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import account from "@/components/account/account.module.css";
import { AuthForm } from "@/components/account/AuthForm";
import form from "@/components/account/AuthForm.module.css";
import page from "@/components/pages/page.module.css";
import { SplitPage } from "@/components/site/SplitPage";
import { hasLocale } from "@/i18n/config";
import { formatPrice } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/signup">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).account.signup.metaTitle };
}

export default async function SignupPage({
  params,
  searchParams,
}: PageProps<"/[lang]/signup">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { plan: requested } = await searchParams;
  const dict = getDictionary(lang);
  const t = dict.account.signup;
  const fields = dict.account.fields;
  const plan =
    dict.pricing.plans.find((candidate) => candidate.id === requested) ??
    dict.pricing.plans[0];

  return (
    <SplitPage lang={lang} dict={dict} current="signup">
      <p className={page.kicker}>{t.kicker}</p>
      <h1 className={page.title}>{t.title}</h1>
      <p className={account.plan}>
        {t.plan} <strong>{plan.name}</strong>, {formatPrice(lang, plan.monthly)}{" "}
        {dict.pricing.perMonth}. <Link href={`/${lang}#pricing`}>{t.changePlan}</Link>
      </p>

      <AuthForm
        redirectTo={`/${lang}/app/welcome`}
        submit={t.submit}
        notice={dict.account.notice}
        fields={[
          { name: "name", label: fields.name, type: "text", autoComplete: "name" },
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
            autoComplete: "new-password",
            hint: fields.passwordHint,
            minLength: 8,
          },
        ]}
        extra={
          <label className={form.consent}>
            <input type="checkbox" name="consent" required />
            <span>
              {t.consent.before}
              <Link href={`/${lang}/terms`}>{t.consent.terms}</Link>
              {t.consent.between}
              <Link href={`/${lang}/privacy`}>{t.consent.privacy}</Link>
              {t.consent.after}
            </span>
          </label>
        }
      />

      <p className={account.alt}>
        {t.alt} <Link href={`/${lang}/login`}>{t.altLink}</Link>
      </p>
    </SplitPage>
  );
}
