import Link from 'next/link';
import QuestionsPage from './questions';
import SolutionsPage from './solutions';

export default function Home() {
  return (
    <div>
      <Link href="/">
        <QuestionsPage/>
      </Link>
      <Link href="/solutions">
        <SolutionsPage/>
      </Link>
    </div>
  );
}