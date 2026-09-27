import type { Locale } from "./config";

/*
 * Templates to complete and have reviewed before launch. Text between
 * [brackets] is information we do not have yet; it is highlighted on the page.
 */

export type LegalSection = { title: string; paragraphs: string[] };

export type LegalDocument = {
  metaTitle: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const LEGAL_DOCUMENT_IDS = ["legal", "privacy", "terms"] as const;

export type LegalDocumentId = (typeof LEGAL_DOCUMENT_IDS)[number];

export function isLegalDocumentId(value: string): value is LegalDocumentId {
  return (LEGAL_DOCUMENT_IDS as readonly string[]).includes(value);
}

export const LEGAL_DOCUMENTS: Record<Locale, Record<LegalDocumentId, LegalDocument>> = {
  fr: {
    legal: {
      metaTitle: "Mentions légales",
      title: "Mentions légales.",
      updated: "Dernière mise à jour : [date]",
      intro:
        "Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, voici l’identité des intervenants du site.",
      sections: [
        {
          title: "Éditeur du site",
          paragraphs: [
            "Le site Nolio est édité par [nom ou raison sociale], [forme juridique] au capital de [montant] €, dont le siège social est situé [adresse complète].",
            "Immatriculation : [RCS ou RNE, numéro SIRET]. Numéro de TVA intracommunautaire : [numéro].",
            "Contact : [adresse email], [téléphone].",
          ],
        },
        {
          title: "Directeur de la publication",
          paragraphs: ["[Prénom Nom], en qualité de [fonction]."],
        },
        {
          title: "Hébergement",
          paragraphs: [
            "Le site est hébergé par [nom de l’hébergeur], [adresse de l’hébergeur], [téléphone de l’hébergeur].",
          ],
        },
        {
          title: "Propriété intellectuelle",
          paragraphs: [
            "L’ensemble des éléments du site (textes, marques, logos, mises en page, visuels et code) est la propriété de [nom ou raison sociale] ou fait l’objet d’une autorisation d’utilisation. Toute reproduction, représentation ou adaptation sans autorisation écrite préalable est interdite.",
            "Les photographies proviennent de banques d’images libres de droits. Les icônes des réseaux sociaux sont issues de Font Awesome Free, sous licence CC BY 4.0.",
          ],
        },
        {
          title: "Données personnelles",
          paragraphs: [
            "Le traitement de vos données est décrit dans la politique de confidentialité.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["Pour toute question sur le site, écrivez à [adresse email]."],
        },
      ],
    },
    privacy: {
      metaTitle: "Politique de confidentialité",
      title: "Politique de confidentialité.",
      updated: "Dernière mise à jour : [date]",
      intro:
        "Cette politique explique quelles données Nolio collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD).",
      sections: [
        {
          title: "Responsable du traitement",
          paragraphs: ["[Nom ou raison sociale], [adresse complète], joignable à [adresse email]."],
        },
        {
          title: "Données collectées",
          paragraphs: [
            "Compte : nom, adresse email et mot de passe, stocké sous forme hachée et jamais en clair.",
            "Contenus : les informations que vous saisissez pour créer vos ebooks (brief, plans, textes, choix de mise en page) et les fichiers exportés.",
            "Abonnement : formule choisie et historique de facturation. Les données de paiement sont traitées directement par notre prestataire de paiement et ne sont pas conservées par Nolio.",
            "Données techniques : journaux de connexion et informations nécessaires à la sécurité du service.",
          ],
        },
        {
          title: "Finalités et bases légales",
          paragraphs: [
            "Fournir le service et gérer votre compte : exécution du contrat.",
            "Facturer les abonnements : exécution du contrat et obligations légales.",
            "Assurer la sécurité et améliorer le service : intérêt légitime.",
            "Vous envoyer des nouvelles de Nolio : votre consentement, que vous pouvez retirer à tout moment.",
          ],
        },
        {
          title: "Génération par intelligence artificielle",
          paragraphs: [
            "Pour rédiger et mettre en page vos ebooks, les contenus que vous fournissez sont transmis à [fournisseur du modèle d’IA], uniquement pour produire votre ebook. [Préciser si ces contenus peuvent servir à l’entraînement de modèles, selon les conditions du fournisseur retenu.]",
          ],
        },
        {
          title: "Destinataires et sous-traitants",
          paragraphs: [
            "Vos données ne sont accessibles qu’aux personnes habilitées de [nom ou raison sociale] et à nos sous-traitants techniques : hébergement ([nom]), authentification ([nom]), paiement ([nom]), génération par IA ([nom]) et envoi d’emails ([nom]).",
            "Lorsque des données sont transférées hors de l’Union européenne, ce transfert est encadré par les clauses contractuelles types de la Commission européenne ou un mécanisme équivalent.",
          ],
        },
        {
          title: "Durées de conservation",
          paragraphs: [
            "Données de compte : pendant toute la durée du compte, puis [durée] après sa suppression.",
            "Contenus et fichiers : jusqu’à leur suppression par vous ou la fermeture du compte.",
            "Données de facturation : 10 ans, conformément aux obligations comptables.",
            "Journaux techniques : [durée, par exemple 12 mois].",
          ],
        },
        {
          title: "Vos droits",
          paragraphs: [
            "Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données, ainsi que du droit de définir des directives sur leur sort après votre décès.",
            "Pour les exercer, écrivez à [adresse email]. Nous vous répondons dans un délai d’un mois.",
            "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (cnil.fr).",
          ],
        },
        {
          title: "Cookies",
          paragraphs: [
            "Nolio utilise uniquement les cookies nécessaires au fonctionnement du site : la mémorisation de la langue choisie et, une fois les comptes ouverts, le maintien de votre session. Ils ne nécessitent pas votre consentement. Si des cookies de mesure d’audience ou de marketing sont ajoutés, un bandeau vous permettra de les accepter ou de les refuser.",
          ],
        },
      ],
    },
    terms: {
      metaTitle: "Conditions générales d’utilisation et de vente",
      title: "Conditions générales d’utilisation et de vente.",
      updated: "Dernière mise à jour : [date]",
      intro:
        "Ces conditions encadrent l’utilisation de Nolio et la souscription de ses formules. En créant un compte, vous les acceptez.",
      sections: [
        {
          title: "Objet",
          paragraphs: [
            "Nolio est un service en ligne d’aide à la création d’ebooks. Il permet de décrire un projet, de valider un plan, de générer et de modifier le contenu et la mise en page, puis d’exporter le résultat aux formats PDF et EPUB.",
          ],
        },
        {
          title: "Compte",
          paragraphs: [
            "Un compte est nécessaire pour utiliser le service. Vous vous engagez à fournir des informations exactes et à garder votre mot de passe confidentiel. Vous êtes responsable de l’activité réalisée depuis votre compte.",
          ],
        },
        {
          title: "Formules et prix",
          paragraphs: [
            "Nolio propose une formule gratuite et des formules payantes (Starter et Pro), dont le contenu et le prix sont indiqués sur la page Tarifs au moment de la souscription. Les prix sont exprimés en euros [toutes taxes comprises ou hors taxes].",
            "Les formules payantes sont facturées d’avance, chaque mois ou chaque année selon votre choix, et renouvelées automatiquement jusqu’à leur résiliation.",
          ],
        },
        {
          title: "Résiliation",
          paragraphs: [
            "Vous pouvez résilier votre abonnement à tout moment depuis votre compte. La résiliation prend effet à la fin de la période en cours ; aucun remboursement au prorata n’est dû, sauf disposition légale contraire.",
          ],
        },
        {
          title: "Droit de rétractation",
          paragraphs: [
            "Si vous êtes un consommateur, vous disposez de 14 jours à compter de la souscription pour vous rétracter. [Préciser les conséquences d’un accès immédiat au service pendant ce délai, à faire valider par un professionnel.]",
          ],
        },
        {
          title: "Vos contenus",
          paragraphs: [
            "Vous restez propriétaire des contenus que vous fournissez et des ebooks produits avec Nolio. Vous accordez à [nom ou raison sociale] une licence limitée à ce qui est nécessaire pour héberger, traiter et générer ces contenus afin de vous fournir le service.",
            "Vous garantissez disposer des droits sur les éléments que vous importez et vous vous engagez à ne pas utiliser Nolio pour produire des contenus illicites, trompeurs ou portant atteinte aux droits de tiers.",
          ],
        },
        {
          title: "Contenus générés",
          paragraphs: [
            "Les textes proposés par Nolio sont produits avec l’aide de l’intelligence artificielle. Vous restez responsable de leur relecture, de leur exactitude et de leur usage, en particulier pour les sujets médicaux, juridiques ou financiers.",
          ],
        },
        {
          title: "Disponibilité et responsabilité",
          paragraphs: [
            "Nous faisons notre possible pour assurer l’accès au service en continu, sans pouvoir le garantir. Notre responsabilité est limitée aux dommages directs et prévisibles, dans la limite des sommes versées au cours des douze derniers mois, sauf faute lourde ou disposition légale contraire.",
          ],
        },
        {
          title: "Données personnelles",
          paragraphs: ["Leur traitement est décrit dans la politique de confidentialité."],
        },
        {
          title: "Modification des conditions",
          paragraphs: [
            "Ces conditions peuvent évoluer. Toute modification importante vous sera notifiée au moins 30 jours avant son entrée en vigueur.",
          ],
        },
        {
          title: "Droit applicable et litiges",
          paragraphs: [
            "Ces conditions sont soumises au droit français. En cas de litige, une solution amiable est recherchée en priorité. Si vous êtes consommateur, vous pouvez recourir gratuitement au médiateur de la consommation [nom et coordonnées du médiateur]. À défaut, les tribunaux compétents sont ceux prévus par la loi.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["Pour toute question sur ces conditions, écrivez à [adresse email]."],
        },
      ],
    },
  },
  en: {
    legal: {
      metaTitle: "Legal notice",
      title: "Legal notice.",
      updated: "Last updated: [date]",
      intro:
        "In accordance with article 6 of French law no. 2004-575 of 21 June 2004 on confidence in the digital economy, here are the details of the parties involved in this website.",
      sections: [
        {
          title: "Publisher",
          paragraphs: [
            "The Nolio website is published by [name or company name], a [legal form] with a share capital of €[amount], whose registered office is at [full address].",
            "Registration: [trade register, SIRET number]. EU VAT number: [number].",
            "Contact: [email address], [phone].",
          ],
        },
        {
          title: "Publication director",
          paragraphs: ["[First name Last name], [role]."],
        },
        {
          title: "Hosting",
          paragraphs: ["The website is hosted by [host name], [host address], [host phone]."],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "All elements of the website (texts, trademarks, logos, layouts, visuals and code) belong to [name or company name] or are used with permission. Any reproduction, representation or adaptation without prior written consent is prohibited.",
            "Photographs come from royalty-free image libraries. Social media icons come from Font Awesome Free, licensed under CC BY 4.0.",
          ],
        },
        {
          title: "Personal data",
          paragraphs: ["How your data is processed is described in the privacy policy."],
        },
        {
          title: "Contact",
          paragraphs: ["For any question about the website, write to [email address]."],
        },
      ],
    },
    privacy: {
      metaTitle: "Privacy policy",
      title: "Privacy policy.",
      updated: "Last updated: [date]",
      intro:
        "This policy explains what data Nolio collects, why, how long it is kept and how to exercise your rights, in accordance with the General Data Protection Regulation (GDPR).",
      sections: [
        {
          title: "Data controller",
          paragraphs: ["[Name or company name], [full address], reachable at [email address]."],
        },
        {
          title: "Data we collect",
          paragraphs: [
            "Account: name, email address and password, stored hashed and never in plain text.",
            "Content: the information you enter to create your ebooks (brief, outlines, texts, layout choices) and the exported files.",
            "Subscription: chosen plan and billing history. Payment details are handled directly by our payment provider and are not kept by Nolio.",
            "Technical data: connection logs and the information needed to keep the service secure.",
          ],
        },
        {
          title: "Purposes and legal bases",
          paragraphs: [
            "Providing the service and managing your account: performance of the contract.",
            "Billing subscriptions: performance of the contract and legal obligations.",
            "Keeping the service secure and improving it: legitimate interest.",
            "Sending you news about Nolio: your consent, which you can withdraw at any time.",
          ],
        },
        {
          title: "Generation with artificial intelligence",
          paragraphs: [
            "To write and lay out your ebooks, the content you provide is sent to [AI model provider], only to produce your ebook. [State whether this content may be used to train models, according to the chosen provider's terms.]",
          ],
        },
        {
          title: "Recipients and processors",
          paragraphs: [
            "Your data is only accessible to authorized staff of [name or company name] and to our technical processors: hosting ([name]), authentication ([name]), payment ([name]), AI generation ([name]) and email delivery ([name]).",
            "When data is transferred outside the European Union, the transfer is covered by the European Commission's standard contractual clauses or an equivalent safeguard.",
          ],
        },
        {
          title: "Retention periods",
          paragraphs: [
            "Account data: for as long as the account exists, then [period] after its deletion.",
            "Content and files: until you delete them or close your account.",
            "Billing data: 10 years, as required by accounting law.",
            "Technical logs: [period, for example 12 months].",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "You have the right to access, rectify, erase, restrict, object to and port your data, and to set instructions for what happens to it after your death.",
            "To exercise these rights, write to [email address]. We reply within one month.",
            "If you believe your rights are not respected, you can lodge a complaint with the CNIL, the French data protection authority (cnil.fr).",
          ],
        },
        {
          title: "Cookies",
          paragraphs: [
            "Nolio only uses cookies that the website needs to work: remembering the language you chose and, once accounts open, keeping you signed in. They do not require your consent. If audience measurement or marketing cookies are added, a banner will let you accept or refuse them.",
          ],
        },
      ],
    },
    terms: {
      metaTitle: "Terms of use and sale",
      title: "Terms of use and sale.",
      updated: "Last updated: [date]",
      intro:
        "These terms govern the use of Nolio and the subscription to its plans. By creating an account, you accept them.",
      sections: [
        {
          title: "Purpose",
          paragraphs: [
            "Nolio is an online service that helps you create ebooks. It lets you describe a project, approve an outline, generate and edit the content and the layout, then export the result as PDF and EPUB.",
          ],
        },
        {
          title: "Account",
          paragraphs: [
            "An account is required to use the service. You agree to provide accurate information and to keep your password confidential. You are responsible for the activity carried out from your account.",
          ],
        },
        {
          title: "Plans and prices",
          paragraphs: [
            "Nolio offers a free plan and paid plans (Starter and Pro), whose content and price are shown on the Pricing page at the time of subscription. Prices are in euros [including or excluding taxes].",
            "Paid plans are billed in advance, monthly or yearly as you choose, and renew automatically until cancelled.",
          ],
        },
        {
          title: "Cancellation",
          paragraphs: [
            "You can cancel your subscription at any time from your account. Cancellation takes effect at the end of the current period; no prorated refund is due unless the law provides otherwise.",
          ],
        },
        {
          title: "Right of withdrawal",
          paragraphs: [
            "If you are a consumer, you have 14 days from subscription to withdraw. [Specify the consequences of immediate access to the service during this period, to be validated by a professional.]",
          ],
        },
        {
          title: "Your content",
          paragraphs: [
            "You keep ownership of the content you provide and of the ebooks produced with Nolio. You grant [name or company name] a license limited to what is needed to host, process and generate this content in order to provide the service.",
            "You warrant that you hold the rights to the material you import and agree not to use Nolio to produce unlawful or misleading content, or content that infringes the rights of others.",
          ],
        },
        {
          title: "Generated content",
          paragraphs: [
            "The texts Nolio suggests are produced with the help of artificial intelligence. You remain responsible for proofreading them, checking their accuracy and how you use them, especially on medical, legal or financial topics.",
          ],
        },
        {
          title: "Availability and liability",
          paragraphs: [
            "We do our best to keep the service available at all times, without being able to guarantee it. Our liability is limited to direct and foreseeable damage, up to the amounts paid during the last twelve months, except in case of gross negligence or where the law provides otherwise.",
          ],
        },
        {
          title: "Personal data",
          paragraphs: ["How your data is processed is described in the privacy policy."],
        },
        {
          title: "Changes to these terms",
          paragraphs: [
            "These terms may change. You will be notified of any significant change at least 30 days before it takes effect.",
          ],
        },
        {
          title: "Governing law and disputes",
          paragraphs: [
            "These terms are governed by French law. In case of dispute, an amicable solution is sought first. If you are a consumer, you can use the consumer mediator [name and contact details of the mediator] free of charge. Failing that, the courts designated by law have jurisdiction.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["For any question about these terms, write to [email address]."],
        },
      ],
    },
  },
};
