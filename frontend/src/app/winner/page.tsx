import { unstable_noStore as noStore } from 'next/cache';

type WinnerData = {
  _id: string;
  playerName: string;
  result: string;
  time: string;
  __v: number;
};

async function getWinnerBoard() {
  const res = await fetch(`http://localhost:3004/scoreboard`, {
    cache: 'no-store',
  });
  return res.json();
}
export default async function Winner() {
  noStore();
  const winnerData: WinnerData[] = await getWinnerBoard();

  return (
    <div className='flex flex-col items-center justify-start min-h-screen'>
      <div className='container mx-auto p-4 mt-8'>
        <h1 className='text-3xl font-bold mb-8 text-center text-lime-900'>
          Winner Scoreboard
        </h1>
        <table className='min-w-full divide-y divide-gray-200 text-lime-800'>
          <thead>
            <tr>
              <th className='py-2'>Player Name</th>
              <th className='py-2'>Result</th>
              <th className='py-2'>Time</th>
            </tr>
          </thead>
          <tbody>
            {winnerData.map(
              (item, index) =>
                index % 2 !== 0 && (
                  <tr key={item._id}>
                    <td className='py-2 text-center'>{item.playerName}</td>
                    <td className='py-2 text-center'>{item.result}</td>
                    <td className='py-2 text-center'>
                      {new Date(item.time).toLocaleString()}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
