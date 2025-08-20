import Link from 'next/link';
export default function Admin(){
  return (
    <div>
      <div className="nav card">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/admin/items">Finished Goods</Link>
        <Link href="/admin/raw">Raw Materials</Link>
        <Link href="/admin/boms">BOMs</Link>
        <Link href="/admin/plants">Plants</Link>
      </div>
      <div className="card"><h2>Admin</h2><p>Manage master data.</p></div>
    </div>
  );
}
