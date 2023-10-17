import Footer from '@/components/Footer';
import ReserveDescription from '@/components/reserve/Description';
import ReserveForm from '@/components/reserve/Form';
import ReserveHead from '@/components/reserve/Head';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Image from 'next/image';

export default function ReservePage() {
  return (
    <>
      <CssBaseline />
      <ReserveHead />
      <main>
        <div className='z-[-1] fixed w-full h-screen opacity-40 left-0 top-0'>
          <Image src='/bg.webp' layout='fill' objectFit='cover' alt='ぼくのふね' />
        </div>
        <Container maxWidth='sm' sx={{ pt: 5 }} className=' bg-zinc-900/50 py-10 rounded-[15px]'>
          <ReserveDescription />
          <ReserveForm />
        </Container>
      </main>
      <Footer />
    </>
  );
}
