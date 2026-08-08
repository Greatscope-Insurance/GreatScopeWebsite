// Seeds the Greatscope website content into the Sanity project.
// Run with:  SANITY_TOKEN=sk... node scripts/seed-sanity.js
// The token is read from the environment only and never stored in this file.
'use strict';

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error('Set SANITY_TOKEN to a Sanity API token with write access and run again.');
  process.exit(1);
}

const PROJECT_ID = '10dparpu';
const DATASET = 'production';
const API_VERSION = '2026-02-01';
const ENDPOINT = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
const ASSET = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}`;
const READ = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

async function mutate(mutations) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutate failed (${res.status}): ${text.slice(0, 400)}`);
  }
  return res.json();
}

function sniffContentType(buf) {
  const l = buf.toString('latin1', 0, 12);
  if (buf.length >= 12 && l.slice(0, 4) === 'RIFF' && l.slice(8, 12) === 'WEBP') return 'image/webp';
  if (buf.length >= 8 && buf[0] === 0x89 && l.slice(1, 4) === 'PNG') return 'image/png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (l.slice(0, 3) === 'GIF') return 'image/gif';
  if (/^\s*(<svg|<\\?xml|<!DOCTYPE)/i.test(buf.toString('latin1', 0, 300))) return 'image/svg+xml';
  return 'image/png';
}

async function uploadImage(url, label) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${label} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = sniffContentType(buf);
  const up = await fetch(ASSET, {
    method: 'POST',
    headers: { 'Content-Type': ct, Authorization: `Bearer ${token}` },
    body: new Uint8Array(buf),
  });
  const json = await up.json();
  if (!up.ok) throw new Error(`upload ${label} (${ct}) -> ${up.status}: ${(json.message || '').slice(0, 150)}`);
  return { _type: 'image', asset: { _type: 'reference', _ref: json.document._id } };
}

const U = 'https://images.unsplash.com/';
const K = 'https://ik.imagekit.io/5zp8ovb7c/Greatscope/';

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  phone1: '0719 151 288',
  phone1Tel: '+254719151288',
  phone2: '0797 313 199',
  phone2Tel: '+254797313199',
  whatsapp: '254719151288',
  email: 'info@greatscopeinsurance.com',
  address: 'Portal Place House, 4th Floor, Muindi Mbingu Street, Nairobi',
  hours: 'Monday – Friday: 8:00 AM – 5:00 PM',
  footerText:
    'Greatscope serves as the unwavering bedrock of trust, providing steadfast commitment to safeguard what holds paramount importance across the varied realms of life, health, motor, and housing insurance.',
  socials: [
    { label: 'twitter', url: 'https://twitter.com/frankaizKenya' },
    { label: 'facebook', url: 'https://web.facebook.com/Greatscopeinsurance' },
    { label: 'linkedin', url: 'https://www.linkedin.com/company/greatscope-insurance-agency/' },
    { label: 'instagram', url: 'https://www.instagram.com/greatscopeinsurance/' },
  ],
};

const heroSlides = [
  { label: 'Health Insurance', title: 'Your health is your wealth', subtitle: 'Comprehensive medical cover for individuals, families and corporates — fast, efficient and professional care at the hour of need.', imageUrl: U + 'photo-1559757175-5700dde675bc?w=1600&q=80&fm=webp', exploreHref: 'insurance.html#health-insurance' },
  { label: 'Life & Pension', title: "Secure your family's future", subtitle: 'Flexible life cover, endowments and pension plans that give you and your loved ones lasting financial security.', imageUrl: U + 'photo-1511895426328-dc8714191300?w=1600&q=80&fm=webp', exploreHref: 'insurance.html#life-insurance' },
  { label: 'General Insurance', title: 'Protect your assets', subtitle: "Motor, property, travel, marine and liability cover that safeguards what you've worked hard to build.", imageUrl: U + 'photo-1560518883-ce09059eeffa?w=1600&q=80&fm=webp', exploreHref: 'insurance.html#general-insurance' },
];

const services = [
  { icon: 'fas fa-heartbeat', title: 'Health Insurance', description: 'Our health insurance provides a safety net, covering medical costs and promoting wellness for you and your family.', href: 'insurance.html#health-insurance' },
  { icon: 'fas fa-shield-heart', title: 'Life & Pension', description: 'Life and pension insurance ensuring financial security for you and your loved ones.', href: 'insurance.html#life-insurance' },
  { icon: 'fas fa-building-shield', title: 'General Insurance', description: 'General insurance safeguards assets against unforeseen events, offering peace of mind and financial protection.', href: 'insurance.html#general-insurance' },
];

