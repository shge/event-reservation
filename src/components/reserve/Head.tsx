import Head from 'next/head';

export default function ReserveHead() {
  const siteName = '劇団XXX';
  const title = '劇団XXX 観劇予約フォーム';
  const description = '劇団XXX 観劇予約フォームです。2023年XX月YY日(曜) の全Zステージで、XXで行います。';
  const url = 'https://example.com/reserve';
  const imageUrl = 'https://example.com/flyer.webp';

  return (
    <Head>
      <title>{title}</title>
      <link rel='icon' href='/favicon.ico' />
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:url' content={url} />
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={imageUrl} />
      <meta name='twitter:site' content={siteName} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={imageUrl} />
      <meta name='twitter:card' content='summary_large_image' />
    </Head>
  );
}
