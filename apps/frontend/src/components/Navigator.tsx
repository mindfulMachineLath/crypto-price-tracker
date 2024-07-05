import { Link } from 'react-router-dom';

function Navigator() {
  return (
    <nav className="flex text-xl flex-row gap-10 md:gap-20 justify-center py-4">
      {[
        { path: '/bitcoin', label: 'BITCOIN' },
        { path: '/ethereum', label: 'ETHEREUM' },
        { path: '/dogecoin', label: 'DOGE COIN' },
      ].map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="hover:text-blue-500 transition-colors duration-300"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default Navigator;