const howItWorks = [
  { icon: 'fas fa-headset', title: 'Consult', description: 'Tell us about your needs and our certified professionals analyze the market for the right cover.' },
  { icon: 'fas fa-shield-halved', title: 'Insure', description: 'We compare quotes from 19+ leading insurers and tailor a policy recommendation just for you.' },
  { icon: 'fas fa-umbrella-beach', title: 'Relax', description: 'Enjoy ongoing support, renewals and fast-tracked claims handled with care when you need us.' },
];

const whyUs = [
  { icon: 'fas fa-headset', title: '24x7 Support', description: 'Round-the-clock peace of mind with our dedicated team.' },
  { icon: 'fas fa-crown', title: 'Premium Services', description: 'Exclusive, tailored solutions for those who expect the best.' },
  { icon: 'fas fa-handshake', title: 'Trusted Partners', description: "Backed by 19+ of East Africa's leading insurers." },
  { icon: 'fas fa-file-shield', title: 'Hassle-Free Claims', description: 'Fast-tracked claims handled with care and integrity.' },
];

const stats = [
  { value: '12+', label: 'Insurance Partners' },
  { value: '234+', label: 'Clients Covered' },
  { value: '99.7%', label: 'Satisfaction' },
  { value: '7', label: 'National Awards' },
];

const categories = [
  { title: 'Health Insurance', slug: { _type: 'slug', current: 'health-insurance' }, icon: 'fas fa-heartbeat', description: 'Comprehensive medical cover for individuals, families and corporates.', bannerImageUrl: U + 'photo-1559757175-5700dde675bc?w=1600&q=80&fm=webp', order: 0 },
  { title: 'Life Insurance', slug: { _type: 'slug', current: 'life-insurance' }, icon: 'fas fa-shield-heart', description: 'Financial security for you and your loved ones.', bannerImageUrl: U + 'photo-1511895426328-dc8714191300?w=1600&q=80&fm=webp', order: 1 },
  { title: 'Pensions', slug: { _type: 'slug', current: 'pension-insurance' }, icon: 'fas fa-piggy-bank', description: 'Retirement planning for a secure future.', bannerImageUrl: U + 'photo-1579621970563-ebec7560ff3e?w=1600&q=80&fm=webp', order: 2 },
  { title: 'General Insurance', slug: { _type: 'slug', current: 'general-insurance' }, icon: 'fas fa-building-shield', description: "Protect your assets against life's uncertainties.", bannerImageUrl: U + 'photo-1560472354-b33ff0c44a43?w=1600&q=80&fm=webp', order: 3 },
];

