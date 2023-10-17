import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import Image from 'next/image';

export default function ReserveDescription() {
  return (
    <div className='mb-12'>
      <div className='flex justify-center'>
        <Image src='/XXX.webp' width={200} height={200} alt='劇団XXX' />
      </div>
      <div className='flex justify-center'>
        <Image src='/title.webp' width={550} height={120} alt='『公演YYY』' />
      </div>

      <p className='mt-12'>劇団XXX『公演YYY』の観劇予約フォームです。</p>
      <h4>◆ 公演日程</h4>
      <p>2023年XX月YY日 全Zステージ</p>
      <ul>
        <li>XX月YY日(曜) XX:YY〜</li>
      </ul>

      <p>※ 開場/受付開始は開演30分前となります。予約日時をご確認の上、開演時間の10分前までにお越しくださいませ。</p>
      <p>
        ※
        感染状況によっては公演をやむを得ず中止する場合がございます。ご了承ください。その際はご記入いただいたメールアドレスにご連絡させていただきます。
      </p>

      <h4>◆ 劇場アクセス</h4>

      <h4>◆ お問い合わせ</h4>
      <p>
        <EmailIcon className='align-[-0.4rem]' /> E-mail: <a href='mailto:example@gmail.com'>example@gmail.com</a>
        <br />
        <TwitterIcon className='align-[-0.4rem]' /> Twitter:{' '}
        <a href='https://twitter.com/x' target='_blank'>
          @x
        </a>
      </p>
    </div>
  );
}
