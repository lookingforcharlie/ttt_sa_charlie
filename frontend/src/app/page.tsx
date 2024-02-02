import TicTacToe from '../components/TicTacToe';

// "undefined" means the URL will be computed from the `window.location` object
// const URL =
//   process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001';
export default function Home() {
  return (
    <main className='flex flex-col items-center min-h-screen mt-24'>
      <TicTacToe />
    </main>
  );
}
