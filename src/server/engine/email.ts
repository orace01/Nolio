import { env } from "../env";

/*
 * "We will email you as soon as it is ready": sent through Resend when a
 * key is set, skipped otherwise.
 */
export async function sendReadyEmail(input: { to: string; lang: string; title: string; link: string }) {
  if (!env.resendKey) return;
  const fr = input.lang === "fr";
  const subject = fr ? `Votre ebook « ${input.title} » est prêt` : `Your ebook “${input.title}” is ready`;
  const body = fr
    ? `<p>Bonne nouvelle : votre ebook <strong>${escapeHtml(input.title)}</strong> est prêt.</p><p><a href="${input.link}">Le feuilleter et le télécharger</a></p><p>L’équipe Nolio</p>`
    : `<p>Good news: your ebook <strong>${escapeHtml(input.title)}</strong> is ready.</p><p><a href="${input.link}">Browse and download it</a></p><p>The Nolio team</p>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.emailFrom, to: input.to, subject, html: body }),
  });
  if (!response.ok) console.error("email not sent", response.status, await response.text());
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);
}
