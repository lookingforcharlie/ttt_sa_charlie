import Image from 'next/image';
import Link from 'next/link';
import ttt_icon from '../app/ttt_icon.png';

export default function Header() {
  return (
    <header className='flex items-center justify-between px-4 py-2 bg-gray-200'>
      <div className='flex items-center space-x-2'>
        <Image src={ttt_icon} width={60} alt='Tic Tac Toe Icon'></Image>
        <h1 className='text-2xl md:text-4xl font-bold px-8'>Tic Tac Toe</h1>
      </div>

      <nav className='flex space-x-4'>
        <Link className='text-lg font-medium hover:underline' href='/'>
          Game
        </Link>
        <Link className='text-lg font-medium hover:underline' href='/winner'>
          Winner
        </Link>
        <Link className='text-lg font-medium hover:underline' href='/about'>
          About
        </Link>
      </nav>
    </header>
  );
}
