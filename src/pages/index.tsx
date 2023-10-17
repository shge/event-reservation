import Footer from '@/components/Footer';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>劇団XXX</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div>
          <Link href='/reserve'>
            <a>
              <p className='text-center'>
                <Image src='/XXX.webp' alt='劇団XXX' width='500' height='500' />
              </p>
            </a>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