const products = [
  { key: 'individual-family-medical', title: 'Individual / Family Medical Insurance', desc: 'Comprehensive coverage to protect you and your loved ones from unexpected healthcare expenses.', img: 'photo-1579684385127-1ef15d508118', cat: 'health-insurance', order: 0 },
  { key: 'corporate-medical', title: 'Corporate Medical Insurance', desc: 'Protect your employees with comprehensive corporate medical coverage ensuring a healthy workforce.', img: 'photo-1666214280557-f1b5022eb634', cat: 'health-insurance', order: 1 },
  { key: 'group-last-expense', title: 'Group Last Expense Cover', desc: "Financial assistance for funeral expenses and related costs for employees' families.", img: 'photo-1526304640581-d334cdbbf45e', cat: 'life-insurance', order: 0 },
  { key: 'group-life', title: 'Group Life Cover', desc: "Financial protection for employees' families in the event of death.", img: 'photo-1593113598332-cd288d649433', cat: 'life-insurance', order: 1 },
  { key: 'whole-life', title: 'Whole Life Assurance', desc: 'Permanent life insurance with lifelong coverage and tax-deferred cash value.', img: 'photo-1533093818119-ac1fa47a6d59', cat: 'life-insurance', order: 2 },
  { key: 'credit-life', title: 'Credit Life Cover', desc: 'Pays off outstanding loan balances in case of death or disability.', img: 'photo-1554224155-6726b3ff858f', cat: 'life-insurance', order: 3 },
  { key: 'education-endowment', title: 'Education Endowment', desc: "Secures your child's educational future with a guaranteed payout upon maturity.", img: 'photo-1524178232363-1fb2b075b655', cat: 'life-insurance', order: 4 },
  { key: 'individual-pension', title: 'Individual Pension Plans', desc: 'Flexible retirement savings with regular contributions, tax benefits, and long-term growth potential.', img: 'photo-1554224155-6726b3ff858f', cat: 'pension-insurance', order: 0 },
  { key: 'umbrella-retirement', title: 'Umbrella Retirement', desc: 'Cost-effective pension solution for multiple employers under a single trust.', img: 'photo-1486312338219-ce68d2c6f44d', cat: 'pension-insurance', order: 1 },
  { key: 'motor', title: 'Motor Insurance', desc: 'Cover your vehicle against accidents, theft, and damage.', img: 'photo-1449965408869-eaa3f722e40d', cat: 'general-insurance', order: 0 },
  { key: 'goods-in-transit', title: 'Goods in Transit', desc: 'Safeguard your goods during transportation.', img: 'photo-1586528116311-ad8dd3c8310d', cat: 'general-insurance', order: 1 },
  { key: 'travel', title: 'Travel Insurance', desc: 'Protection for unexpected incidents during travel.', img: 'photo-1488085061387-422e29b40080', cat: 'general-insurance', order: 2 },
  { key: 'fire-and-perils', title: 'Fire and Perils', desc: 'Shield your property from fire and other perils.', img: 'photo-1580587771525-78b9dba3b914', cat: 'general-insurance', order: 3 },
  { key: 'burglary', title: 'Burglary Insurance', desc: 'Protect your property against theft and break-ins.', img: 'photo-1558002038-1055907df827', cat: 'general-insurance', order: 4 },
  { key: 'domestic-package', title: 'Domestic Package', desc: 'Comprehensive cover for your home and belongings.', img: 'photo-1484154218962-a197022b5858', cat: 'general-insurance', order: 5 },
  { key: 'contractors-all-risks', title: "Contractors' All Risks", desc: 'Cover for all risks associated with construction.', img: 'photo-1504917595217-d4dc5ebe6122', cat: 'general-insurance', order: 6 },
  { key: 'wiba-ecl', title: 'WIBA and ECL', desc: "Workers' compensation for injuries and diseases.", img: 'photo-1590602847861-f357a9332bbc', cat: 'general-insurance', order: 7 },
  { key: 'marine', title: 'Marine Insurance', desc: 'Cover for loss or damage of ships, cargo, and terminals.', img: 'photo-1439405326854-014607f694d7', cat: 'general-insurance', order: 8 },
  { key: 'personal-accident', title: 'Personal Accident', desc: 'Financial protection against accidents and loss of income.', img: 'photo-1588776814546-1ffcf47267a5', cat: 'general-insurance', order: 9 },
  { key: 'group-personal-accident', title: 'Group Personal Accident', desc: 'Comprehensive group coverage against accidents.', img: 'photo-1581091226825-a6a2a5aee158', cat: 'general-insurance', order: 10 },
  { key: 'fidelity-guarantee', title: 'Fidelity Guarantee', desc: 'Protection against employee dishonesty or fraud.', img: 'photo-1560472354-b33ff0c44a43', cat: 'general-insurance', order: 11 },
  { key: 'public-liability', title: 'Public Liability', desc: 'Protection against third-party injury or damage claims.', img: 'photo-1521791136064-7986c2920216', cat: 'general-insurance', order: 12 },
  { key: 'product-liability', title: 'Product Liability', desc: 'Protection against claims from product-related incidents.', img: 'photo-1507003211169-0a1dd7228f2d', cat: 'general-insurance', order: 13 },
];

const partners = [
  ['Occidental', 'Partners/occidental.webp?updatedAt=1708028480864'],
  ['APA insurance', 'Partners/apa.webp?updatedAt=1708028934382'],
  ['Heritage insurance', 'Partners/heritage.webp?updatedAt=1708028933679'],
  ['Directline', 'Partners/directline.webp?updatedAt=1708028935190'],
  ['CIC', 'Partners/cic.webp?updatedAt=1708028933828'],
  ['Fidelity', 'Partners/fidelity.webp?updatedAt=1708028933723'],
  ['GA', 'Partners/ga.webp?updatedAt=1708032123447'],
  ['ABSA Life', 'Partners/absa.webp?updatedAt=1708032123653'],
  ['AAR', 'Partners/aar.webp?updatedAt=1708033134033'],
  ['UAP', 'Partners/uap_old.webp?updatedAt=1708032933915'],
  ['Kenya Orient', 'Partners/korient.webp?updatedAt=1708032123835'],
  ['Definite Assurance', 'Partners/definite-assurance-brand.svg?tr=f-webp'],
  ['Britam', 'Partners/Britam.png?tr=f-webp'],
  ['Pioneer Insurance', 'Partners/pioneerlogo1.png?tr=f-webp'],
  ['Sanlam', 'Partners/sanlam2.png?tr=f-webp'],
  ['Allianz', 'Partners/allianz-logo.svg?tr=f-webp'],
  ['Prudential', 'Partners/prudential.jpg?updatedAt=1726301761707'],
  ['Monarch', 'Partners/Monarch.jpeg?updatedAt=1726301761684'],
  ['Kenindia', 'Partners/kenindia.jpg?updatedAt=1726302515386'],
];

