import Link from "next/link";
import { Home, Book, MessageCircle, Info } from "lucide-react";

export async function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Book className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">MuniCode Chat</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center hover:text-gray-300">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link href="/chat" className="flex items-center hover:text-gray-300">
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>Chat</span>
            </Link>
            <Link href="/about" className="flex items-center hover:text-gray-300">
              <Info className="h-5 w-5 mr-1" />
              <span>About</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

// import { createClient } from "@/utils/supabase/server";
// import Link from "next/link";

// export default async function NavBar() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return (
//     <nav className="w-full py-4 bg-gray-800 text-white">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-lg font-bold">
//           <Link href="/">MyApp</Link>
//         </div>
//         <div className="flex gap-4">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <Link href="/about" className="hover:underline">
//             About
//           </Link>
//           <Link href="/contact" className="hover:underline">
//             Contact
//           </Link>
//         </div>
//         <div className="flex gap-4">
//           {user ? (
//             <span>Hello, {user.id}</span>
//           ) : (
//             <Link href="/signin" className="hover:underline">
//               Sign In
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
