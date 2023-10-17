import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Stack from '@mui/system/Stack';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const isPaymentRequired = false;

export default function ReserveForm() {
  interface FormInputs {
    date: string;
    name: string;
    email: string;
    phone: string;
    tickets_count: number;
    companions: string[];
  }

  const router = useRouter();
  const [status, setStatus] = useState('');
  const [companionCount, setCompanionCount] = useState(0);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>();
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setStatus('loading');
    console.log(data);
    if (companionCount > 0) data.companions = data.companions.filter((companion) => companion !== '');
    fetch('/api/reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        // Payment required
        if (isPaymentRequired) {
          if (res.status === 'proceed') {
            setStatus('');
            router.push(res.paymentUrl);
          } else if (res.status === 'waiting') {
            setStatus('');
            router.push('waiting');
          } else if (res.status === 'sold_out') {
            setStatus('sold_out');
          } else {
            throw new Error('予約が完了できませんでした');
          }

          // Payment not required
        } else {
          if (res.status === 'success') {
            setStatus('success');
            router.push('reserve/thanks');
          } else if (res.status === 'sold_out') {
            setStatus('sold_out');
          } else {
            throw new Error('予約が完了できませんでした');
          }
        }
      })

      .catch((err) => {
        console.log(err);
        setStatus('error');
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <form onSubmit={handleSubmit(onSubmit)} className='p-10 rounded-[15px] border-[0.5px] border-solid border-[#ccc]'>
        <Stack spacing={3}>
          <Controller
            name='date'
            control={control}
            defaultValue=''
            rules={{ required: '予約日時を選択してください' }}
            render={({ field }) => (
              <FormControl error={!!errors.date}>
                <FormLabel>予約日時</FormLabel>
                <RadioGroup {...field} aria-label='date' name='row-radio-buttons-group'>
                  <FormControlLabel value='XX月YY日(曜) XX:YY〜' control={<Radio />} label='XX月YY日(曜) XX:YY〜' />
                  <FormHelperText>{errors.date?.message}</FormHelperText>
                </RadioGroup>
              </FormControl>
            )}
          />
          <Controller
            name='name'
            control={control}
            defaultValue=''
            rules={{ required: true }}
            render={({ field }) => <TextField required label='お名前' {...field} error={!!errors.name} />}
          />
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{
              required: true,
              pattern: {
                value: /^[\w\-.+]+@([\w-]+\.)+[\w-]{2,}$/,
                message: 'メールアドレスの形式が正しくありません',
              },
            }}
            render={({ field }) => (
              <TextField
                required
                label='メールアドレス'
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name='phone'
            control={control}
            defaultValue=''
            rules={{
              required: true,
              pattern: {
                value: /^[\d-]{9,}$/,
                message: '電話番号の形式が正しくありません',
              },
            }}
            render={({ field }) => (
              <TextField
                required
                label='電話番号'
                {...field}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />
          <Controller
            name='tickets_count'
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <TextField
                required
                label='人数'
                type='number'
                inputProps={{ min: 1 }}
                {...field}
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  setCompanionCount(count > 1 ? count - 1 : 0);
                  field.onChange(e);
                }}
              />
            )}
          />
          {companionCount > 0 && (
            <>
              {Array.from({ length: companionCount }).map((_, index) => (
                <Controller
                  key={index}
                  name={`companions.${index}`}
                  control={control}
                  defaultValue=''
                  render={({ field }) => <TextField required label={`同行者名${index + 1}`} {...field} />}
                />
              ))}
            </>
          )}
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant='contained'
              size='large'
              type='submit'
              className='bg-[#a38d3c] w-full'
              disabled={status === 'loading'}
            >
              予約する
            </Button>
            {status === 'loading' && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          {status === 'error' && (
            <Alert severity='error'>
              予約が完了できませんでした。申し訳ございませんが、しばらくお待ちいただいても問題が発生する場合は、
              <a href='mailto:example@gmail.com'>example@gmail.com</a>
              へお問い合わせください。
            </Alert>
          )}
          {status === 'sold_out' && (
            <Alert severity='error'>
              ご指定いただいた数のお席をご用意できませんでした。大変申し訳ございませんが、別の日時をご指定ください。
            </Alert>
          )}
        </Stack>
      </form>
    </ThemeProvider>
  );
}
