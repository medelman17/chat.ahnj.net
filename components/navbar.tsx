import Link from "next/link";

// import { createClient } from "@/utils/supabase/server";
// import { AuthControls } from "./auth-controls";

export async function Navbar() {
  // const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  return (
    <nav>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl">ahbai</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4"></div>
          {/* <AuthControls userId={user?.id} /> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
