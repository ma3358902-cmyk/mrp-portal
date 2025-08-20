import Link from 'next/link';
export default function Home(){
  return (
    <div className="card">
      <h1>MRP Portal</h1>
      <p>Go to <Link href="/login">Login</Link>.</p>
    </div>
  );
}