const testimonials = [
  { name: 'Nicholas Ngeli', location: 'Nairobi', quote: 'Great services given expeditiously, honesty policy seems to be the order of the day.', rating: 4, avatarUrl: K + 'Testimonials/ngeli%20(1).webp?updatedAt=1710755861972' },
  { name: 'Ruth Mboya', location: 'Nairobi', quote: 'Greatscope thanks for giving us the best group last expense cover after explaining the pros and cons for all in the market.', rating: 4.5, avatarUrl: K + 'Testimonials/mboya%20(1).webp?updatedAt=1710755862204' },
  { name: 'Mat Hias', location: 'Nairobi', quote: 'The Insurance agency staff are professional, friendly and care about their customers. Thanks Greatscope for fast tracking my claim.', rating: 4.5, avatarUrl: K + 'Testimonials/mathias%20(1).webp?updatedAt=1710755861965' },
  { name: 'Kliss Kinyungu', location: 'Nairobi', quote: 'Simply amazing, your partner in eventualities.', rating: 4.5, avatarUrl: K + 'Testimonials/kliss%20(1).webp?updatedAt=1710755672770' },
];

const faqs = [
  ['What types of insurance do you offer?', 'We offer a comprehensive range of insurance plans including health, life, auto, and home insurance. Each plan can be customized to your specific requirements.'],
  ['How can I get a quote?', 'Contact us via phone, email, or our website form. A representative will respond with a personalized quote.'],
  ['What is the claim process?', 'Notify us immediately, submit the required paperwork, and our team will review and process your claim per your policy terms.'],
  ['Can I adjust my coverage?', "Yes. Contact us to discuss your changing needs and we'll modify your plan accordingly."],
  ['What payment methods do you accept?', 'We accept Mpesa, credit cards, bank transfers, and cheques with flexible monthly, quarterly, or annual plans.'],
  ['How can I contact customer service?', 'Call, email, or use our website contact form. Our team responds promptly.'],
];

const aboutBase = {
  leaderName: 'Francis Muendo AIIK',
  leaderTitle: 'Managing Director',
  leaderImageUrl: 'https://ik.imagekit.io/5zp8ovb7c/Kaiti%20Greening%20Champions/images/Leaders/Francis-Muendo.jpeg',
  leaderBio: [
    "Francis holds a bachelor's degree in Actuarial Science from Jomo Kenyatta University of Agriculture and Technology and a Diploma in Insurance from the College of Insurance.",
    'With over 8 years of experience in the insurance industry, Francis has worked for various insurance companies, specializing in Insurance Underwriting, Claims Management, and Marketing. He serves as an Executive Council Member at the Insurance Institute of Kenya, contributing to shaping industry policies and standards.',
  ],
  aboutParagraphs: [
    'Greatscope Insurance Agency is a premier insurance consultancy and brokerage firm that provides comprehensive insurance services to our valued clients across East Africa.',
    'Our extensive services portfolio includes Motor Insurance, Fire and Perils Insurance, Domestic Package Insurance, Contractors All Risks, WIBA and ECL, Personal Accident, Marine Insurance, Group Life Insurance, Travel Insurance, Goods in Transit, Medical Insurance, Credit Life Insurance, and Whole Life Insurance.',
    'We are committed to providing our clients with the highest quality of service, backed by expertise, integrity, and unwavering dedication to your protection needs.',
  ],
  visionTitle: 'Our Vision',
  visionText: 'To become the most sought after insurance consultancy and brokerage firm in East Africa.',
  missionTitle: 'Our Mission',
  missionText: 'To maintain the highest standards of integrity and professionalism in our relationship with our clients. To provide tailor made insurance solutions in a changing insurance market.',
  values: [
    { icon: 'fas fa-eye', title: 'Transparency', description: 'We value open and honest communication in all our interactions and business practices.' },
    { icon: 'fas fa-shield-halved', title: 'Integrity', description: 'We uphold the highest standards of honesty and ethical conduct in all our dealings.' },
    { icon: 'fas fa-heart', title: 'Customer Focus', description: "We strive to provide exceptional service and exceed our customers' expectations." },
    { icon: 'fas fa-lightbulb', title: 'Innovation', description: 'We continuously innovate to improve our products and services for better client experiences.' },
  ],
  keyNumbers: [
    { value: '12+', label: 'Insurance Partners' },
    { value: '99.7%', label: 'Customer Satisfaction' },
    { value: '7', label: 'National Awards' },
    { value: '234+', label: 'Clients Covered' },
  ],
};

