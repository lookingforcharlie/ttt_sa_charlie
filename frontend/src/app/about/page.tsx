import Image from 'next/image';
import diagram from '../ttt_diagram.png';

export default function About() {
  return (
    <div className='flex items-center justify-center min-h-screen p-24 -mt-24'>
      <Image
        src={diagram}
        alt='tic tac toe diagram'
        width={800}
        className='p-12'
      />
    </div>
  );
}
