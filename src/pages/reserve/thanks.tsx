import Footer from '@/components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Head from 'next/head';
import Image from 'next/image';

export default function ReserveThanks() {
  return (
    <>
      <Head>
        <title>ご予約ありがとうございます｜劇団XXX『公演YYY』</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='z-[-1] fixed w-full h-screen opacity-40 left-0 top-0'>
        <Image src='/bg.webp' layout='fill' objectFit='cover' alt='公演YYY' />
      </div>
      <main className='container mx-auto px-4 w-96'>
        <div className='flex justify-center mt-8'>
          <Image src='/XXX.webp' width={200} height={200} alt='劇団XXX' />
        </div>
        <h1 className='text-center text-4xl mb-8' style={{ fontFamily: 'Yomogi' }}>
          もう一度、
          <br className='sm:hidden' />
          のぼってゆけ魚たち
        </h1>
        <h2 className='text-center m-0 mt-4'>
          <CheckCircleIcon sx={{ fontSize: 60, color: '#0dc216' }} />
        </h2>
        <h2 className='text-center m-0'>予約完了</h2>
        <p className='text-center'>
          ご予約が確定いたしました。
          <br />
          確認メールをお送りいたしましたので、ご確認ください。
        </p>
        <p className='text-center'>当日お会いできることを楽しみにしております。</p>
      </main>
      <Footer />
    </>
  );
}