function batches(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function uploads(items, fn, concurrency = 5) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

async function main() {
  console.log('Resetting managed document types...');
  await mutate([
    { delete: { query: '*[_type in ["productCategory", "product", "partner", "testimonial", "faq"]]' } },
  ]);

  console.log('Uploading images...');
  const heroWithImages = await uploads(heroSlides, async (s) => ({
    label: s.label,
    title: s.title,
    subtitle: s.subtitle,
    image: await uploadImage(s.imageUrl, 'hero ' + s.title),
    exploreHref: s.exploreHref,
  }));
  const catWithImages = await uploads(categories, async (c) => ({
    ...c,
    banner: await uploadImage(c.bannerImageUrl, 'banner ' + c.title),
  }));
  const prodWithImages = await uploads(products, async (p) => ({
    _type: 'product',
    key: p.key,
    title: p.title,
    description: p.desc,
    order: p.order,
    cat: p.cat,
    image: await uploadImage(U + p.img + '?w=800&q=80&fm=webp', 'product ' + p.title),
  }));
  const partnerWithImages = await uploads(partners, async ([name, file], i) => ({
    _type: 'partner',
    name,
    order: i,
    logo: await uploadImage(K + file, 'partner ' + name),
  }));
  const testimonialWithImages = await uploads(testimonials, async (t, i) => ({
    _type: 'testimonial',
    name: t.name,
    location: t.location,
    quote: t.quote,
    rating: t.rating,
    order: i,
    avatar: await uploadImage(t.avatarUrl, 'avatar ' + t.name),
  }));

  const homePage = {
    _id: 'homePage',
    _type: 'homePage',
    heroSlides: heroWithImages,
    services,
    howItWorks,
    whyUs,
    stats,
  };

  const aboutPage = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    leaderName: aboutBase.leaderName,
    leaderTitle: aboutBase.leaderTitle,
    leaderImage: await uploadImage(aboutBase.leaderImageUrl, 'leader'),
    leaderBio: aboutBase.leaderBio,
    aboutParagraphs: aboutBase.aboutParagraphs,
    visionTitle: aboutBase.visionTitle,
    visionText: aboutBase.visionText,
    missionTitle: aboutBase.missionTitle,
    missionText: aboutBase.missionText,
    values: aboutBase.values,
    keyNumbers: aboutBase.keyNumbers,
  };

  console.log('Upserting singletons (siteSettings, homePage, aboutPage)...');
  await mutate([{ createOrReplace: siteSettings }, { createOrReplace: homePage }, { createOrReplace: aboutPage }]);

  console.log(`Creating ${catWithImages.length} categories...`);
  await mutate(catWithImages.map((c) => ({ create: { _type: 'productCategory', ...c } })));

  const catRes = await fetch(READ + '?query=' + encodeURIComponent('*[_type == "productCategory"]{_id, "slug": slug.current}'));
  const catJson = await catRes.json();
  const slugToId = {};
  catJson.result.forEach((c) => {
    slugToId[c.slug] = c._id;
  });

  console.log(`Creating ${prodWithImages.length} products...`);
  const productDocs = prodWithImages.map((p) => ({
    ...p,
    category: { _type: 'reference', _ref: slugToId[p.cat] },
  }));
  for (const batch of batches(productDocs, 20)) {
    await mutate(batch.map((doc) => ({ create: doc })));
  }

  console.log(`Creating ${partnerWithImages.length} partners...`);
  for (const batch of batches(partnerWithImages, 20)) {
    await mutate(batch.map((doc) => ({ create: doc })));
  }

  console.log(`Creating ${testimonialWithImages.length} testimonials...`);
  await mutate(testimonialWithImages.map((t) => ({ create: t })));

  console.log(`Creating ${faqs.length} FAQs...`);
  await mutate(faqs.map(([question, answer], i) => ({ create: { _type: 'faq', question, answer, order: i } })));

  console.log('\nDone. Verify with:');
  console.log('  curl "https://10dparpu.apicdn.sanity.io/v2026-02-01/data/query/production?query=count(*)"');
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
